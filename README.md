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
- Edição de tarefa por clique no card (título, descrição, prioridade e data limite)
- Histórico completo de alterações (status + campos) em modal, com visualização restrita a usuários permissionados
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

### Arquitetura em camadas
O backend foi estruturado com separação explícita entre `domain`, `application` e `infrastructure`. A motivação principal é manter as regras de negócio isoladas de detalhes de persistência e transporte HTTP. Isso torna cada camada testável de forma independente: casos de uso são testados sem banco, o repositório é testado sem controller, e o E2E cobre o fluxo completo. A alternativa — colocar tudo direto no controller ou no service do NestJS — seria mais rápida inicialmente, mas acoplaria lógica de negócio ao framework e dificultaria a evolução.

### Repositório como contrato
O `TaskRepository` é uma interface definida no domínio. O `PrismaTaskRepository` é uma implementação de infraestrutura. Isso garante que, se o banco mudar (ex: MongoDB, outro ORM), os casos de uso não precisam ser tocados. É o padrão Ports & Adapters aplicado de forma pragmática.

### Prisma 6 em vez de Prisma 7
A versão 7 do Prisma introduz uma mudança de setup com `prisma.config.ts` e driver adapters obrigatórios. Para o escopo do desafio, a versão 6 foi preferida por manter a API clássica do `schema.prisma` e reduzir complexidade operacional sem perda de funcionalidade.

### Histórico de mudança de status
A mudança de status não apenas atualiza o campo da tarefa — ela grava o motivo da transição em `TaskStatusChange` dentro de uma transação. A decisão de manter o histórico no banco (e não só no estado da UI) garante rastreabilidade real e abre caminho para auditorias futuras.

### Controle de acesso ao histórico
O acesso ao histórico foi encapsulado em uma policy dedicada no backend (`TaskHistoryAccessPolicy`) e em uma camada de acesso no frontend (`historyAccess`). Hoje a implementação padrão é permissiva por ainda não existir módulo de autenticação no projeto. Quando autenticação/autorização for adicionada, a regra de negócio passa a liberar o histórico apenas para usuários permissionados sem necessidade de reescrever controllers, componentes ou casos de uso.

### Modal com comentário obrigatório
A UX do board foi desenhada para evitar mudança acidental de status. O drag abre um modal de confirmação e só persiste a mudança após uma justificativa com no mínimo 3 caracteres — tanto no frontend (validação Zod) quanto no backend (ValidationPipe com `MinLength`).

### TanStack Query
Foi utilizado porque oferece cache declarativo, invalidação granular por query key e suporte nativo a atualizações otimistas. A alternativa com `useEffect + fetch` exigiria gerenciar manualmente loading, erro e sincronização de estado — o que aumentaria o risco de inconsistência no board Kanban, especialmente durante o drag.

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

Ferramenta utilizada: GitHub Copilot (modelo Claude Sonnet 4.5)

A IA foi utilizada como pair programmer ao longo de todo o desenvolvimento — não como gerador de código avulso, mas como acelerador de decisões técnicas e implementação guiada.

As interações incluíram:
- Definição e validação da arquitetura em camadas antes de escrever a primeira linha
- Geração e revisão dos casos de uso, DTOs e contratos de repositório
- Implementação do fluxo de drag-and-drop com abertura de modal e persistência do comentário
- Composição dos componentes do dashboard com recharts
- Escrita e revisão da pirâmide de testes (unitários, integração e E2E)
- Refinamento visual da interface com base em referência de design

Exemplo de prompt utilizado:

```text
Preciso que a mudança de status no Kanban aconteça exclusivamente por drag and drop.
Ao soltar o card em outra coluna, abra um modal de confirmação contendo:
- título da tarefa
- transição de status (origem → destino)
- campo de comentário obrigatório (mínimo 3 caracteres)
- botões de cancelar e confirmar

O cancelamento deve reverter o card para a coluna original.
A confirmação deve chamar o endpoint PATCH /tasks/:id/status enviando status e comment.
A validação deve existir tanto no frontend (Zod) quanto no backend (ValidationPipe).
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
- adicionar autenticação e autorização para aplicar permissões reais no histórico
- autenticação e controle de acesso por usuário
- suporte a subtarefas e dependências entre cards
