# Customer Registration Form

Teste técnico full-stack — monorepo com API REST (NestJS) e frontend (Next.js 14), autenticação JWT, backoffice administrativo e criptografia de dados sensíveis.

---

## Visão geral

| Camada              | Tecnologia                                               |
| ------------------- | -------------------------------------------------------- |
| Monorepo            | Turborepo + pnpm workspaces                              |
| API                 | NestJS 10 + Fastify + TypeORM + PostgreSQL               |
| Frontend            | Next.js 14 App Router + Framer Motion                    |
| Autenticação        | JWT com Argon2id (senha) + JwtAuthGuard customizado      |
| Criptografia de CPF | Argon2id (hash irreversível) + HMAC-SHA256 (fingerprint) |
| Testes              | Vitest (unitários + integração) + Playwright (E2E)       |
| Containers          | Docker multi-stage + Docker Compose                      |
| CI/CD               | GitHub Actions (lint → test → build → docker-build)      |

---

## Funcionalidades

### Formulário de cadastro público

- Campos: nome, CPF (com máscara), e-mail, cor preferida, observações (opcional)
- Validação de CPF (algoritmo de dígitos verificadores) no frontend e no backend
- Checagem de unicidade de CPF e e-mail sem armazenar o número em texto claro
- Tela de sucesso animada com comprovante (CPF exibido parcialmente: `***.982.247-**`)

### Backoffice administrativo

- Login protegido com senha criptografada via Argon2id
- Dashboard com KPIs: total de clientes, cores distintas, cor mais popular, paginação atual
- Tabela paginada com busca (nome, CPF mascarado, e-mail) e filtro por cor
- Modal de detalhes do cliente com animação Framer Motion
- Skeleton loading para eliminar flicker de transição

### API REST documentada

- Swagger UI em `/docs` com suporte a Bearer Token (botão Authorize)
- Rate limiting em `POST /customers` (ThrottlerGuard)
- Respostas no formato `{ success, data, timestamp }` via ResponseInterceptor
- Tratamento de erros centralizado via GlobalExceptionFilter

---

## Arquitetura

Segue Domain-Driven Design (DDD) estrito:

```
src/
├── domain/          → entidades, value objects, interfaces de repositório
├── application/     → use cases, DTOs
├── infrastructure/  → TypeORM entities, repositories, HTTP controllers, migrations
└── shared/          → filtros, interceptors, guards, validações
```

**Fluxo de dependência:** `infrastructure → application → domain`

O domínio não depende de nada além de si mesmo.

---

## Segurança do CPF

O CPF nunca é armazenado em texto claro. Três colunas substituem o campo original:

| Coluna            | Algoritmo                    | Propósito                                                                 |
| ----------------- | ---------------------------- | ------------------------------------------------------------------------- |
| `cpf_hash`        | Argon2id                     | Hash irreversível para armazenamento seguro                               |
| `cpf_fingerprint` | HMAC-SHA256 com `JWT_SECRET` | Determinístico — permite checar unicidade com `WHERE cpf_fingerprint = ?` |
| `cpf_masked`      | String estática              | Exibição: `***.XXX.XXX-**`                                                |

---

## Requisitos

- Node.js 20+
- pnpm 9.4.0 (`corepack enable pnpm`)
- Docker Desktop

---

## Setup local

### 1. Clonar e instalar dependências

```bash
git clone git@github.com-personal:LucasF0904/customer-registration-form.git
cd customer-registration-form
pnpm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
```

Edite `.env` e `apps/api/.env` conforme necessário. Os valores padrão já funcionam localmente.

> **Porta do banco:** o `docker-compose.override.yml` mapeia `5433:5432` para evitar conflito com PostgreSQL local na porta 5432.

### 3. Subir o banco

```bash
docker compose up -d postgres
```

### 4. Subir a API

```bash
cd apps/api
pnpm build
node -r dotenv/config dist/main.js
```

API disponível em `http://localhost:3001` · Swagger em `http://localhost:3001/docs`

### 5. Subir o frontend

Em outro terminal, da raiz do projeto:

```bash
pnpm dev
```

Frontend disponível em `http://localhost:3000`

---

## Conta de administrador

Criada automaticamente pela migration seed:

| Campo  | Valor            |
| ------ | ---------------- |
| E-mail | `admin@eteg.com` |
| Senha  | `Admin@123`      |

O ícone de cadeado no canto superior direito do formulário abre o modal de login.

---

## Endpoints da API

| Método | Rota               | Auth | Descrição                        |
| ------ | ------------------ | ---- | -------------------------------- |
| `GET`  | `/health`          | —    | Health check                     |
| `GET`  | `/colors`          | —    | Cores disponíveis                |
| `POST` | `/customers`       | —    | Registrar cliente                |
| `POST` | `/auth/login`      | —    | Obter JWT                        |
| `GET`  | `/customers/stats` | JWT  | Estatísticas                     |
| `GET`  | `/customers`       | JWT  | Listar (paginado, busca, filtro) |
| `GET`  | `/customers/:id`   | JWT  | Detalhe do cliente               |
| `GET`  | `/docs`            | —    | Swagger UI                       |

---

## Testes

```bash
# Unitários e integração
pnpm test

# Lint
pnpm lint

# E2E (Playwright) — requer API e frontend rodando
pnpm --filter web exec playwright test
```

---

## Docker Compose (ambiente completo)

```bash
# Subir todos os serviços (banco + API + frontend)
docker compose up -d

# Verificar
curl http://localhost:3001/health
curl http://localhost:3000
```

---

## CI/CD

GitHub Actions executa 4 jobs em sequência:

1. **lint** — ESLint em toda a codebase
2. **test** — Vitest com PostgreSQL via `services`
3. **build** — `turbo run build`
4. **docker-build** — build das imagens Docker (sem push)

---

## Estrutura do monorepo

```
customer-registration-form/
├── apps/
│   ├── api/           → NestJS 10 (Fastify, TypeORM, Argon2id)
│   └── web/           → Next.js 14 App Router (Framer Motion)
├── packages/
│   ├── shared/        → DTOs e tipos compartilhados entre API e Web
│   └── tsconfig/      → tsconfig base compartilhado
├── docker-compose.yml
├── docker-compose.override.yml
└── turbo.json
```
