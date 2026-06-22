import { Router } from "express";
import { buscar, normalizarCodigo } from "../certificados.js";

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
  const certificado = buscar(codigo);
  if (!certificado) {
    resposta.status(404).render("nao-encontrado");
    return;
  }
  resposta.render("certificado", { certificado });
});

export default rotas;
