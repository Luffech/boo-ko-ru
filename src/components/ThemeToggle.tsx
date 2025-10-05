// luffech/bookoru-lite/bookoru-lite-2b235f414b9277d70c0c6607066f10fa74d4/src/components/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  
  // Exibe um botão desabilitado para evitar erro de hidratação (SSR vs CSR)
  if (!mounted) {
    return (
      <Button
        aria-label="Alternar tema"
        className="rounded-full px-5 py-2.5 text-base shadow-md"
        variant="outline"
        disabled
      >
        …
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Escurinho" : "Clarinho";
  const emoji = isDark ? "🌙" : "☀️";

  return (
    <Button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-pressed={isDark}
      aria-label="Alternar tema claro/escuro"
      className="
        inline-flex items-center gap-2 rounded-full
        px-4 py-2 text-base font-medium
        shadow-sm hover:shadow-md
        bg-background hover:bg-muted/50
        border border-border
        transition-all
      "
      variant="outline"
    >
      {label}
      <span
        className="
          inline-flex items-center justify-center
          rounded-md px-1.5 py-0.5 text-sm
          bg-douro/20 text-douro dark:text-douro
          drop-shadow-glow
        "
      >
        {emoji}
      </span>
    </Button>
  );
}