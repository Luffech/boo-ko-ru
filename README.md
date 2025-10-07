---

# 📚 BookShelf

## 📖 Visão Geral

O **BookShelf** é uma aplicação web moderna para **gerenciamento de biblioteca pessoal**.
Permite aos usuários **catalogar, organizar e acompanhar o progresso de leitura** dos seus livros de forma simples, intuitiva e visualmente agradável.

Este projeto foi desenvolvido com **Next.js** e segue as boas práticas mais recentes da plataforma.

---

## 🚀 Tecnologias Utilizadas

* **Next.js 15** (App Router)
* **React 19**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui** (biblioteca de componentes)
* **Prisma ORM** (banco de dados SQLite)

---

## ⚙️ Inicialização do Projeto

Este é um projeto [Next.js](https://nextjs.org) criado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### ▶️ Iniciando o Servidor de Desenvolvimento

Execute o comando:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra o navegador em [http://localhost:3000](http://localhost:3000) para visualizar o resultado.
As alterações feitas em `app/page.tsx` serão refletidas automaticamente.

Este projeto utiliza [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) para otimizar e carregar a fonte [Geist](https://vercel.com/font), da Vercel.

---

## ✨ Funcionalidades Principais

### 1. Dashboard

* Estatísticas gerais da biblioteca:

  * Total de livros cadastrados
  * Livros sendo lidos atualmente
  * Livros finalizados
  * Total de páginas lidas
* Design responsivo e intuitivo
* Navegação rápida entre seções

### 2. Biblioteca

* Exibição de livros em **cards**
* Busca por **título ou autor**
* Filtro por **gênero**
* Cada card exibe:

  * 📕 Capa do livro
  * ✍️ Título e autor
  * 📅 Ano
  * ⭐ Avaliação
  * 🏷️ Gênero
  * 🔍 Visualizar | ✏️ Editar | ❌ Excluir

### 3. Adicionar / Editar / Excluir

* Formulários completos com **validação e feedback**
* **Preview da capa** em tempo real
* **Confirmação de exclusão** segura
* Feedback visual de sucesso e erro

### 4. Visualização Detalhada

* Página individual para cada livro
* Exibição de todas as informações, incluindo sinopse, status e progresso

---

## 🌙 Sistema de Temas (Dark Mode)

* **Light Mode** (padrão)
* **Dark Mode** (ideal para baixa luminosidade)
* **System Mode** (segue o tema do sistema)
* Alternância disponível em todas as páginas
* Transições suaves e persistência via `localStorage`
* Evita *flash* de conteúdo não estilizado (FOUC)

---

## 🌐 API Routes com CRUD Completo

### Endpoints de Livros

* `GET /api/books` – Listar livros
* `POST /api/books` – Criar novo livro
* `GET /api/books/[id]` – Detalhes de um livro
* `PUT /api/books/[id]` – Atualizar livro
* `DELETE /api/books/[id]` – Excluir livro

### Endpoints de Gêneros

* `GET /api/categories` – Listar gêneros
* `POST /api/categories/genres` – Criar novo gênero
* `DELETE /api/categories/genres/[genre]` – Excluir gênero

---

## 🧱 Banco de Dados (Prisma + SQLite)

### Migração e Modelagem

* Banco de dados SQLite utilizando **Prisma ORM**
* Campos expandidos:
  `status`, `currentPage`, `createdAt`, `updatedAt`, `isbn`, `notes`
* Relacionamento entre **Livros** e **Gêneros**
* Enum para status de leitura:

  * `QUERO_LER`
  * `LENDO`
  * `LIDO`
  * `PAUSADO`
  * `ABANDONADO`

### Operações via Prisma

* `getBooks()` – Listar
* `getBook(id)` – Buscar por ID
* `createBook(data)` – Criar
* `updateBook(id, data)` – Atualizar
* `deleteBook(id)` – Excluir

---

## 📊 Estrutura de Dados (Resumo)

```ts
{
  id: string;
  title: string;
  author: string;
  genre?: string;
  year?: number;
  pages?: number;
  rating?: number;
  synopsis?: string;
  cover?: string;
  status?: 'QUERO_LER' | 'LENDO' | 'LIDO' | 'PAUSADO' | 'ABANDONADO';
  currentPage?: number;
  isbn?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

---

## 🧩 Arquitetura e Componentização

* Uso de **Server Components** para páginas e listagens
* **Client Components** apenas para formulários e interações
* Filtros e busca via **query parameters**
* Server Actions integradas ao Prisma
* SSR e revalidação automática

---

## 🖥️ Requisitos Técnicos

### Responsividade

* Design **mobile-first**
* Layout adaptativo com **grid responsivo**

### Acessibilidade

* Navegação por teclado
* Labels e ARIA tags adequadas
* Contraste de cores verificado

### Performance

* Lazy loading de componentes
* Otimização de imagens e fontes

### UX / UI

* Feedback visual imediato
* Formulários com validação em tempo real
* Toasts, loaders e confirmações

---

## 🎨 Design e Interface

* **Design System:** shadcn/ui + Tailwind CSS
* **Navegação:** header/navbar, breadcrumbs e botões de voltar
* **Feedbacks visuais:** toasts, modais e barras de progresso

---

## 📚 Dados Iniciais

O projeto inicia com **5 livros pré-cadastrados**, incluindo:

* Diferentes gêneros e anos
* Avaliações variadas
* Sinopses completas
* Capas válidas e URLs corretas

---

## 💡 Dicas de Desenvolvimento

* Comece pelo essencial antes das features avançadas
* Teste em diferentes tamanhos de tela
* Aproveite o **type safety** do TypeScript
* Mantenha código limpo, comentado e organizado
* Trate erros de forma amigável

---

## 🧠 Recursos e Aprendizado

* [Documentação do Next.js 15](https://nextjs.org/)
* [shadcn/ui](https://ui.shadcn.com/)
* [Guia de boas práticas React](https://react.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Prisma ORM](https://www.prisma.io/docs)

---

## 🚀 Deploy

A maneira mais simples de fazer deploy é utilizando a **[Vercel Platform](https://vercel.com/new)**, dos criadores do Next.js.
Consulte a [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.

---

## 🏁 Conclusão

O objetivo do **BookShelf** é oferecer uma experiência completa e fluida no gerenciamento da sua biblioteca pessoal — unindo **design, performance e arquitetura moderna**.

> **Qualidade de código e experiência do usuário são prioridade absoluta.**

---
