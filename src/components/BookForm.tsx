// src/components/BookForm.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { saveBook } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GhostRating from "@/components/GhostRating";
import type { Genre } from "@prisma/client";
import type { AppBook } from "@/lib/repo";

interface BookFormProps {
  genres: Genre[];
  book?: AppBook;
}

const STATUS = [
  { value: "QUERO_LER", label: "Quero Ler" },
  { value: "LENDO", label: "Lendo" },
  { value: "LIDO", label: "Lido" },
  { value: "PAUSADO", label: "Pausado" },
  { value: "ABANDONADO", label: "Abandonado" },
];

const defaultCover = "/bookoru-capa.jpeg";

export function BookForm({ genres, book }: BookFormProps) {
  const [form, setForm] = useState({
    cover: book?.cover || "",
    rating: book?.rating || 0,
  });

  // 🔄 Reseta quando trocar de livro (corrige “2º update”)
  useEffect(() => {
    setForm({
      cover: book?.cover || "",
      rating: book?.rating || 0,
    });
  }, [book?.id]);

  const handleAction = async (fd: FormData) => {
    try {
      if (book?.id) fd.append("id", book.id);

      const genreRaw = String(fd.get("genreId") ?? "");
      if (!genreRaw || genreRaw === "none") {
        fd.delete("genreId");
        fd.append("genreId", ""); // vira null no server action
      }

      const result = await saveBook(fd);
      if (result.success) {
        toast.success(result.message || "Livro salvo com sucesso!");
      } else {
        toast.error(result.message || "Erro ao salvar livro.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro inesperado ao salvar livro.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl text-douro">
          {book?.id ? "Editar Livro" : "Adicionar Novo Livro"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleAction} className="space-y-4">
          {/* Preview capa */}
          <div className="relative w-full h-[200px] overflow-hidden rounded-md border bg-muted/40 flex items-center justify-center">
            <Image
              src={form.cover || defaultCover}
              alt="Preview da Capa"
              fill
              sizes="100%"
              className="object-contain"
              unoptimized
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" name="title" required defaultValue={book?.title} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="author">Autor *</Label>
            <Input id="author" name="author" required defaultValue={book?.author ?? ""} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cover">URL da Capa</Label>
            <Input
              id="cover"
              name="cover"
              type="url"
              defaultValue={book?.cover ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, cover: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="synopsis">Sinopse</Label>
            <Textarea id="synopsis" name="synopsis" rows={4} defaultValue={book?.synopsis ?? ""} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={book?.status || "QUERO_LER"}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="genreId">Gênero</Label>
              <Select name="genreId" defaultValue={book?.genre?.id || "none"}>
                <SelectTrigger id="genreId">
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">(Nenhum)</SelectItem>
                  {genres.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pages">Páginas Totais</Label>
              <Input id="pages" name="pages" type="number" min={1} defaultValue={book?.pages ?? ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currentPage">Pág. Atual</Label>
              <Input id="currentPage" name="currentPage" type="number" min={0} defaultValue={book?.currentPage ?? ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year">Ano</Label>
              <Input id="year" name="year" type="number" min={1000} max={new Date().getFullYear()} defaultValue={book?.year ?? ""} />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
            <div className="grid gap-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" name="isbn" defaultValue={book?.isbn ?? ""} />
            </div>

            {/* 👻 Rating controlado + input hidden para o server action */}
            <div className="grid gap-2">
              <Label>Avaliação (👻)</Label>
              <input type="hidden" name="rating" value={form.rating} readOnly />
              <GhostRating
                value={form.rating}
                onChange={(v) => setForm((s) => ({ ...s, rating: v }))}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notas Pessoais</Label>
            <Textarea id="notes" name="notes" rows={4} defaultValue={book?.notes ?? ""} />
          </div>

          <SubmitButton label={book?.id ? "Salvar Alterações" : "Adicionar Livro"} />
        </form>
      </CardContent>
    </Card>
  );
}
