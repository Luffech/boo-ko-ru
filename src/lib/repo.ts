// src/lib/repo.ts
import { Prisma, type Genre } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type AppBook = Prisma.BookGetPayload<{ include: { genre: true } }>;

type BookUpdatable = {
  title?: string;
  author?: string;
  cover?: string;
  year?: number | null;
  pages?: number | null;
  currentPage?: number | null;
  rating?: number | null;
  synopsis?: string | null;
  isbn?: string | null;
  notes?: string | null;
  status?: Prisma.ReadingStatus | null;
  genreId?: string | null;
};

export const repo = {
  async listGenres(): Promise<Genre[]> {
    return prisma.genre.findMany({ orderBy: { name: "asc" } });
  },

  // agora aceita filtros usados na home (query + genreId)
  async listBooks(filters?: { query?: string; genreId?: string }): Promise<AppBook[]> {
    const { query, genreId } = filters ?? {};
    const where: Prisma.BookWhereInput = {
      ...(query
        ? {
            OR: [
              { title: { contains: query } },
              { author: { contains: query } },
            ],
          }
        : {}),
      ...(genreId ? { genreId } : {}),
    };

    return prisma.book.findMany({
      where,
      include: { genre: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async getBook(id: string): Promise<AppBook | null> {
    return prisma.book.findUnique({ where: { id }, include: { genre: true } });
  },

  // CRIAR
  async createBook(data: Required<Pick<BookUpdatable, "title" | "author" | "cover">> & Omit<BookUpdatable, "title" | "author" | "cover">): Promise<AppBook> {
    const { genreId, ...rest } = data;
    return prisma.book.create({
      data: {
        ...rest,
        ...(genreId ? { genre: { connect: { id: genreId } } } : {}),
      },
      include: { genre: true },
    });
  },

  // ATUALIZAR (connect/disconnect de gênero calculado)
  async updateBook(id: string, data: BookUpdatable): Promise<AppBook> {
    const { genreId, ...rest } = data;

    let genreUpdate:
      | { connect: { id: string } }
      | { disconnect: true }
      | undefined;

    if (genreId === null) genreUpdate = { disconnect: true };
    if (typeof genreId === "string" && genreId) genreUpdate = { connect: { id: genreId } };

    return prisma.book.update({
      where: { id },
      data: {
        ...rest,
        ...(genreUpdate ? { genre: genreUpdate } : {}),
      },
      include: { genre: true },
    });
  },

  async deleteBook(id: string): Promise<void> {
    await prisma.book.delete({ where: { id } });
  },
};
