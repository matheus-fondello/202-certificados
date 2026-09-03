# Certificados da 202

Site público onde qualquer pessoa confere se um certificado da 202 é verdadeiro.
Quem recebe um currículo, quem contrata, quem quer ter certeza de que aquele
código no rodapé do PDF existe mesmo: digita o código, vê o nome, a trilha e a
data de conclusão.

Por trás é pequeno de propósito. Os certificados emitidos ficam numa lista em
`dados/certificados.json`, o site é Express com EJS, e não há banco de dados
nem framework de front. Quem emite certificados usa o script do terminal ou a
área administrativa, as duas protegidas por um token.

## Como rodar

```sh
npm install
npm start
```

Abra <http://localhost:3000>.

Para desenvolver, `npm run dev` sobe o servidor reiniciando a cada arquivo
salvo.

## Como rodar os testes

```sh
npm test
```

São testes de `node:test`, sem dependência de desenvolvimento nenhuma. Eles
sobem o app numa porta sorteada e chamam as rotas de verdade. A emissão é
testada numa cópia temporária do JSON, nunca na lista real.

## Como emitir um certificado

Pelo terminal:

```sh
node scripts/emitir.js \
  --nome "Fulana de Tal" \
  --trilha "Trilha 2: engenharia com agentes" \
  --concluido-em 2026-08-14 \
  --carga 48 \
  --modulos "Agentes no terminal,Projeto final"
```

Ou pela rota administrativa, com o token no cabeçalho:

```sh
curl -X POST http://localhost:3000/admin/certificados \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Fulana de Tal",
    "trilha": "Trilha 2: engenharia com agentes",
    "concluido_em": "2026-08-14",
    "carga_horaria": 48,
    "modulos": ["Agentes no terminal", "Projeto final"]
  }'
```

Nos dois casos o código sai sorteado: quem emite não escolhe o código. A lista
do que já foi emitido sai de `GET /admin`, com o mesmo cabeçalho de token do
exemplo acima (o navegador sozinho não passa: é `curl`).

## O código do certificado

O formato é `202-AAAA-XXXX-D`: o prefixo da 202, o ano, quatro caracteres
sorteados e um dígito verificador. O alfabeto do sufixo não tem I, O, 0 nem 1,
para ninguém precisar adivinhar o que está lido no papel. A conta do dígito
está em `src/codigo.js`.

## Configuração

Copie `.env.example` para `.env` e ajuste:

| Variável | O que é |
| --- | --- |
| `PORT` | Porta do servidor. O padrão é 3000. |
| `ADMIN_TOKEN` | Token da área administrativa e da rota de emissão. Troque antes de pôr no ar. |

## Licença

MIT. Veja `LICENSE`.
