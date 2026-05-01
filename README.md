# Desafio Técnico Full Stack — Academia do Universitário

Aplicação de gestão de tarefas com formulário de cadastro, quadro Kanban e dashboard, construída com NestJS, Prisma, Next.js, Tailwind CSS e TanStack Query.

## Stack

### Backend
- NestJS
- Prisma ORM
- PostgreSQL

### Frontend
- Next.js 16 executado como SPA
- Tailwind CSS
- TanStack Query
- React Hook Form + Zod
- Recharts
- @hello-pangea/dnd

## Arquitetura

O backend foi organizado em camadas:

- `domain`: entidade `Task`, enum de status e contrato do repositório
- `application`: casos de uso e DTOs
- `infrastructure`: controller HTTP, PrismaService e repositório Prisma

Essa estrutura prioriza separação de responsabilidades e reduz acoplamento entre regras de negócio e infraestrutura.

## Funcionalidades entregues

- Cadastro de tarefa com título, descrição e status inicial obrigatórios
- Board Kanban com 5 colunas: A fazer, Em andamento, Bloqueado, Review e Concluído
- Alteração de status apenas por drag and drop
- Modal de confirmação ao mover tarefa com comentário obrigatório
- Persistência do comentário e histórico de mudança de status no banco
- Dashboard com:
  - gráfico de distribuição por status
  - cards por coluna
  - total de cards
  - taxa de concluídos
  - resumo em linha por status
- Exclusão de tarefa

## Como rodar

### Pré-requisitos
- Node.js 22+
- Docker Desktop
- Git

### 1. Subir o banco

Na raiz do projeto:

```bash
docker compose up -d
```

### 2. Backend

Arquivo de ambiente já esperado em `backend/.env`:

```env
DATABASE_URL="postgresql://au:au@localhost:5432/au_todo"
PORT=3001
```

Instalar dependências e rodar migrations:

```bash
cd backend
npm install
npx prisma migrate dev
```

Iniciar backend:

```bash
npm run start:dev
```

Backend disponível em:

```text
http://localhost:3001
```

### 3. Frontend

Arquivo de ambiente esperado em `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Instalar dependências e iniciar:

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em:

```text
http://localhost:3000
```

## Como rodar os testes

### Unitários

```bash
cd backend
npm run test:unit
```

### Integração

Usa PostgreSQL real via Prisma.

```bash
cd backend
npm run test:integration
```

### E2E

Usa aplicação Nest real com chamadas HTTP e banco real.

```bash
cd backend
npm run test:e2e
```

## Decisões técnicas

### Prisma 6 em vez de Prisma 7
Foi utilizada a linha 6 do Prisma porque a 7 introduz um setup novo com `prisma.config.ts` e driver adapters. Para o escopo do desafio, a versão 6 reduz complexidade operacional e mantém a API clássica do `schema.prisma`.

### Status change com histórico
A mudança de status não apenas atualiza a tarefa, mas grava o motivo da transição em `TaskStatusChange`. Isso garante rastreabilidade e atende ao fluxo exigido do modal com comentário obrigatório.

### Board com confirmação de transição
A UX do board foi desenhada para evitar mudança acidental de status. O drag abre um modal de confirmação e só persiste a mudança após justificativa válida.

### TanStack Query
Foi usado para:
- cache de tarefas
- invalidação após create/update/delete
- loading state
- error state
- atualização otimista na troca de status e exclusão

## Trade-offs

- A arquitetura está em camadas e não em hexagonal pura. Foi uma escolha para equilibrar organização e velocidade de entrega.
- A fidelidade visual foi perseguida com base no layout de referência, mas sem compromisso de pixel perfect.
- Os testes foram concentrados no backend. Não há suíte automatizada de frontend nesta entrega.

## Estrutura de testes e pirâmide

A solução possui três níveis no backend:

- Unitários: casos de uso
- Integração: repositório Prisma com banco real
- E2E: fluxo HTTP completo com Nest + Supertest + PostgreSQL

## Uso de IA

Ferramenta utilizada:
- GitHub Copilot / GPT-5.4

Como foi usada:
- apoio para estruturar camadas do backend
- aceleração na composição inicial dos componentes do frontend
- revisão de rotas, DTOs e testes
- refinamento iterativo da interface e do fluxo do Kanban

Exemplo de prompt utilizado:

```text
remova a troca de status por select nos cards, mantenha apenas drag and drop, e ao mover uma tarefa abra um modal com titulo, transicao de status, comentario obrigatorio e botoes de cancelar e confirmar
```

## Histórico de commits

O histórico foi dividido por blocos de evolução para contar a história da entrega, incluindo:
- estrutura inicial
- ajustes de backend
- fluxo do board
- formulário
- dashboard
- testes

## Melhorias futuras

- adicionar filtros por responsável, prioridade e data
- mostrar histórico de mudança de status na UI
- adicionar testes automatizados de frontend
- aproximar ainda mais a interface do layout final do Figma
