"use client";

import type { AppBook } from "@/lib/repo";
import { BookCard } from "./BookCard";

export function BookList({ books }: { books: AppBook[] }) {
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
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}