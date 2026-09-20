"use client";

import { LuHeart } from "react-icons/lu";

export function WishlistButton() {
  return (
    <button
      type="button"
      aria-label="Додати до обраного"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100"
    >
      <LuHeart size={16} />
    </button>
  );
}
