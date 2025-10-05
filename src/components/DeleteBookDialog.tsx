"use client";

import { deleteBook } from "@/app/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export function DeleteBookDialog({ bookId, bookTitle, redirect, children }: { bookId: string; bookTitle: string; redirect?: boolean; children?: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteBook(bookId);
      
      if (result.success) {
        toast.success(result.message);
        if (redirect) {
          router.push('/');
        }
      } else {
        toast.error(result.message);
      }
    });
  };

  const trigger = redirect ? (
    <Button variant="destructive" size="default" disabled={isPending}>
      {isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash className="size-4" />}
      {isPending ? "Excluindo..." : "Excluir Livro"}
    </Button>
  ) : (
    children
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. O livro "{bookTitle}" será removido
            permanentemente da sua biblioteca Bookoru.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-destructive hover:bg-destructive/90"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="size-4 mr-2 animate-spin" /> : null}
            Sim, excluir livro
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}