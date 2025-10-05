import { repo } from "@/lib/repo";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, BookOpen, Clock, Hash, NotebookPen, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteBookDialog } from "@/components/DeleteBookDialog";
import { Button } from "@/components/ui/button";

export default async function BookDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const book = await repo.getBook(params.id);

    if (!book) {
        notFound();
    }

    const { id, title, author, cover, year, pages, currentPage, rating, synopsis, isbn, notes, status, genre } = book;

    const progress = pages && currentPage ? Math.round((currentPage / pages) * 100) : 0;
    const isCompleted = status === 'LIDO';

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="size-4" />
                    Voltar para a Biblioteca
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Coluna da Esquerda (Capa e Ações) */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="p-4 flex flex-col items-center gap-4">
                            <div className="relative w-[150px] h-[220px] overflow-hidden rounded-md shadow-lg">
                                <Image
                                    src={cover || '/bookoru-capa.jpeg'}
                                    alt={`Capa de ${title}`}
                                    fill
                                    sizes="150px"
                                    className="object-cover"
                                />
                            </div>
                            
                            <div className="flex flex-col items-center text-center">
                                <h1 className="font-serif text-2xl text-douro tracking-wide leading-tight">
                                    {title}
                                </h1>
                                <p className="text-sm text-muted-foreground italic">
                                    {author}
                                </p>
                            </div>

                            {/* Avaliação */}
                            {rating ? (
                                <div className="flex items-center gap-1 text-3xl text-douro">
                                    <span className="drop-shadow-glow">
                                        {"👻".repeat(rating)}
                                    </span>
                                    <span className="ghost-faded">
                                        {"👻".repeat(5 - rating)}
                                    </span>
                                </div>
                            ) : null}
                            
                            <Separator className="w-full" />

                            {/* Botões de Ação */}
                            <div className="flex w-full gap-2">
                                <Button asChild variant="secondary" className="w-full">
                                    <Link href={`/books/${id}/edit`}>
                                        <Pencil className="size-4" />
                                        Editar
                                    </Link>
                                </Button>
                                <DeleteBookDialog bookId={id} bookTitle={title} redirect={true} />
                            </div>
                        </Card>

                        {/* Dados Secundários */}
                        <Card>
                            <CardContent className="space-y-3 pt-6">
                                <div className="flex items-center gap-3">
                                    <Clock className="size-4 text-muted-foreground" />
                                    <p className="text-sm">
                                        **Ano:** {year || 'N/A'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <BookOpen className="size-4 text-muted-foreground" />
                                    <p className="text-sm">
                                        **Páginas Totais:** {pages || 'N/A'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Hash className="size-4 text-muted-foreground" />
                                    <p className="text-sm">
                                        **ISBN:** {isbn || 'N/A'}
                                    </p>
                                </div>
                                {genre?.name && (
                                    <div className="flex items-center gap-3">
                                        <NotebookPen className="size-4 text-muted-foreground" />
                                        <p className="text-sm">
                                            **Gênero:** <span className="bg-vinho text-white px-2 py-0.5 rounded-full text-xs">{genre.name}</span>
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Coluna da Direita (Detalhes e Notas) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status e Progresso */}
                        <Card>
                            <CardHeader className="border-b">
                                <CardTitle className="font-serif text-lg text-douro">Status e Progresso</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <p className="text-lg">
                                    **Status Atual:** <span className="font-semibold text-primary">{status}</span>
                                </p>

                                {(pages && pages > 0) && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Progresso: {progress}% ({currentPage}/{pages} páginas)
                                        </p>
                                        <div className="w-full bg-secondary/20 rounded-full h-3">
                                            <div className="bg-primary h-3 rounded-full" style={{ width: `${progress}%` }} />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Sinopse */}
                        <Card>
                            <CardHeader className="border-b">
                                <CardTitle className="font-serif text-lg text-douro">Sinopse</CardTitle>
                            </CardHeader>
                            <CardContent className="text-base text-muted-foreground pt-6">
                                {synopsis || 'Nenhuma sinopse fornecida.'}
                            </CardContent>
                        </Card>

                        {/* Notas Pessoais */}
                        {notes && (
                            <Card>
                                <CardHeader className="border-b">
                                    <CardTitle className="font-serif text-lg text-douro">Notas Pessoais</CardTitle>
                                </CardHeader>
                                <CardContent className="text-base pt-6 whitespace-pre-wrap">
                                    {notes}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}