"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Genre, ReadingStatus } from "@prisma/client";
import { useState } from "react";
import Image from "next/image";
import { RatingInput } from "./RatingInput";
import { SubmitButton } from "./SubmitButton";
import { saveBook } from "@/app/actions";
import { toast } from "sonner";
import { AppBook } from "@/lib/repo";

interface BookFormProps {
  genres: Genre[];
  book?: AppBook;
}

const statusOptions = [
  { value: ReadingStatus.QUERO_LER, label: "Quero Ler" },
  { value: ReadingStatus.LENDO, label: "Lendo" },
  { value: ReadingStatus.LIDO, label: "Lido" },
  { value: ReadingStatus.PAUSADO, label: "Pausado" },
  { value: ReadingStatus.ABANDONADO, label: "Abandonado" },
];

const defaultCover = '/bookoru-capa.jpeg';

export function BookForm({ genres, book }: BookFormProps) {
  const [coverUrl, setCoverUrl] = useState(book?.cover || '');
  const isEditing = !!book?.id;

  const handleAction = async (formData: FormData) => {
    if (isEditing) {
        formData.append('id', book.id);
    }
    
    const result = await saveBook(formData);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl text-douro">
          {isEditing ? 'Editar Livro' : 'Adicionar Novo Livro'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleAction} className="space-y-4">
          <div className="relative w-full h-[200px] overflow-hidden rounded-md border bg-muted/40 flex items-center justify-center">
            <Image
              src={coverUrl || defaultCover}
              alt="Preview da Capa"
              fill
              sizes="100%"
              className="object-contain"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" name="title" required defaultValue={book?.title} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="author">Autor *</Label>
            <Input id="author" name="author" required defaultValue={book?.author} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cover">URL da Capa</Label>
            <Input 
                id="cover" 
                name="cover" 
                type="url" 
                defaultValue={book?.cover} 
                onChange={(e) => setCoverUrl(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="synopsis">Sinopse</Label>
            <Textarea 
                id="synopsis" 
                name="synopsis" 
                rows={4}
                defaultValue={book?.synopsis} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                name="status" 
                defaultValue={book?.status || ReadingStatus.QUERO_LER}
              >
                <SelectTrigger id="status" size="default">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="genreId">Gênero</Label>
              <Select 
                name="genreId" 
                defaultValue={book?.genreId || 'none'}
              >
                <SelectTrigger id="genreId" size="default">
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">(Nenhum)</SelectItem>
                  {genres.map(genre => (
                    <SelectItem key={genre.id} value={genre.id}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="year">Ano de Publicação</Label>
              <Input id="year" name="year" type="number" min={1000} max={new Date().getFullYear()} defaultValue={book?.year || ''} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" name="isbn" defaultValue={book?.isbn} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pages">Páginas Totais</Label>
              <Input id="pages" name="pages" type="number" min={1} defaultValue={book?.pages || ''} />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="currentPage">Pág. Atual</Label>
              <Input id="currentPage" name="currentPage" type="number" min={0} defaultValue={book?.currentPage || ''} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rating">Avaliação (👻)</Label>
              <RatingInput name="rating" value={book?.rating || 0} />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Notas Pessoais</Label>
            <Textarea 
                id="notes" 
                name="notes" 
                rows={4}
                defaultValue={book?.notes} 
            />
          </div>

          <SubmitButton label={isEditing ? 'Salvar Alterações' : 'Adicionar Livro'} />
        </form>
      </CardContent>
    </Card>
  );
}