// src/components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Ir para a página inicial">
          <Image
            src="/logo_bookoru.png"
            alt="Logo Bookoru"
            width={75}
            height={75}
            className="rounded-md"
            priority
          />
          <span className="font-serif text-xl tracking-wide text-douro">Bookoru</span>
        </Link>

        <nav aria-label="Controles de interface" className="flex items-center gap-2">
          <Link href="/books/new">
            <Button>
              <Plus className="size-4" />
              Adicionar Livro
            </Button>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
      <Separator />
    </header>
  );
}
