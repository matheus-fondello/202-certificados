import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { gerarCodigo, sortearSufixo } from "./codigo.js";

// A lista de certificados emitidos. O arquivo é o banco de dados do projeto:
// é lido a cada consulta, porque são poucos registros e assim o que a rota
// administrativa grava aparece na consulta pública na hora.
export const ARQUIVO_PADRAO = fileURLToPath(new URL("../dados/certificados.json", import.meta.url));

// Limpa o que a pessoa digitou antes de procurar: tira o espaço das pontas e
// junta espaços repetidos do meio.
export function normalizarCodigo(texto) {
  return String(texto ?? "").trim().replace(/\s+/g, " ");
}

export function listar(arquivo = ARQUIVO_PADRAO) {
  return JSON.parse(readFileSync(arquivo, "utf8"));
}

export function buscar(codigo, arquivo = ARQUIVO_PADRAO) {
  return listar(arquivo).find((certificado) => certificado.codigo === codigo);
}

// Acrescenta um certificado à lista e devolve o registro gravado. O código é
// sorteado aqui: quem emite não escolhe o sufixo, e o sorteio se repete até
// cair num código que ainda não existe. O ano do código é o ano da conclusão.
export function emitir(dados, arquivo = ARQUIVO_PADRAO) {
  const nome = String(dados?.nome ?? "").trim();
  const trilha = String(dados?.trilha ?? "").trim();
  const concluido_em = String(dados?.concluido_em ?? "").trim();
  const carga_horaria = Number(dados?.carga_horaria);
  const modulos = Array.isArray(dados?.modulos) ? dados.modulos.map(String) : [];

  if (!nome || !trilha) {
    throw new Error("Nome e trilha são obrigatórios");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(concluido_em)) {
    throw new Error("A data de conclusão precisa estar no formato AAAA-MM-DD");
  }
  if (!Number.isInteger(carga_horaria) || carga_horaria <= 0) {
    throw new Error("A carga horária precisa ser um número inteiro de horas");
  }

  const certificados = listar(arquivo);
  const emUso = new Set(certificados.map((certificado) => certificado.codigo));
  const ano = concluido_em.slice(0, 4);

  let codigo;
  for (let tentativa = 0; tentativa < 100; tentativa += 1) {
    const candidato = gerarCodigo(ano, sortearSufixo());
    if (!emUso.has(candidato)) {
      codigo = candidato;
      break;
    }
  }
  if (!codigo) {
    throw new Error("Não foi possível sortear um código livre");
  }

  const certificado = { codigo, nome, trilha, concluido_em, carga_horaria, modulos, revogado_em: null };
  certificados.push(certificado);
  writeFileSync(arquivo, `${JSON.stringify(certificados, null, 2)}\n`);
  return certificado;
}
