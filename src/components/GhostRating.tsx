// src/components/GhostRating.tsx
"use client";
import { useState } from "react";

type Props = {
  value?: number;
  onChange?: (v: number) => void;
  max?: number;
  size?: number;
};

export default function GhostRating({
  value = 0,
  onChange,
  max = 5,
  size = 28,
}: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? value;

  return (
    <div
      className="flex items-center gap-1 select-none"
      role="radiogroup"
      aria-label="Avaliação"
    >
      {Array.from({ length: max }).map((_, i) => {
        const idx = i + 1;
        const isOn = idx <= active;
        return (
          <button
            key={idx}
            type="button"
            role="radio"
            aria-checked={idx === value}
            onMouseEnter={() => setHover(idx)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange?.(idx)}
            className={`transition ${
              isOn ? "opacity-100 scale-105 drop-shadow" : "opacity-25"
            } hover:opacity-100`}
            style={{ fontSize: size }}
            aria-label={`${idx} ${idx === 1 ? "fantasma" : "fantasmas"}`}
            title={`${idx} ${idx === 1 ? "fantasma" : "fantasmas"}`}
          >
            👻
          </button>
        );
      })}
    </div>
  );
}
