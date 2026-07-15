import { parseArgs } from "node:util";
import { emitir } from "../src/certificados.js";

// Emite um certificado pela linha de comando:
//
//   node scripts/emitir.js \
//     --nome "Fulana de Tal" \
//     --trilha "Trilha 1: fundamentos" \
//     --concluido-em 2026-08-14 \
//     --carga 32 \
//     --modulos "Contexto e prompt,Projeto final"
//
// O código sai sorteado; quem emite não escolhe.
const { values } = parseArgs({
  options: {
    nome: { type: "string" },
    trilha: { type: "string" },
    "concluido-em": { type: "string" },
    carga: { type: "string" },
    modulos: { type: "string", default: "" }
  }
});

const faltando = ["nome", "trilha", "concluido-em", "carga"].filter((opcao) => !values[opcao]);
if (faltando.length > 0) {
  console.error(`Faltou informar: ${faltando.map((opcao) => `--${opcao}`).join(", ")}`);
  console.error('Exemplo: node scripts/emitir.js --nome "Fulana de Tal" --trilha "Trilha 1: fundamentos" --concluido-em 2026-08-14 --carga 32');
  process.exit(1);
}

try {
  const certificado = emitir({
    nome: values.nome,
    trilha: values.trilha,
    concluido_em: values["concluido-em"],
    carga_horaria: Number(values.carga),
    modulos: values.modulos.split(",").map((modulo) => modulo.trim()).filter(Boolean)
  });
  console.log(`Certificado emitido: ${certificado.codigo}`);
  console.log(`${certificado.nome} · ${certificado.trilha}`);
} catch (erro) {
  console.error(`Não deu para emitir: ${erro.message}`);
  process.exit(1);
}
