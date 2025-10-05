// luffech/bookoru-lite/bookoru-lite-2b235f414b9277d70c0c6607066f10fa74d4/src/components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Separator } from "@/components/ui/separator";

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
          {/* Aplicando font-serif e a cor douro para o nome do projeto */}
          <span className="font-serif text-xl tracking-wide text-douro">Bookoru</span>
        </Link>

        <nav aria-label="Controles de interface" className="flex items-center gap-2">
          <ThemeToggle />
        </nav>
      </div>
      <Separator />
    </header>
  );
}