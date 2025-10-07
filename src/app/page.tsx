// src/app/page.tsx
import { Header } from "@/components/Header";
import { Filters } from "@/components/Filters";
import { StatsPanel } from "@/components/StatsPanel";
import { BookList } from "@/components/BookList";
import { repo } from "@/lib/repo";

type SearchParams = Promise<{
  query?: string | string[] | undefined;
  genre?: string | string[] | undefined;
}>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const rawQuery = params?.query;
  const rawGenre = params?.genre;

  const query =
    typeof rawQuery === "string"
      ? rawQuery
      : Array.isArray(rawQuery)
      ? rawQuery[0] ?? ""
      : "";

  const genre =
    typeof rawGenre === "string"
      ? rawGenre
      : Array.isArray(rawGenre)
      ? rawGenre[0] ?? "all"
      : "all";

  const genreId = genre === "all" ? "" : genre;

  const [books, genres] = await Promise.all([
    repo.listBooks({ query, genreId }),
    repo.listGenres(),
  ]);

  return (
    <main className="container mx-auto px-4 py-6">
      <Header />
      <Filters initialQuery={query} initialGenre={genre} genres={genres} />
      <StatsPanel books={books} />
      <BookList books={books} genres={genres} />
    </main>
  );
}
