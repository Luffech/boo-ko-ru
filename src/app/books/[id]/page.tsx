// src/app/books/[id]/page.tsx
import { repo } from "@/lib/repo";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Label } from "@/components/ui/label";

interface BookDetailsPageProps {
  params: Promise<{ id: string }>;
}

const statusStyles: Record<string, string> = {
  LENDO: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  LIDO: "bg-green-500/20 text-green-300 border-green-500/30",
  PAUSADO: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  ABANDONADO: "bg-red-500/20 text-red-300 border-red-500/30",
  QUERO_LER: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

export default async function BookDetailsPage({ params }: BookDetailsPageProps) {
  const { id } = await params; // ✅ agora está aguardando params

  const book = await repo.getBook(id);
  if (!book) notFound();

  const progress =
    book.pages && book.currentPage
      ? Math.round((book.currentPage / book.pages) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button asChild variant="outline">
            <Link href="/">← Voltar para a Biblioteca</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Image
              src={book.cover}
              alt={`Capa do livro ${book.title}`}
              width={400}
              height={600}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
              priority
            />
          </div>

          <div className="md:col-span-2">
            <h1 className="font-serif text-4xl font-bold text-douro">
              {book.title}
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              {book.author}
              {book.year ? `, ${book.year}` : ""}
            </p>

            <div className="flex items-center gap-4 mt-4">
              {book.genre && (
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-vinho text-white">
                  {book.genre.name}
                </span>
              )}
              {book.status && (
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full border ${statusStyles[book.status] ?? ""}`}
                >
                  {book.status.replace("_", " ")}
                </span>
              )}
            </div>

            {book.rating ? (
              <div className="flex items-center gap-1 mt-4 text-3xl text-douro">
                {"👻".repeat(book.rating)}
                <span className="ghost-faded">
                  {"👻".repeat(5 - book.rating)}
                </span>
              </div>
            ) : null}

            <Separator className="my-6" />

            <div className="space-y-4 text-sm">
              {book.synopsis && <p>{book.synopsis}</p>}
              {book.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Minhas Anotações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{book.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {book.status === "LENDO" && progress > 0 && (
              <div className="mt-6">
                <Label>Progresso da Leitura</Label>
                <div className="w-full bg-secondary/20 rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-right text-muted-foreground mt-1">
                  {progress}% ({book.currentPage} de {book.pages} páginas)
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
