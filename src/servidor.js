import app from "./app.js";

const porta = Number(process.env.PORT ?? 3000);

app.listen(porta, () => {
  console.log(`Certificados da 202 em http://localhost:${porta}`);
});
