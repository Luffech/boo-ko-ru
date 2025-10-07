// src/components/Filters.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { Genre } from "@prisma/client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FiltersProps = {
  initialQuery?: string;
  initialGenre?: string; // "all" | genreId
  genres: Genre[];
};

export function Filters({ initialQuery, initialGenre = "all", genres }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Estado inicial: props têm prioridade; se não vierem, ler da URL
  const [query, setQuery] = useState<string>(
    initialQuery ?? (searchParams.get("query") ?? "")
  );
  const [genreId, setGenreId] = useState<string>(
    initialGenre ?? (searchParams.get("genre") ?? "all")
  );

  // Debounce para buscar/atualizar a URL sem “chiar”
  const [queryDebounced] = useDebounce(query, 300);

  const createQueryString = useCallback(
    (next: Partial<{ query: string; genre: string }>) => {
      const params = new URLSearchParams(searchParams); // clona
      // query
      if (typeof next.query === "string") {
        if (next.query.trim() === "") params.delete("query");
        else params.set("query", next.query.trim());
      }
      // genre
      if (typeof next.genre === "string") {
        if (next.genre === "all") params.delete("genre");
        else params.set("genre", next.genre);
      }
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams]
  );

  // Atualiza a URL quando o termo debounced mudar
  useEffect(() => {
    router.push(
      createQueryString({ query: queryDebounced }),
      { scroll: false }
    );
  }, [queryDebounced, createQueryString, router]);

  // Sincroniza com mudanças externas na URL (ex.: navegação do usuário)
  useEffect(() => {
    const urlQuery = searchParams.get("query") ?? "";
    const urlGenre = searchParams.get("genre") ?? "all";
    setQuery((prev) => (prev !== urlQuery ? urlQuery : prev));
    setGenreId((prev) => (prev !== urlGenre ? urlGenre : prev));
  }, [searchParams]);

  // Se as props iniciais mudarem (SSR → CSR), sincroniza também
  useEffect(() => {
    if (typeof initialQuery === "string") setQuery(initialQuery);
  }, [initialQuery]);
  useEffect(() => {
    if (typeof initialGenre === "string") setGenreId(initialGenre);
  }, [initialGenre]);

  function onGenreChange(next: string) {
    setGenreId(next);
    router.push(createQueryString({ genre: next }), { scroll: false });
  }

  return (
    <Card>
      <CardContent className="flex flex-col md:flex-row gap-4 p-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título ou autor…"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            inputMode="search"
            aria-label="Buscar"
          />
        </div>

        <div className="w-full md:w-60">
          <Select value={genreId} onValueChange={onGenreChange}>
            <SelectTrigger aria-label="Filtrar por gênero">
              <SelectValue placeholder="Gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os gêneros</SelectItem>
              {genres.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
