// src/app/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { repo } from "@/lib/repo";

function s(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}
function n(v: FormDataEntryValue | null): number | null {
  const str = s(v);
  if (str === "") return null;
  const num = Number(str);
  return Number.isFinite(num) ? num : null;
}

export async function saveBook(formData: FormData) {
  // Campos vindos do form
  const id = s(formData.get("id")) || undefined;
  const title = s(formData.get("title"));
  const author = s(formData.get("author")) || null;
  const cover = s(formData.get("cover")) || null;
  const synopsis = s(formData.get("synopsis")) || null;
  const status = s(formData.get("status")) || null; // QUERO_LER/LENDO/LIDO/PAUSADO/ABANDONADO
  const rawGenre = s(formData.get("genreId"));
  const genreId = !rawGenre || rawGenre === "none" ? null : rawGenre;

  const year = n(formData.get("year"));
  const pages = n(formData.get("pages"));
  const currentPage = n(formData.get("currentPage"));
  const rating = n(formData.get("rating")); // 👻
  const isbn = s(formData.get("isbn")) || null;
  const notes = s(formData.get("notes")) || null;

  if (!title) {
    return { success: false, message: "Título é obrigatório." };
  }

  const data = {
    title,
    author,
    cover,
    synopsis,
    status,
    genreId,
    year: year ?? undefined,
    pages: pages ?? undefined,
    currentPage: currentPage ?? undefined,
    rating: rating ?? undefined,
    isbn,
    notes,
  };

  const book = id
    ? await repo.updateBook(id, data)
    : await repo.createBook(data);

  revalidatePath("/");
  revalidatePath(`/books/${book.id}`);
  revalidatePath(`/books/${book.id}/edit`);

  return {
    success: true,
    id: book.id,
    message: id ? "Livro atualizado com sucesso." : "Livro criado com sucesso.",
  };
}

export async function deleteBook(id: string) {
  await repo.deleteBook(id);
  revalidatePath("/");
  return { success: true, message: "Livro excluído com sucesso." };
}
