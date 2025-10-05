"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "./StatCard";
import type { AppBook } from "@/lib/repo";

function pct(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

export function StatsPanel({ books }: { books: AppBook[] }) {
  const total = books.length;

  const byStatus = (s: string) =>
    books.filter((b) => (b.status || "").toUpperCase() === s).length;

  const lendo = byStatus("LENDO");
  const lido = byStatus("LIDO");

  const totalPaginas = books.reduce((acc, b) => acc + (b.pages || 0), 0);
  const totalLidas = books.reduce((acc, b) => {
    if (b.status === 'LIDO') return acc + (b.pages || 0);
    return acc + (b.currentPage || 0);
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl text-douro">
          Estatísticas
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Total de Livros" value={total} />
        <StatCard label="Lendo" value={lendo} />
        <StatCard label="Lidos" value={lido} />
        <StatCard
          label="Páginas Lidas"
          value={totalLidas}
          hint={`${pct(totalLidas, totalPaginas)}% do total`}
        />
      </CardContent>
    </Card>
  );
}