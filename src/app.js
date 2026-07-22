import express from "express";
import { fileURLToPath } from "node:url";
import publico from "./rotas/publico.js";
import admin from "./rotas/admin.js";

// Cria o app sem subir servidor nenhum: quem escuta porta é o src/servidor.js,
// e os testes sobem este mesmo app numa porta sorteada.
const app = express();

app.set("view engine", "ejs");
app.set("views", fileURLToPath(new URL("./views", import.meta.url)));

app.use(express.static(fileURLToPath(new URL("../public", import.meta.url))));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(publico);
app.use(admin);

export default app;
