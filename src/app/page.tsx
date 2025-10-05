// src/app/page.tsx
import { repo } from "@/lib/repo";
import { Header } from "@/components/Header";
import { BookForm } from "@/components/BookForm";
import { Filters } from "@/components/Filters";
import { StatsPanel } from "@/components/StatsPanel";
import { BookList } from "@/components/BookList";
import { Separator } from "@/components/ui/separator";

export default async function HomePage({
  searchParams,
}: {
  // Tipagem correta para Server Component
  searchParams?: { query?: string; genre?: string };
}) {
  // Desestruturação imediata e segura para evitar o warning do Next.js
  const { query: rawQuery, genre: rawGenre } = searchParams || {};
  const query = rawQuery ?? "";
  const genreId = rawGenre ?? "";

  const [books, genres] = await Promise.all([
    // Assumindo que seu repo.ts foi corrigido para usar o modo 'insensitive'
    repo.listBooks(query, genreId),
    repo.listGenres(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Filters genres={genres} />

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <StatsPanel books={books} />
            <Separator />
            <BookForm genres={genres} />
          </div>

          <div className="lg:col-span-2">
            <BookList books={books} genres={genres} />
          </div>
        </section>
      </main>
    </div>
  );
}