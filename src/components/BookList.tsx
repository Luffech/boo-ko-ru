// src/components/BookList.tsx
"use client";

import type { AppBook } from "@/lib/repo";
import type { Genre } from "@prisma/client";
import { BookCard } from "./BookCard";

export function BookList({ books, genres }: { books: AppBook[]; genres: Genre[] }) {
  if (!books?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum livro encontrado. Tente ajustar os filtros ou adicionar um novo livro.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} genres={genres} />
      ))}
    </div>
  );
}