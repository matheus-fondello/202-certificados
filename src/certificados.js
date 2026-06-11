import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

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
