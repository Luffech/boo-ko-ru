import type { Book, Genre } from "@prisma/client";
import { prisma } from "./prisma";

export type AppBook = Book & { genre: Genre | null };

export const repo = {
  async listBooks(query = "", genreId = ""): Promise<AppBook[]> {
    const AND: any[] = [];

    const q = query.trim();
    if (q) {
      
      AND.push({
        OR: [
          { title: { contains: q } },
          { author: { contains: q } },
        ],
      });
    }

    if (genreId) {
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
};