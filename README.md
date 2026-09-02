# 🚀 Lucas Almeida | Full Stack Developer Portfolio

Este projeto é um portfólio moderno e interativo, desenvolvido para apresentar projetos, experiências profissionais e formação acadêmica de forma elegante e performática, com suporte bilíngue (PT-BR/EN-US) e um assistente de IA que responde perguntas sobre a trajetória do Lucas.

O grande diferencial deste projeto é o seu **Painel de Controle Administrativo "Secreto"**, que permite gerenciar todo o conteúdo do site em tempo real, sem a necessidade de alterar o código-fonte manualmente para cada atualização.

> 📄 Veja o [changelog detalhado da última grande reformulação](CHANGELOG_REDESIGN.md) — internacionalização, assistente de IA, avatar em visual novel e a nova identidade visual.

---

## 🛠️ Painel de Controle (Admin Dashboard)

Diferente de portfólios estáticos, este projeto conta com uma área administrativa protegida por autenticação, onde o desenvolvedor pode gerenciar dinamicamente todas as informações exibidas no site.

![Painel de Controle - Visualização de projetos publicados](web/public/control-painel.png)

![Painel de Controle - Formulário de novo projeto com abas PT-BR/EN-US](web/public/add_new_control_panel.png)

### ⚙️ Funcionalidades do Painel:
O painel de controle interage diretamente com o banco de dados via **Prisma ORM**, permitindo as seguintes operações de **CRUD** (Create, Read, Update, Delete):

- **📁 Gerenciamento de Projetos**: Adicionar novos projetos, editar os existentes, atualizar links de Deploy/GitHub, gerenciar as tecnologias utilizadas e reordenar imagens via drag-and-drop.
- **💼 Experiências Profissionais**: Cadastrar novas experiências, descrever responsabilidades e tecnologias aplicadas em cada cargo.
- **🎓 Formação Acadêmica**: Manter o currículo acadêmico atualizado com cursos e instituições.
- **🔗 Links e Redes Sociais**: Alterar links de contato e redes sociais de forma centralizada.
- **🌐 Conteúdo Bilíngue**: Cada formulário possui abas PT-BR / EN-US para cadastrar título, descrição e demais campos nos dois idiomas simultaneamente.
- **↕️ Ordenação Dinâmica**: Organizador de prioridade (Drag & Drop ou campos de ordem) para definir quais itens aparecem primeiro no site.

---

## 💻 Tech Stack

O projeto utiliza o que há de mais moderno no ecossistema JavaScript/TypeScript, focado em performance, SEO e escalabilidade:

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router & Server Actions)
- **Internacionalização/UI**: React 19, Tailwind CSS 4.0 e i18n bilíngue (PT-BR/EN-US) com persistência de idioma via cookie
- **Linguagem**: TypeScript
- **Autenticação**: Next-Auth v5 (Auth.js)
- **Banco de Dados**: PostgreSQL com **pgvector** (embeddings/busca semântica)
- **ORM**: Prisma
- **IA**: Google Gemini (chat + geração de imagem) com pipeline de RAG próprio
- **Mídia**: Cloudinary (cache de imagens e áudio sintetizado)
- **Gerenciamento de Monorepo**: Turborepo
- **Ícones**: Lucide React & React Icons
- **Notificações**: React Toastify

---

## 🏗️ Estrutura e Arquitetura de Pacotes

O projeto é organizado em um **Monorepo** gerenciado pelo **Turborepo**, utilizando uma arquitetura de pacotes internos para separar as responsabilidades e facilitar a manutenção:

- **`web` (`@portfolio/web`)**: A aplicação principal em Next.js. Responsável por toda a interface do usuário (UI), rotas públicas, Server Actions e o Painel de Controle Administrativo.
- **`database` (`@portfolio/database`)**: Camada de persistência. Contém o schema do Prisma, as migrações do banco de dados e a configuração do cliente Prisma para interagir com o PostgreSQL.
- **`core` (`@portfolio/core`)**: Pacote de lógica de negócio e utilitários. Responsável por funções compartilhadas, validações centrais e regras que podem ser reutilizadas em diferentes partes do sistema.
- **`packages` (`@portfolio/packages`)**: Contém schemas de validação e tipos compartilhados entre o frontend e o backend, garantindo consistência de dados em todo o monorepo.

