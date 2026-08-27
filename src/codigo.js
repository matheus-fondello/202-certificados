import { randomInt } from "node:crypto";

// Código de certificado: 202-AAAA-XXXX-D
//
//   202   prefixo fixo da 202
//   AAAA  ano de conclusão da trilha, quatro dígitos
//   XXXX  quatro caracteres sorteados do alfabeto abaixo
//   D     dígito verificador, de 0 a 9
//
// O alfabeto não tem I, O, 0 nem 1: quem lê o código num papel ou numa tela
// não precisa adivinhar se aquilo é um "O" ou um zero.
export const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// Pesos do dígito verificador, da esquerda para a direita, sobre os oito
// valores do código: os quatro dígitos do ano e as quatro posições dos
// caracteres do sufixo dentro do ALFABETO.
const PESOS = [9, 8, 7, 6, 5, 4, 3, 2];

const FORMATO = /^202-(\d{4})-([ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4})-(\d)$/;

// ATENÇÃO: o dígito verificador é a conta abaixo, e mudá-la invalida todos os
// certificados já emitidos — os códigos que estão impressos, divulgados e
// guardados por quem concluiu a trilha deixam de validar da noite para o dia.
// Não altere os pesos, o módulo nem o alfabeto.
//
// Módulo 11: soma os oito valores multiplicados pelos pesos, tira o resto da
// divisão por 11 e subtrai de 11. O resultado 10 ou 11 vira 0, para o dígito
// caber sempre num algarismo.
export function digitoVerificador(ano, sufixo) {
  const valores = [
    ...String(ano).split("").map(Number),
    ...sufixo.split("").map((caractere) => ALFABETO.indexOf(caractere))
  ];
  const soma = valores.reduce((total, valor, indice) => total + valor * PESOS[indice], 0);
  const digito = 11 - (soma % 11);
  return digito >= 10 ? 0 : digito;
}

// Monta o código completo a partir do ano e de um sufixo de quatro caracteres.
export function gerarCodigo(ano, sufixo) {
  if (!/^\d{4}$/.test(String(ano))) {
    throw new Error(`Ano inválido: ${ano}`);
  }
  if (typeof sufixo !== "string" || sufixo.length !== 4) {
    throw new Error(`Sufixo inválido: ${sufixo}`);
  }
  for (const caractere of sufixo) {
    if (!ALFABETO.includes(caractere)) {
      throw new Error(`Sufixo inválido: ${sufixo}`);
    }
  }
  return `202-${ano}-${sufixo}-${digitoVerificador(ano, sufixo)}`;
}

// Confere o formato e o dígito. O código é sempre maiúsculo.
export function validarCodigo(codigo) {
  const partes = FORMATO.exec(String(codigo ?? ""));
  if (!partes) {
    return false;
  }
  const [, ano, sufixo, digito] = partes;
  return Number(digito) === digitoVerificador(ano, sufixo);
}

// Sorteia um sufixo de quatro caracteres do alfabeto. Quem emite confere se
// o código já existe antes de gravar.
export function sortearSufixo() {
  let sufixo = "";
  for (let posicao = 0; posicao < 4; posicao += 1) {
    sufixo += ALFABETO[randomInt(ALFABETO.length)];
  }
  return sufixo;
}
