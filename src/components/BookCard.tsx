// src/components/BookCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { AppBook } from "@/lib/repo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { DeleteBookDialog } from "@/components/DeleteBookDialog";

type Props = {
  book: AppBook;
};

export function BookCard({ book }: Props) {
  const coverSrc = book.cover || "/bookoru-capa.jpeg";

  const totalPages = typeof book.pages === "number" ? Math.max(0, book.pages) : 0;
  const current =
    typeof book.currentPage === "number"
      ? Math.min(Math.max(0, book.currentPage), totalPages)
      : 0;
  const progress = totalPages > 0 ? Math.round((current / totalPages) * 100) : 0;

  return (
    <Card className="group relative overflow-hidden">
      <CardContent className="p-4">
        <div className="grid grid-cols-[96px_1fr_auto] gap-4 items-start">
          <div className="relative h-28 w-20 overflow-hidden rounded-md border">
            <Image
              src={coverSrc}
              alt={`Capa de ${book.title}`}
              fill
              sizes="80px"
              className="object-cover"
              priority={false}
            />
          </div>

          <div className="min-w-0">
            <Link href={`/books/${book.id}`} className="block">
              <h3 className="text-lg font-semibold line-clamp-2">{book.title}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              {book.author}
              {book.year ? `, ${book.year}` : ""}
            </p>

            <div
              className="mt-2 flex items-center gap-1 text-2xl text-douro"
              aria-label={`Avaliação ${book.rating ?? 0} de 5`}
            >
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = (book.rating ?? 0) >= i + 1;
                return (
                  <span key={i} className={filled ? "drop-shadow-glow" : "ghost-faded"}>
                    👻
                  </span>
                );
              })}
            </div>

            {totalPages > 0 && (
              <div className="mt-2">
                <div className="w-full bg-secondary/20 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {progress}% ({current}/{totalPages})
                </p>
              </div>
            )}
          </div>

          <div className="flex items-start gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Ações">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-40">
                <DropdownMenuItem asChild>
                  <Link href={`/books/${book.id}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Detalhes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/books/${book.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Link>
                </DropdownMenuItem>
                <DeleteBookDialog id={book.id}>
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DeleteBookDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BookCard;
