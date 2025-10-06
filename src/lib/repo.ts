// src/lib/repo.ts
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type BookUpdatable = {
  title?: string;
  author?: string;
  cover?: string;
  year?: number;
  pages?: number;
  currentPage?: number;
  rating?: number | null; // 👻
  synopsis?: string;
  isbn?: string;
  notes?: string;
  genreId?: string | null;
  status?: "PLANNING" | "READING" | "FINISHED" | "ABANDONED";
};

export const repo = {
  // LISTAGEM
  async listBooks() {
    return prisma.book.findMany({
      orderBy: { createdAt: "desc" },
      include: { genre: true },
    });
  },

  // DETALHE
  async getBook(id: string) {
    return prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
  },

  // GÊNEROS
  async listGenres() {
    return prisma.genre.findMany({
      orderBy: { name: "asc" },
    });
  },

  // CRIAR
  async createBook(data: BookUpdatable) {
    const { genreId, ...rest } = data;
    return prisma.book.create({
      data: {
        ...rest,
        ...(genreId ? { genre: { connect: { id: genreId } } } : {}),
      },
      include: { genre: true },
    });
  },

  // ATUALIZAR (seguro, só campos previstos)
  async updateBook(id: string, data: BookUpdatable) {
    const { genreId, ...rest } = data;

    // Prepara a parte de relação do gênero (connect / disconnect / nada)
    let genreUpdate:
      | { connect: { id: string } }
      | { disconnect: true }
      | undefined = undefined;

    if (typeof genreId === "string" && genreId.length > 0) {
      genreUpdate = { connect: { id: genreId } };
    } else if (genreId === null) {
      genreUpdate = { disconnect: true };
    }

    return prisma.book.update({
      where: { id },
      data: {
        ...rest,
        ...(genreUpdate ? { genre: genreUpdate } : {}),
      },
      include: { genre: true },
    });
  },

  // EXCLUIR
  async deleteBook(id: string) {
    await prisma.book.delete({ where: { id } });
  },
};
