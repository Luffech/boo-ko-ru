import { repo } from "@/lib/repo";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BookForm } from "@/components/BookForm";

export default async function BookEditPage({
  params,
}: {
  params: { id: string };
}) {
  const [book, genres] = await Promise.all([
    repo.getBook(params.id),
    repo.listGenres(),
  ]);

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Link
          href={`/books/${params.id}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Voltar para Detalhes
        </Link>
        <div className="max-w-xl mx-auto">
          <BookForm genres={genres} book={book} />
        </div>
      </main>
    </div>
  );
}