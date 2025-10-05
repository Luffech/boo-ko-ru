"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AppBook } from "@/lib/repo";
import type { Genre } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, BookOpen, Pencil, Trash } from "lucide-react";
import { DeleteBookDialog } from "./DeleteBookDialog";

export function BookCard({ book, genres }: { book: AppBook; genres: Genre[] }) {
  const router = useRouter();

  const progress =
    book.pages && book.currentPage
      ? Math.round((book.currentPage / book.pages) * 100)
      : 0;

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-[110px_1fr] gap-4 p-4">
        <div className="relative w-[110px] h-[160px] overflow-hidden rounded-md">
          <Image
            src={book.cover || '/bookoru-capa.jpeg'}
            alt={`Capa de ${book.title}`}
            fill
            sizes="110px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-2">
          <CardHeader className="p-0">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="font-serif text-lg leading-tight text-foreground">
                <Link href={`/books/${book.id}`} className="hover:underline">
                  {book.title}
                </Link>
              </CardTitle>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" aria-label="Ações">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  
                  <DropdownMenuItem asChild>
                    <Link href={`/books/${book.id}`}>
                      <BookOpen className="size-4" />
                      Visualizar
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href={`/books/${book.id}/edit`}>
                        <Pencil className="size-4" />
                        Editar
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()} asChild>
                    <DeleteBookDialog bookId={book.id} bookTitle={book.title} >
                      <button type="button" className="flex items-center gap-2">
                        <Trash className="size-4" />
                        Excluir
                      </button>
                    </DeleteBookDialog>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <p className="text-sm text-muted-foreground">
              {book.author || "Autor desconhecido"}
              {book.year ? `, ${book.year}` : ""}
            </p>

            {book.genre?.name && (
              <p className="text-xs mt-1 bg-vinho text-white inline-block px-2 py-0.5 rounded-full">
                {book.genre.name}
              </p>
            )}

            {book.rating ? (
              <div className="mt-2 flex items-center gap-1 text-2xl text-douro">
                <span className="drop-shadow-glow">
                    {"👻".repeat(book.rating)}
                </span>
                <span className="ghost-faded">
                  {"👻".repeat(5 - (book.rating || 0))}
                </span>
              </div>
            ) : null}

            {progress > 0 && book.status === 'LENDO' && (
              <div className="mt-2">
                <div className="w-full bg-secondary/20 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {progress}% ({book.currentPage}/{book.pages})
                </p>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
}