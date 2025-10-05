import { z } from 'zod';
import { repo } from '@/lib/repo';
import { ReadingStatus } from '@prisma/client';

const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'O Título é obrigatório.'),
  author: z.string().min(1, 'O Autor é obrigatório.'),
  cover: z.string().url('Deve ser uma URL válida.').optional().or(z.literal('')),
  year: z.coerce.number().int().min(1000).max(new Date().getFullYear()).optional().or(z.literal(0)),
  pages: z.coerce.number().int().min(1).optional().or(z.literal(0)),
  currentPage: z.coerce.number().int().min(0).optional().or(z.literal(0)),
  rating: z.coerce.number().int().min(1).max(5).optional().or(z.literal(0)),
  synopsis: z.string().optional(),
  isbn: z.string().optional(),
  notes: z.string().optional(),
  status: z.nativeEnum(ReadingStatus).default(ReadingStatus.QUERO_LER),
  genreId: z.string().optional().or(z.literal('')),
});

const { revalidatePath } = require('next/cache');


export async function saveBook(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const parsedData = {
    ...data,
    year: data.year ? parseInt(data.year as string, 10) : 0,
    pages: data.pages ? parseInt(data.pages as string, 10) : 0,
    currentPage: data.currentPage ? parseInt(data.currentPage as string, 10) : 0,
    rating: data.rating ? parseInt(data.rating as string, 10) : 0,
    genreId: data.genreId === 'none' || data.genreId === '' ? undefined : data.genreId,
    cover: data.cover || '/bookoru-capa.jpeg',
  };

  const validation = bookSchema.safeParse(parsedData);

  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    console.error('Validation Error:', errors);
    throw new Error('Erro de validação nos dados do livro.');
  }

  const { id, year, pages, currentPage, rating, ...validatedData } = validation.data;
  
  const finalData = {
    ...validatedData,
    year: year || undefined,
    pages: pages || undefined,
    currentPage: currentPage || undefined,
    rating: rating || undefined,
  };

  try {
    const book = id
      ? await repo.updateBook(id, finalData)
      : await repo.createBook(finalData);

    revalidatePath('/');
    revalidatePath(`/books/${book.id}`); 
    return { success: true, message: `Livro "${book.title}" salvo com sucesso!` };
  } catch (e) {
    console.error(e);
    return { success: false, message: 'Erro ao salvar o livro no banco de dados.' };
  }
}

export async function deleteBook(id: string) {
  try {
    const book = await repo.deleteBook(id);
    revalidatePath('/');
    return { success: true, message: `Livro "${book.title}" excluído com sucesso.` };
  } catch (e) {
    console.error(e);
    return { success: false, message: 'Erro ao excluir o livro.' };
  }
}