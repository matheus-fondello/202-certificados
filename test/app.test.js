import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";

const CODIGO_EXISTENTE = "202-2025-K7PQ-7";
const CODIGO_INEXISTENTE = "202-2026-ZZZZ-9";

let servidor;
let base;

before(() => new Promise((pronto) => {
  servidor = app.listen(0, () => {
    base = `http://localhost:${servidor.address().port}`;
    pronto();
  });
}));

after(() => new Promise((pronto) => servidor.close(pronto)));

test("GET / responde a página de consulta", async () => {
  const resposta = await fetch(`${base}/`);
  assert.equal(resposta.status, 200);
  const html = await resposta.text();
  assert.match(html, /Verificar/);
  assert.match(html, /name="codigo"/);
});

test("GET /c/<código> mostra o certificado", async () => {
  const resposta = await fetch(`${base}/c/${CODIGO_EXISTENTE}`);
  assert.equal(resposta.status, 200);
  const html = await resposta.text();
  assert.match(html, /Aurora Quintal Medeiros/);
  assert.match(html, /Trilha 1: fundamentos/);
});

test("GET /c/<código> responde 404 quando não existe", async () => {
  const resposta = await fetch(`${base}/c/${CODIGO_INEXISTENTE}`);
  assert.equal(resposta.status, 404);
});

test("POST /buscar redireciona para a página do certificado", async () => {
  const resposta = await fetch(`${base}/buscar`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ codigo: ` ${CODIGO_EXISTENTE} ` }).toString(),
    redirect: "manual"
  });
  assert.equal(resposta.status, 302);
  assert.equal(resposta.headers.get("location"), `/c/${CODIGO_EXISTENTE}`);
});
