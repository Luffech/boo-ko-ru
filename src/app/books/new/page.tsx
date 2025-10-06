// src/app/books/new/page.tsx
import { repo } from "@/lib/repo";
import { Header } from "@/components/Header";
import { BookForm } from "@/components/BookForm";
import Link from "next/link";

export default async function NewBookPage() {
  const genres = await repo.listGenres();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground">← Voltar</Link>
        <div className="max-w-xl mx-auto">
          <BookForm genres={genres} />
        </div>
      </main>
    </div>
  );
}
