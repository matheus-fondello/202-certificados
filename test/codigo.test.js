import test from "node:test";
import assert from "node:assert/strict";
import { ALFABETO, gerarCodigo, sortearSufixo, validarCodigo } from "../src/codigo.js";

test("gerarCodigo monta o código com o dígito verificador", () => {
  assert.equal(gerarCodigo(2025, "K7PQ"), "202-2025-K7PQ-7");
  assert.equal(gerarCodigo(2026, "ZD5R"), "202-2026-ZD5R-2");
});

test("gerarCodigo aceita o ano como texto", () => {
  assert.equal(gerarCodigo("2026", "HN8S"), gerarCodigo(2026, "HN8S"));
});

test("gerarCodigo recusa ano e sufixo fora do formato", () => {
  assert.throws(() => gerarCodigo(26, "K7PQ"), /Ano inválido/);
  assert.throws(() => gerarCodigo(2026, "K7P"), /Sufixo inválido/);
  assert.throws(() => gerarCodigo(2026, "K7P0"), /Sufixo inválido/);
  assert.throws(() => gerarCodigo(2026, "K7PI"), /Sufixo inválido/);
});

test("validarCodigo aceita um código inteiro", () => {
  assert.equal(validarCodigo("202-2025-K7PQ-7"), true);
  assert.equal(validarCodigo("202-2025-B3TN-0"), true);
});

test("validarCodigo recusa o dígito verificador trocado", () => {
  assert.equal(validarCodigo("202-2025-K7PQ-6"), false);
  assert.equal(validarCodigo("202-2026-ZD5R-9"), false);
});

test("validarCodigo recusa formato errado", () => {
  assert.equal(validarCodigo("202-2025-K7PQ"), false);
  assert.equal(validarCodigo("203-2025-K7PQ-7"), false);
  assert.equal(validarCodigo("202-25-K7PQ-7"), false);
  assert.equal(validarCodigo("202-2025-K7PQ-X"), false);
  assert.equal(validarCodigo(""), false);
  assert.equal(validarCodigo(undefined), false);
});

test("validarCodigo exige o código em maiúsculas", () => {
  assert.equal(validarCodigo("202-2025-k7pq-7"), false);
});

test("sortearSufixo devolve quatro caracteres do alfabeto", () => {
  for (let tentativa = 0; tentativa < 50; tentativa += 1) {
    const sufixo = sortearSufixo();
    assert.equal(sufixo.length, 4);
    for (const caractere of sufixo) {
      assert.ok(ALFABETO.includes(caractere), `caractere fora do alfabeto: ${caractere}`);
    }
  }
});
