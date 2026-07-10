import test from "node:test";
import assert from "node:assert/strict";
import { copyFileSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ARQUIVO_PADRAO, buscar, emitir, listar, normalizarCodigo } from "../src/certificados.js";
import { validarCodigo } from "../src/codigo.js";

// Emitir grava no arquivo, então os testes de emissão trabalham numa cópia
// descartável: a lista de verdade nunca é tocada por um teste.
function copiaTemporaria() {
  const arquivo = join(mkdtempSync(join(tmpdir(), "certificados-202-")), "certificados.json");
  copyFileSync(ARQUIVO_PADRAO, arquivo);
  return arquivo;
}

test("normalizarCodigo tira o espaço das pontas", () => {
  assert.equal(normalizarCodigo("  202-2025-K7PQ-7 "), "202-2025-K7PQ-7");
  assert.equal(normalizarCodigo("\n202-2025-K7PQ-7\t"), "202-2025-K7PQ-7");
});

test("normalizarCodigo junta espaços repetidos do meio", () => {
  assert.equal(normalizarCodigo("202-2025   K7PQ-7"), "202-2025 K7PQ-7");
});

test("normalizarCodigo aceita texto vazio e ausente", () => {
  assert.equal(normalizarCodigo(""), "");
  assert.equal(normalizarCodigo(undefined), "");
  assert.equal(normalizarCodigo(null), "");
});

test("listar devolve os certificados do arquivo", () => {
  const certificados = listar();
  assert.ok(certificados.length > 0);
  for (const certificado of certificados) {
    assert.ok(certificado.codigo, "certificado sem código");
    assert.ok(certificado.nome, "certificado sem nome");
  }
});

test("buscar acha um certificado que existe", () => {
  const certificado = buscar("202-2025-K7PQ-7");
  assert.equal(certificado.nome, "Aurora Quintal Medeiros");
  assert.equal(certificado.trilha, "Trilha 1: fundamentos");
});

test("buscar devolve undefined para um código que não existe", () => {
  assert.equal(buscar("202-2026-9999-0"), undefined);
  assert.equal(buscar(""), undefined);
});

test("emitir acrescenta um certificado com código válido", () => {
  const arquivo = copiaTemporaria();
  const antes = listar(arquivo).length;

  const certificado = emitir({
    nome: "Fulana de Teste",
    trilha: "Trilha 1: fundamentos",
    concluido_em: "2026-07-09",
    carga_horaria: 32,
    modulos: ["Contexto e prompt"]
  }, arquivo);

  assert.equal(validarCodigo(certificado.codigo), true);
  assert.match(certificado.codigo, /^202-2026-/);
  assert.equal(certificado.revogado_em, null);

  const depois = listar(arquivo);
  assert.equal(depois.length, antes + 1);
  assert.equal(depois.at(-1).codigo, certificado.codigo);
  assert.equal(buscar(certificado.codigo, arquivo).nome, "Fulana de Teste");
});

test("emitir não sorteia um código que já existe", () => {
  const arquivo = copiaTemporaria();
  const codigos = new Set(listar(arquivo).map((certificado) => certificado.codigo));

  for (let vez = 0; vez < 20; vez += 1) {
    const certificado = emitir({
      nome: `Fulana ${vez}`,
      trilha: "Trilha 1: fundamentos",
      concluido_em: "2026-07-09",
      carga_horaria: 32,
      modulos: []
    }, arquivo);
    assert.equal(codigos.has(certificado.codigo), false, `código repetido: ${certificado.codigo}`);
    codigos.add(certificado.codigo);
  }
});

test("emitir recusa dados incompletos", () => {
  const arquivo = copiaTemporaria();
  const conteudo = readFileSync(arquivo, "utf8");

  assert.throws(() => emitir({ trilha: "Trilha 1: fundamentos", concluido_em: "2026-07-09", carga_horaria: 32 }, arquivo), /obrigatórios/);
  assert.throws(() => emitir({ nome: "Fulana", trilha: "Trilha 1: fundamentos", concluido_em: "09/07/2026", carga_horaria: 32 }, arquivo), /AAAA-MM-DD/);
  assert.throws(() => emitir({ nome: "Fulana", trilha: "Trilha 1: fundamentos", concluido_em: "2026-07-09", carga_horaria: "muitas" }, arquivo), /carga horária/);

  assert.equal(readFileSync(arquivo, "utf8"), conteudo, "o arquivo mudou mesmo com dados inválidos");
});
