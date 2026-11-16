# Campus Desk

API REST e interface web para gerenciamento de solicitações de suporte técnico do campus.
O sistema permite cadastrar chamados, acompanhar situações, pesquisar registros e organizar a fila de atendimento.

## Links

- Frontend publicado: informe aqui a URL pública gerada pelo Cloudflare Pages.
- API pública: <https://glorious-spoon-q77vpx9qv74ph65qw-3333.app.github.dev/api>
- Painel de publicação: <https://dash.cloudflare.com/8c1b884f69c84f0803b49b23aa881be4/workers/services/view/rapid-river-121a/production>
- Repositório: informe aqui a URL do repositório no GitHub.

> O endereço do painel da Cloudflare é usado para administração. Para avaliação, prefira informar a URL pública do frontend, terminada em `pages.dev`, no primeiro link.

## Tecnologias

- Node.js 22 ou superior
- Express 5
- CORS
- React 19
- Vite 7
- JavaScript

## Estrutura

```text
.
├── backend/
│   ├── package.json
│   └── src/index.js
├── frontend/
│   ├── public/config.js
│   ├── src/App.jsx
│   ├── src/service.js
│   └── package.json
└── README.md
```

## Execução local

### Backend

```bash
cd backend
npm install
npm start
```

A API será iniciada na porta `3333`:

```text
http://localhost:3333
```

Para desenvolvimento com reinício automático:

```bash
npm run dev
```

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O Vite disponibiliza a interface no endereço mostrado no terminal, normalmente `http://localhost:5173`.
Durante o desenvolvimento local, o Vite encaminha `/api` para `http://127.0.0.1:3333`.

## Configuração da API

O arquivo `frontend/public/config.js` define o endereço usado pelo frontend:

```js
window.CAMPUS_API_URL = "https://seu-endereco-publico-da-api";
```

O valor deve conter apenas a origem da API, sem `/api` no final. O arquivo `frontend/src/service.js` acrescenta esse caminho automaticamente.

Para usar o backend localmente com o proxy do Vite, deixe o valor vazio:

```js
window.CAMPUS_API_URL = "";
```

## Rotas da API

Todas as rotas começam com `/api`.

| Método | Rota | Descrição | Sucesso |
| --- | --- | --- | --- |
| `GET` | `/summary` | Retorna o total e a quantidade por situação. | `200` |
| `GET` | `/tickets` | Lista chamados, com busca, filtros e ordenação. | `200` |
| `GET` | `/tickets/:id` | Consulta um chamado pelo identificador. | `200` |
| `POST` | `/tickets` | Cadastra um novo chamado. | `201` |
| `PUT` | `/tickets/:id` | Atualiza um chamado existente. | `200` |
| `DELETE` | `/tickets/:id` | Exclui um chamado resolvido. | `200` |

### Cadastro

```http
POST /api/tickets
Content-Type: application/json
```

```json
{
	"title": "Computador sem rede",
	"description": "O computador do laboratorio perdeu a conexao.",
	"requester": "Ana",
	"category": "rede",
	"priority": "alta"
}
```

Novos chamados recebem automaticamente `status: "aberto"`, um identificador crescente e `createdAt`.

### Busca, filtros e ordenação

```text
GET /api/tickets?search=ana&status=aberto&category=rede&priority=alta&sort=priority
```

- `search`: pesquisa no título ou no solicitante.
- `status`: filtra por situação.
- `category`: filtra por categoria.
- `priority`: filtra por prioridade.
- `sort=createdAt`: ordena pelos chamados mais recentes.
- `sort=priority`: ordena pela prioridade mais alta.

### Atualização

```http
PUT /api/tickets/1
Content-Type: application/json
```

O corpo deve conter os campos atualizados. O `id` e o `createdAt` originais são preservados.

### Exclusão

Somente chamados com situação `resolvido` podem ser excluídos. Caso contrário, a API retorna `400`. Um identificador inexistente retorna `404`.

## Modelo de chamado

```json
{
	"id": 1,
	"title": "Computador sem rede",
	"description": "O computador do laboratorio perdeu a conexao.",
	"requester": "Ana",
	"category": "rede",
	"priority": "alta",
	"status": "aberto",
	"createdAt": "2026-11-16T12:00:00.000Z"
}
```

As situações utilizadas pela interface são `aberto`, `em_atendimento` e `resolvido`.
As categorias são `hardware`, `software` e `rede`. As prioridades são `baixa`, `media` e `alta`.

## Publicação

O backend roda no GitHub Codespaces:

```bash
cd backend
npm start
```

A porta `3333` deve ser encaminhada e definida como **Public** na aba **PORTS** do Codespaces.
Depois, a URL HTTPS dessa porta deve ser configurada em `frontend/public/config.js`.

O frontend é publicado como aplicação estática no Cloudflare Pages com:

```text
Diretório do projeto: frontend
Comando de build: npm run build
Diretório de saída: dist
```

## Organização do código

- `backend/src/index.js`: servidor Express, rotas, array de chamados e contador de IDs.
- `frontend/src/service.js`: centraliza as chamadas HTTP para a API.
- `frontend/src/App.jsx`: interface, formulários, filtros e ações dos chamados.
- `frontend/src/constants.js`: valores exibidos para situações, categorias e prioridades.
- `frontend/public/config.js`: endereço público usado pelo frontend.

## Limitações

- Os dados são armazenados em memória e são perdidos quando o backend reinicia.
- O backend depende do Codespace e do processo Node ativos.
- O Codespace pode ser pausado por inatividade, deixando a API temporariamente indisponível.
- A aplicação não possui autenticação, usuários ou banco de dados.
- Esta é uma aplicação acadêmica para dados fictícios.

## Integrantes

- Guilherme de Oliveira Batista
