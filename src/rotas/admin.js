import { Router } from "express";
import { listar } from "../certificados.js";
import { formatarData } from "../formatar.js";

const rotas = Router();

// Tudo abaixo de /admin exige o token que está na variável de ambiente
// ADMIN_TOKEN, mandado no cabeçalho Authorization: Bearer <token>.
function exigirToken(requisicao, resposta, proximo) {
  const esperado = process.env.ADMIN_TOKEN;
  const cabecalho = requisicao.get("authorization") ?? "";
  const enviado = /^Bearer (.+)$/.exec(cabecalho)?.[1];
  if (!esperado || enviado !== esperado) {
    resposta.status(401).json({ erro: "Token ausente ou inválido" });
    return;
  }
  proximo();
}

rotas.get("/admin", exigirToken, (requisicao, resposta) => {
  resposta.render("admin", { certificados: listar(), formatarData });
});

export default rotas;
