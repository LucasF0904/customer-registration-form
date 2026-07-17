# Customer Registration Form

Formulário de cadastro de clientes desenvolvido como teste técnico para a **Eteg**.

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Stack Técnica](#stack-técnica)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Rodando Localmente](#rodando-localmente)
- [Rodando com Docker](#rodando-com-docker)
- [Testes](#testes)
- [Endpoints da API](#endpoints-da-api)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Estrutura do Monorepo](#estrutura-do-monorepo)

---

## Sobre o Projeto

Aplicação full-stack que permite o cadastro único de clientes (unicidade por CPF e e-mail) com:

- Validação completa de CPF (algoritmo dos dígitos verificadores)
- Seleção de cor preferida do arco-íris via swatches visuais
- Feedback de sucesso ou erro imediato após a submissão
- Layout responsivo com suporte a dark/light mode
- Rate limiting para proteção contra spam

---

## Stack Técnica

| Camada           | Tecnologia                                        |
| ---------------- | ------------------------------------------------- |
| Monorepo         | Turborepo + pnpm workspaces                       |
| Backend          | NestJS + Fastify + TypeORM                        |
| Frontend         | Next.js 14 + React Hook Form + Zod + Tailwind CSS |
| Banco de dados   | PostgreSQL                                        |
| Validação (API)  | class-validator + class-transformer               |
| Testes unitários | Vitest                                            |
| Testes E2E       | Playwright                                        |
| Logger           | Pino (JSON em produção, pretty em dev)            |
| Docs             | Swagger/OpenAPI (apenas em dev)                   |
| Infra            | Docker + Docker Compose                           |
| CI               | GitHub Actions                                    |

---

## Arquitetura

O projeto segue **Domain-Driven Design (DDD)** com separação estrita de camadas:

```
apps/api/src/
├── colors/
│   ├── application/      # use cases
│   ├── domain/           # entities, interfaces de repositório
│   └── infrastructure/   # TypeORM entities, repos, controllers
└── customers/
    ├── application/      # use cases, DTOs
    ├── domain/           # entities, interfaces de repositório
    └── infrastructure/   # TypeORM entities, repos, controllers
```

**Fluxo de dependência:** `infrastructure → application → domain` (o domínio não conhece nada além de si mesmo).

O módulo `packages/shared` exporta tipos TypeScript e DTOs consumidos tanto pela API quanto pelo frontend.

---

## Pré-requisitos

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- Docker e Docker Compose (para rodar com banco de dados)

---

## Rodando Localmente

### 1. Instalação

```bash
git clone git@github.com:LucasF0904/customer-registration-form.git
cd customer-registration-form
pnpm install
```

### 2. Variáveis de ambiente

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
```

Edite os arquivos `.env` conforme necessário. Os valores padrão já funcionam com o Docker Compose.

### 3. Banco de dados

```bash
# Sobe apenas o PostgreSQL
docker compose up postgres -d
```

As migrations rodam automaticamente quando a API inicia (`migrationsRun: true`).

### 4. Iniciar

```bash
# Sobe API (porta 3001) + Web (porta 3000) em paralelo
pnpm dev
```

| Serviço  | URL                          |
| -------- | ---------------------------- |
| Frontend | http://localhost:3000        |
| API      | http://localhost:3001        |
| Swagger  | http://localhost:3001/docs   |
| Health   | http://localhost:3001/health |

> O Swagger só está disponível em `NODE_ENV !== 'production'`.

---

## Rodando com Docker

```bash
# Sobe tudo: postgres + api + web
docker compose up -d

# Com rebuild das imagens
docker compose up -d --build

# Verificar logs
docker compose logs -f api
```

Os serviços ficam disponíveis nas mesmas portas do ambiente local.

---

## Testes

```bash
# Testes unitários e de integração (todos os pacotes)
pnpm test

# Com coverage
pnpm test:coverage

# Testes E2E com Playwright
pnpm test:e2e
```

### Cobertura por camada

| Camada         | Mínimo |
| -------------- | ------ |
| Domain         | 90%    |
| Application    | 80%    |
| Infrastructure | 70%    |

---

## Endpoints da API

### `GET /health`

Verifica a saúde da aplicação e a conectividade com o banco de dados.

```json
{
  "status": "ok",
  "info": { "database": { "status": "up" } }
}
```

---

### `GET /colors`

Retorna as 7 cores do arco-íris disponíveis para seleção.

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "Vermelho", "hexCode": "#E53E3E", "createdAt": "..." },
    ...
  ]
}
```

---

### `POST /customers`

Cadastra um novo cliente. CPF e e-mail devem ser únicos.

**Request:**

```json
{
  "name": "Maria Oliveira",
  "cpf": "529.982.247-25",
  "email": "maria@exemplo.com",
  "colorId": "uuid-da-cor",
  "notes": "Observações opcionais"
}
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Maria Oliveira",
    "cpf": "529.982.247-25",
    "email": "maria@exemplo.com",
    "color": { "id": "uuid", "name": "Vermelho", "hexCode": "#E53E3E" },
    "notes": "Observações opcionais",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Erros possíveis:**

| Status | Código            | Descrição                                    |
| ------ | ----------------- | -------------------------------------------- |
| 400    | VALIDATION_ERROR  | CPF inválido ou campos obrigatórios ausentes |
| 404    | NOT_FOUND         | Cor não encontrada                           |
| 409    | CONFLICT          | CPF ou e-mail já cadastrado                  |
| 429    | TOO_MANY_REQUESTS | Rate limit excedido (5 req/min)              |

---

## Variáveis de Ambiente

### Raiz / Docker Compose

| Variável      | Padrão                  | Descrição                 |
| ------------- | ----------------------- | ------------------------- |
| `DB_HOST`     | `localhost`             | Host do PostgreSQL        |
| `DB_PORT`     | `5432`                  | Porta do PostgreSQL       |
| `DB_USERNAME` | `postgres`              | Usuário do banco          |
| `DB_PASSWORD` | `postgres`              | Senha do banco            |
| `DB_NAME`     | `customer_registration` | Nome do banco             |
| `API_PORT`    | `3001`                  | Porta exposta da API      |
| `WEB_PORT`    | `3000`                  | Porta exposta do frontend |

### API (`apps/api/.env`)

| Variável         | Padrão                  | Descrição                        |
| ---------------- | ----------------------- | -------------------------------- |
| `NODE_ENV`       | `development`           | Ambiente                         |
| `PORT`           | `3001`                  | Porta interna da API             |
| `THROTTLE_TTL`   | `60000`                 | Janela do rate limit (ms)        |
| `THROTTLE_LIMIT` | `5`                     | Máximo de requisições por janela |
| `FRONTEND_URL`   | `http://localhost:3000` | Origem permitida pelo CORS       |

### Web (`apps/web`)

| Variável              | Descrição                          |
| --------------------- | ---------------------------------- |
| `NEXT_PUBLIC_API_URL` | URL da API consumida pelo frontend |

---

## Estrutura do Monorepo

```
customer-registration-form/
├── apps/
│   ├── api/                    # Backend NestJS
│   │   ├── src/
│   │   │   ├── colors/         # Módulo de cores
│   │   │   ├── customers/      # Módulo de clientes
│   │   │   ├── database/       # Data source + migrations
│   │   │   ├── health/         # Health check
│   │   │   └── shared/         # Filtros, interceptors, pipes
│   │   └── Dockerfile
│   └── web/                    # Frontend Next.js
│       ├── src/
│       │   ├── app/            # App Router (layout, page)
│       │   ├── components/     # Componentes React
│       │   └── lib/            # API client, utils
│       └── Dockerfile
├── packages/
│   ├── shared/                 # Tipos e DTOs compartilhados
│   └── tsconfig/               # Configurações TypeScript base
├── .github/workflows/ci.yml    # Pipeline CI
├── docker-compose.yml
└── turbo.json
```

---

## Cores Disponíveis (seed via migration)

| Nome     | Hex       |
| -------- | --------- |
| Vermelho | `#E53E3E` |
| Laranja  | `#ED8936` |
| Amarelo  | `#ECC94B` |
| Verde    | `#48BB78` |
| Azul     | `#4299E1` |
| Anil     | `#667EEA` |
| Violeta  | `#9F7AEA` |

---

## Pipeline CI

O pipeline executa automaticamente em push para `main` e em pull requests:

```
Lint → Test (com PostgreSQL real) → Build → Docker Build
```

Cada etapa depende da anterior. O build Docker produz imagens mas não faz push para nenhum registry.
