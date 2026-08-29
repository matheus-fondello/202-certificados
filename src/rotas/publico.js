import { Router } from "express";
import { buscar, normalizarCodigo } from "../certificados.js";
import { validarCodigo } from "../codigo.js";

const rotas = Router();

rotas.get("/", (requisicao, resposta) => {
  resposta.render("inicio");
});

rotas.post("/buscar", (requisicao, resposta) => {
  const codigo = normalizarCodigo(requisicao.body?.codigo);
  if (!codigo) {
    resposta.redirect("/");
    return;
  }
  resposta.redirect(`/c/${encodeURIComponent(codigo)}`);
});

rotas.get("/c/:codigo", (requisicao, resposta) => {
  const codigo = normalizarCodigo(requisicao.params.codigo);
  // Código com formato ou dígito verificador errado nem chega na lista.
  const certificado = validarCodigo(codigo) ? buscar(codigo) : undefined;
  if (!certificado) {
    resposta.status(404).render("nao-encontrado");
    return;
  }
  resposta.render("certificado", { certificado });
});

export default rotas;
