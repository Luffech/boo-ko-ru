// src/app/page.tsx
import { repo } from "@/lib/repo";
import { Header } from "@/components/Header";
import { Filters } from "@/components/Filters";
import { StatsPanel } from "@/components/StatsPanel";
import { BookList } from "@/components/BookList";

type SearchParamsLike =
  | Record<string, string | string[] | undefined>
  | URLSearchParams;

async function resolveSearchParams(spLike: any): Promise<SearchParamsLike> {
  try {
    if (spLike && typeof spLike.then === "function") {
      return await spLike;
    }
    return spLike ?? {};
  } catch {
    return {};
  }
}

function readParam(sp: SearchParamsLike, key: string): string {
  if (sp instanceof URLSearchParams) return sp.get(key) ?? "";
  const v = (sp as Record<string, string | string[] | undefined>)[key];
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v[0] ?? "";
  return "";
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: any;
}) {
  const sp = await resolveSearchParams(searchParams);
  const queryRaw = readParam(sp, "query");
  const genreRaw = readParam(sp, "genre");

  const query = queryRaw || "";
  const genreId = genreRaw === "all" ? "" : genreRaw; // :contentReference[oaicite:5]{index=5}

  const [books, genres] = await Promise.all([
    repo.listBooks({ query, genreId }),
    repo.listGenres(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Filters genres={genres} />
        <StatsPanel books={books} />
        <BookList books={books} genres={genres} />
      </main>
    </div>
  );
}
