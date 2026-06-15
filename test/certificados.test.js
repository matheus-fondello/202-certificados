import test from "node:test";
import assert from "node:assert/strict";
import { buscar, listar, normalizarCodigo } from "../src/certificados.js";

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
