"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [status, setStatus] = useState<"idle" | "done">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("done");
  }

  return (
    <section className="border-t border-line bg-ink py-16 text-paper sm:py-20">
      <div className="container-page flex flex-col items-center gap-6 text-center">
        <h2 className="font-display text-3xl sm:text-4xl">Будьте в курсі нових надходжень</h2>
        <p className="max-w-md text-sm text-paper/75">
          Підпишіться на розсилку та першими дізнавайтесь про нові надходження та закриті розпродажі.
        </p>
        {status === "done" ? (
          <p className="text-sm font-medium text-accent">
            Дякуємо! Ви підписані на розсилку.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="Ваш email"
              className="h-12 flex-1 rounded-full border border-paper/30 bg-transparent px-5 text-sm text-paper placeholder:text-paper/50 focus:border-paper focus:outline-none"
            />
            <Button type="submit" className="bg-paper text-ink hover:bg-accent hover:text-paper">
              Підписатися
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
