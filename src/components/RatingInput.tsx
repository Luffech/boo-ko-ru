"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export function RatingInput({ value: initialValue = 0, name = "rating" }: { value?: number; name?: string }) {
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(initialValue);

  const handleClick = (index: number) => {
    if (rating === index) {
      setRating(0);
    } else {
      setRating(index);
    }
  };

  return (
    <div className="flex items-center gap-1 text-2xl text-douro">
      <input type="hidden" name={name} value={rating} />
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        const isActive = ratingValue <= (hover || rating);
        
        return (
          <button
            key={index}
            type="button"
            className={cn(
              "cursor-pointer transition-all",
              isActive && "drop-shadow-glow",
              !isActive && "ghost-faded"
            )}
            onClick={() => handleClick(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Avaliar ${ratingValue} fantasmas`}
          >
            👻
          </button>
        );
      })}
    </div>
  );
}