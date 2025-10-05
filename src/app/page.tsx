import { repo } from "@/lib/repo";
import { Header } from "@/components/Header";
import { StatsPanel } from "@/components/StatsPanel";
import { BookList } from "@/components/BookList";
import { Separator } from "@/components/ui/separator";
import { Filters } from "@/components/Filters";
import { BookForm } from "@/components/BookForm";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { query?: string; genre?: string };
}) {
  const { query: rawQuery, genre: rawGenre } = searchParams || {};
  const query = rawQuery ?? "";
  const genreId = rawGenre ?? "";

  const [books, genres] = await Promise.all([
    repo.listBooks(query, genreId),
    repo.listGenres(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main 
        className="
          relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8
          before:content-[''] before:absolute before:inset-0 before:z-0
          before:bg-[url('/logo_bookoru.png')] before:bg-no-repeat before:bg-center before:bg-[50%_auto]
          before:opacity-10 dark:before:opacity-5 before:pointer-events-none before:h-full before:w-full
        "
      >
        <div className="relative z-10 space-y-8">
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
        </div>
      </main>
    </div>
  );
}