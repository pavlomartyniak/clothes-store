"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LuShoppingBag } from "react-icons/lu";
import { useCart } from "@/lib/cart-context";
import { useProducts } from "@/lib/products-context";
import { formatPrice, cn } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/shipping";
import { extractErrorMessage, useCreateOrderMutation } from "@/lib/queries/checkout";
import { ProductPhoto } from "@/components/product/ProductPhoto";
import { Button, LinkButton } from "@/components/ui/Button";

type Delivery = "np-branch" | "courier";
type Payment = "cod" | "card";

export default function CheckoutPage() {
  const { lines, totalPrice, clearCart } = useCart();
  const products = useProducts();
  const router = useRouter();
  const [delivery, setDelivery] = useState<Delivery>("np-branch");
  const [payment, setPayment] = useState<Payment>("cod");
  const createOrder = useCreateOrderMutation();

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const orderItems = lines
      .map((line) => {
        const product = products.find((p) => p.slug === line.slug);
        if (!product) return null;
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          size: line.size,
          color: line.color,
          quantity: line.quantity,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (orderItems.length === 0) return;

    const formData = new FormData(e.currentTarget);

    try {
      const order = await createOrder.mutateAsync({
        firstName: String(formData.get("firstName") ?? ""),
        lastName: String(formData.get("lastName") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
        deliveryMethod: delivery,
        city: String(formData.get("city") ?? ""),
        address: String(formData.get("address") ?? ""),
        paymentMethod: payment,
        items: orderItems,
        totalPrice,
        shippingCost: shipping,
        comment: String(formData.get("comment") ?? "") || undefined,
      });

      clearCart();
      router.push(`/checkout/success?order=${order.orderNumber}`);
    } catch {
      // error is surfaced below via createOrder.error
    }
  }

  if (lines.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center gap-4 py-24 text-center">
        <LuShoppingBag size={40} className="text-ink-soft" />
        <h1 className="font-display text-2xl text-ink">Немає що оформляти</h1>
        <p className="text-ink-soft">Спочатку додайте товари до кошика.</p>
        <LinkButton href="/catalog" size="lg">До каталогу</LinkButton>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="mb-8 font-display text-3xl text-ink">Оформлення замовлення</h1>
      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="mb-1 text-lg font-medium text-ink">Контактні дані</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ім'я" name="firstName" autoComplete="given-name" required />
              <Field label="Прізвище" name="lastName" autoComplete="family-name" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Телефон" name="phone" type="tel" autoComplete="tel" required />
              <Field label="Email" name="email" type="email" autoComplete="email" required />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-1 text-lg font-medium text-ink">Доставка</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <RadioCard
                label="Нова пошта, відділення"
                description="1–2 дні, від 60 грн"
                checked={delivery === "np-branch"}
                onClick={() => setDelivery("np-branch")}
              />
              <RadioCard
                label="Кур'єром за адресою"
                description="1–3 дні, від 120 грн"
                checked={delivery === "courier"}
                onClick={() => setDelivery("courier")}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Місто" name="city" autoComplete="address-level2" required />
              <Field
                label={delivery === "np-branch" ? "Номер відділення" : "Адреса, квартира"}
                name="address"
                autoComplete="street-address"
                required
              />
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="mb-1 text-lg font-medium text-ink">Оплата</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <RadioCard
                label="Оплата при отриманні"
                description="Готівкою або карткою кур'єру"
                checked={payment === "cod"}
                onClick={() => setPayment("cod")}
              />
              <RadioCard
                label="Оплата карткою онлайн"
                description="Visa / Mastercard"
                checked={payment === "card"}
                onClick={() => setPayment("card")}
              />
            </div>
          </fieldset>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink" htmlFor="comment">
              Коментар до замовлення (необов&apos;язково)
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={3}
              className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-2xl border border-line bg-paper-soft p-6">
          <h2 className="text-lg font-medium text-ink">Ваше замовлення</h2>
          <ul className="max-h-72 space-y-4 overflow-y-auto pr-1">
            {lines.map((line) => {
              const product = products.find((p) => p.slug === line.slug);
              if (!product) return null;
              return (
                <li key={`${line.slug}-${line.size}-${line.color}`} className="flex gap-3">
                  <ProductPhoto product={product} className="h-16 w-14 shrink-0 rounded-lg" />
                  <div className="flex flex-1 flex-col text-sm">
                    <span className="font-medium text-ink">{product.name}</span>
                    <span className="text-ink-soft">
                      {line.size} · {line.color} · {line.quantity} шт
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-ink">
                    {formatPrice(product.price * line.quantity)}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Товари</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Доставка</span>
              <span>{shipping === 0 ? "Безкоштовно" : formatPrice(shipping)}</span>
            </div>
          </div>
          <div className="flex justify-between border-t border-line pt-4 text-base font-semibold text-ink">
            <span>Разом</span>
            <span>{formatPrice(totalPrice + shipping)}</span>
          </div>
          {createOrder.isError && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-accent-dark">
              {extractErrorMessage(createOrder.error)}
            </p>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={createOrder.isPending}>
            {createOrder.isPending ? "Оформлюємо..." : "Підтвердити замовлення"}
          </Button>
          <p className="text-center text-xs text-ink-soft">
            Натискаючи кнопку, ви погоджуєтесь з умовами обробки замовлення
          </p>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="h-11 w-full rounded-full border border-line bg-paper px-4 text-sm text-ink focus:border-ink focus:outline-none"
      />
    </div>
  );
}

function RadioCard({
  label,
  description,
  checked,
  onClick,
}: {
  label: string;
  description: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-4 text-left transition-colors",
        checked ? "border-ink bg-paper" : "border-line hover:border-ink/50"
      )}
    >
      <span className="flex items-center gap-2 text-sm font-medium text-ink">
        <span
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full border",
            checked ? "border-ink" : "border-line"
          )}
        >
          {checked && <span className="h-2 w-2 rounded-full bg-ink" />}
        </span>
        {label}
      </span>
      <span className="mt-1 block pl-6 text-xs text-ink-soft">{description}</span>
    </button>
  );
}
