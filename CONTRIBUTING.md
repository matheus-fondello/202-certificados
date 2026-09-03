# Como contribuir

Projeto pequeno, convenções curtas. Leia antes de abrir o primeiro PR.

## Branch e commit

- Uma branch por mudança, saindo da `main`.
- Commit em português, no imperativo, primeira linha com até 60 caracteres:
  `Aceita código em minúsculas`, `Mostra a carga horária no certificado`.
- Corpo do commit só quando a primeira linha não der conta de explicar.

## Testes

- Toda mudança de comportamento leva um teste, no arquivo de teste
  correspondente: `test/codigo.test.js` para o formato do código,
  `test/certificados.test.js` para a lista e a emissão, `test/app.test.js`
  para as rotas.
- `npm test` tem que passar antes de abrir o PR. É o mesmo comando que roda
  no CI.
- Teste que precisa gravar trabalha numa cópia temporária do JSON: use o
  `copiaTemporaria()` de `test/certificados.test.js`. Nenhum teste escreve em
  `dados/certificados.json`.

## Onde o código mora

- Formatação e normalização moram em `src/` (`src/formatar.js`,
  `src/certificados.js`) e são reaproveitadas. Não duplique essas contas nas
  rotas nem nas views: se a view precisa de uma data formatada, ela chama o
  que já existe.
- As views são de apresentação. Regra de negócio não desce para o EJS.

## Coisas que não se mexem

- **O dígito verificador de `src/codigo.js` não muda.** Mudar os pesos, o
  módulo ou o alfabeto invalida todos os certificados já emitidos: os códigos
  que estão impressos e divulgados param de validar. Se precisar mesmo de um
  formato novo, ele nasce ao lado do antigo, e o antigo continua valendo.
- **`dados/certificados.json` não se edita à mão.** Certificado entra por
  `scripts/emitir.js` ou pela rota `POST /admin/certificados`, que são quem
  sabe sortear um código livre e gravar o registro completo.

## Pull request

Descreva três coisas: o que mudou, por que mudou e como você verificou. "Rodei
`npm test`" é parte da resposta, não a resposta inteira — diga também o que
você abriu no navegador ou chamou com `curl`.
