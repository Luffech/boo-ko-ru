"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Genre } from "@prisma/client";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface FiltersProps {
  genres: Genre[];
}

export function Filters({ genres }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('query') ?? '';
  const initialGenre = searchParams.get('genre') ?? 'all';
  
  const [query, setQuery] = useState(initialQuery);
  const [genreId, setGenreId] = useState(initialGenre);
  const [debouncedQuery] = useDebounce(query, 500);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'all' || value === '') {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    if (debouncedQuery !== initialQuery) {
      router.push(pathname + '?' + createQueryString('query', debouncedQuery), {
        scroll: false,
      });
    }
  }, [debouncedQuery]);

  const handleGenreChange = (newGenreId: string) => {
    setGenreId(newGenreId);
    router.push(pathname + '?' + createQueryString('genre', newGenreId), {
        scroll: false,
    });
  };

  return (
    <Card>
      <CardContent className="flex flex-col md:flex-row gap-4 p-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título ou autor..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <Select 
            value={genreId}
            onValueChange={handleGenreChange}
        >
          <SelectTrigger className="w-full md:w-[200px]" size="default">
            <SelectValue placeholder="Filtrar por Gênero" />
          </SelectTrigger>
          <SelectContent>
            {/* Valor alterado para "all" para evitar o erro de string vazia */}
            <SelectItem value="all">Todos os Gêneros</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre.id} value={genre.id}>
                {genre.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}