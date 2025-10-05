import { repo } from "@/lib/repo";
import { Header } from "@/components/Header";
import { StatsPanel } from "@/components/StatsPanel";
import { BookList } from "@/components/BookList";
import { Separator } from "@/components/ui/separator";
// Vamos criar esses componentes nos próximos passos
// import { Filters } from "@/components/Filters";
// import { BookForm } from "@/components/BookForm";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { query?: string; genre?: string };
}) {
  const query = searchParams?.query ?? "";
  const genreId = searchParams?.genre ?? "";

  const [books, genres] = await Promise.all([
    repo.listBooks(query, genreId),
    repo.listGenres(),
  ]);

  return (
    <div className="min-h-screen bg-background/80 text-foreground backdrop-blur">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* <Filters genres={genres} /> */}

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <StatsPanel books={books} />
            <Separator />
            {/* <BookForm genres={genres} /> */}
          </div>

          <div className="lg:col-span-2">
            <BookList books={books} genres={genres} />
          </div>
        </section>
      </main>
    </div>
  );
}