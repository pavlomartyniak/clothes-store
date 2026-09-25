import { Suspense } from "react";
import { LuCheck } from "react-icons/lu";
import { LinkButton } from "@/components/ui/Button";
import { SuccessOrderNumber } from "./SuccessOrderNumber";

export const metadata = {
  title: "Замовлення прийнято — Maison",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="container-page flex flex-col items-center py-20 text-center sm:py-28">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-paper">
        <LuCheck size={28} />
      </div>
      <h1 className="mt-6 font-display text-3xl text-ink sm:text-4xl">Дякуємо за замовлення!</h1>
      <Suspense fallback={null}>
        <SuccessOrderNumber />
      </Suspense>
      <p className="mt-4 max-w-md text-sm text-ink-soft">
        Ми надішлемо підтвердження на вашу пошту та зв&apos;яжемося з вами для узгодження
        доставки. Дякуємо, що обираєте Maison.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <LinkButton href="/catalog" size="lg" variant="secondary">
          Продовжити покупки
        </LinkButton>
        <LinkButton href="/" size="lg">
          На головну
        </LinkButton>
      </div>
    </div>
  );
}
