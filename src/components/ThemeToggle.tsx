"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
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
        px-5 py-2.5 text-base font-medium
        shadow-md hover:shadow-lg
        bg-muted hover:bg-accent
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
          bg-accent text-accent-foreground
        "
      >
        {emoji}
      </span>
    </Button>
  );
}