---

## 🤖 Assistente de IA (RAG)

O portfólio expõe um assistente de IA (`/api/chat`, Gemini 3.7 Flash) que responde
perguntas de visitantes sobre a trajetória do Lucas e a arquitetura dos seus
projetos, com busca semântica (RAG) via **pgvector** sobre três fontes:

- **`database` (`db:*`)**: fonte de verdade dos **fatos estruturados** — cargo,
  empresa, período, curso, instituição, stack de projeto. Editado pelo Painel
  de Controle e sincronizado automaticamente pelo pipeline de ingestão.
- **`ai-knowledge-base/*.md` (`md:*`)**: narrativa de carreira, preferências de
  arquitetura, forma de trabalhar e FAQ — **não** fatos tabulares (ver
  `ai-knowledge-base/README.md`). Editar aqui não afeta o banco, e vice-versa.
- **Código-fonte indexado (`code:*`)**: os repositórios em `REPOS_TO_INDEX`
  (somente públicos), com denylist de segredos e allowlist de extensões.

Workspace: **`assistant` (`@portfolio/assistant`)** — pipeline de ingestão,
CLI de inspeção de retrieval e uma fachada MCP (`search_context`) para uso
local no Claude Desktop / Cursor. Ver `assistant/README.md` para detalhes.

Na interface, o assistente é apresentado como um **avatar em estilo visual
novel** (sprite gerado com IA, barra de diálogo com efeito de digitação e
voz sintetizada com lip-sync), não como um chat tradicional.

### Comandos de operação

```bash
# Reindexar tudo (banco + notas + código) — idempotente, seguro rodar sempre
pnpm --filter @portfolio/assistant run ingest --source=all

# Inspecionar a qualidade do retrieval para uma pergunta
pnpm --filter @portfolio/assistant run search "onde o Lucas trabalha hoje"
```

### Segurança e custo

O endpoint é público (sem login) e endurecido por design: rate limit de
5 msg/min e 30 msg/dia por IP (hash com salt, nunca o IP em si), um
kill-switch (`ASSISTANT_ENABLED`), um teto diário global de mensagens
(`ASSISTANT_DAILY_BUDGET`), e nenhuma tool de escrita — o modelo só lê o que
foi indexado, nunca o sistema de arquivos. Métricas de operação (status,
rounds de tool call, duração) são logadas em `[assistant][metrics]` para
acompanhamento nos logs da Vercel.

---

## 🐳 Desenvolvimento Local com Docker (Branch `local`)

Para facilitar o setup do ambiente de desenvolvimento, o projeto possui uma branch específica chamada **`local`**. 

Nesta branch, é possível subir todo o ecossistema do projeto utilizando **Docker Compose**, incluindo:
- Banco de Dados PostgreSQL.
- **Firebase Emulator**: Permite testar funcionalidades que dependem do Firebase (como Storage ou Auth) localmente, sem custo e sem necessidade de conexão externa.

Isso garante que qualquer desenvolvedor consiga rodar o projeto completo com apenas um comando, sem precisar configurar cada serviço manualmente.

---

## 🚀 Como Executar

### Pré-requisitos:
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (recomendado) ou npm/yarn
- Instância do PostgreSQL

### Instalação:

1. Instale as dependências:
   ```bash
   pnpm install
   ```

2. Configure as variáveis de ambiente:
   Crie arquivos `.env` nas pastas `web` e `database` conforme os exemplos `.env.example` (Configurações de Database URL, NextAuth Secret, etc).

3. Gere o cliente do Prisma e rode as migrações:
   ```bash
   pnpm db:generate
   ```

4. Inicie o ambiente de desenvolvimento:
   ```bash
   pnpm dev
   ```

O portfólio estará disponível em `http://localhost:3000`.

---
Feito por [Lucas Almeida](https://github.com/me-lucas-al)
