// src/app/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { repo } from "@/lib/repo";
import { Prisma } from "@prisma/client";

function s(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}
function n(v: FormDataEntryValue | null): number | null {
  const str = s(v);
  if (str === "") return null;
  const num = Number(str);
  return Number.isFinite(num) ? num : null;
}

const DEFAULT_COVER = "/bookoru-capa.jpeg";
const ALLOWED_STATUS: Prisma.ReadingStatus[] = [
  "QUERO_LER",
  "LENDO",
  "LIDO",
  "PAUSADO",
  "ABANDONADO",
];

export async function saveBook(formData: FormData) {
  // campos
  const id = s(formData.get("id")) || undefined;
  const title = s(formData.get("title"));
  const author = s(formData.get("author"));
  const rawCover = s(formData.get("cover"));
  const synopsis = s(formData.get("synopsis")) || null;

  const rawStatus = s(formData.get("status"));
  const status = (ALLOWED_STATUS as string[]).includes(rawStatus) ? (rawStatus as Prisma.ReadingStatus) : null;

  const rawGenre = s(formData.get("genreId"));
  const genreId = !rawGenre || rawGenre === "none" ? null : rawGenre;

  const year = n(formData.get("year"));
  const pages = n(formData.get("pages"));
  const currentPage = n(formData.get("currentPage"));
  let rating = n(formData.get("rating")); // 1..5 ou null
  const isbn = s(formData.get("isbn")) || null;
  const notes = s(formData.get("notes")) || null;

  // validações mínimas (BD exige title/author/cover NOT NULL)
  if (!title) return { success: false, message: "Título é obrigatório." };
  if (!author) return { success: false, message: "Autor é obrigatório." };

  // cover nunca pode ser nulo: aplica default no servidor
  const cover = rawCover || DEFAULT_COVER;

  // números
  if (year != null && (year < 0 || year > new Date().getFullYear())) {
    return { success: false, message: "Ano inválido." };
  }
  if (pages != null && pages < 0) {
    return { success: false, message: "Total de páginas não pode ser negativo." };
  }
  if (currentPage != null && currentPage < 0) {
    return { success: false, message: "Página atual não pode ser negativa." };
  }
  if (pages != null && currentPage != null && currentPage > pages) {
    return { success: false, message: "Página atual não pode exceder o total de páginas." };
  }
  if (rating != null) {
    rating = Math.min(5, Math.max(1, rating));
  }

  const data = {
    title,
    author,
    cover,
    synopsis,
    status,
    genreId,
    year: year ?? null,
    pages: pages ?? null,
    currentPage: currentPage ?? null,
    rating: rating ?? null,
    isbn,
    notes,
  };

  try {
    const book = id ? await repo.updateBook(id, data) : await repo.createBook(data);

    revalidatePath("/");
    if (book?.id) {
      revalidatePath(`/books/${book.id}`);
      revalidatePath(`/books/${book.id}/edit`);
    }

    return {
      success: true,
      id: book.id,
      message: id ? "Livro atualizado com sucesso." : "Livro criado com sucesso.",
    };
  } catch (err: unknown) {
    // mensagens mais claras para erros comuns
    if (err && typeof err === "object" && "code" in (err as any)) {
      const code = (err as any).code as string;
      if (code === "P2002") {
        return { success: false, message: "Violação de unicidade. Já existe um registro com esses dados." };
      }
    }
    console.error(err);
    return { success: false, message: "Erro ao salvar livro." };
  }
}

export async function deleteBook(id: string) {
  try {
    await repo.deleteBook(id);
    revalidatePath("/");
    return { success: true, message: "Livro excluído com sucesso." };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Erro ao excluir livro." };
  }
}
