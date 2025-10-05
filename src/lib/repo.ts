import type { Book, Genre, Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export type AppBook = Book & { genre: Genre | null };

export type CreateBookData = Prisma.BookUncheckedCreateInput;
export type UpdateBookData = Prisma.BookUpdateInput;

export const repo = {
  async listBooks(query = "", genreId = ""): Promise<AppBook[]> {
    const AND: any[] = [];

    const q = query.trim();
    if (q) {
      
      AND.push({
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { author: { contains: q, mode: 'insensitive' } },
        ],
      });
    }

    if (genreId && genreId !== 'all') {
      AND.push({ genreId });
    }

    return prisma.book.findMany({
      where: AND.length ? { AND } : undefined,
      include: { genre: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async listGenres(): Promise<Genre[]> {
    return prisma.genre.findMany({ orderBy: { name: "asc" } });
  },

  async getBook(id: string): Promise<AppBook | null> {
    if (!id) return null;
    return prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
  },
  
  async createBook(data: CreateBookData): Promise<Book> {
    return prisma.book.create({ data });
  },

  async updateBook(id: string, data: UpdateBookData): Promise<Book> {
    return prisma.book.update({
      where: { id },
      data,
    });
  },

  async deleteBook(id: string): Promise<Book> {
    return prisma.book.delete({
        where: { id },
    });
  },
};