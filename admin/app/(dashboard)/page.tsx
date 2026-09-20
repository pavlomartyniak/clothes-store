"use client";

import { LuPackage, LuTags, LuShoppingBag, LuClock } from "react-icons/lu";
import { useProductsQuery } from "@/lib/queries/products";
import { useCategoriesQuery } from "@/lib/queries/categories";
import { useOrdersQuery } from "@/lib/queries/orders";
import { formatPrice } from "@/lib/utils";

export default function DashboardPage() {
  const { data: products = [] } = useProductsQuery();
  const { data: categories = [] } = useCategoriesQuery();
  const { data: orders = [] } = useOrdersQuery();

  const newOrders = orders.filter((o) => o.status === "new").length;
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const stats = [
    { label: "Товарів", value: products.length, icon: LuPackage },
    { label: "Категорій", value: categories.length, icon: LuTags },
    { label: "Замовлень", value: orders.length, icon: LuShoppingBag },
    { label: "Нових замовлень", value: newOrders, icon: LuClock },
  ];

  return (
    <div>
      <h1 className="font-semibold text-2xl text-ink">Огляд</h1>
      <p className="mt-1 text-sm text-ink-soft">Загальний стан магазину SILUET</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-line bg-paper p-5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-paper-soft text-accent">
              <stat.icon size={18} />
            </div>
            <p className="mt-4 text-2xl font-semibold text-ink">{stat.value}</p>
            <p className="text-sm text-ink-soft">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-paper p-5">
        <p className="text-sm text-ink-soft">Загальний дохід (без скасованих)</p>
        <p className="mt-1 text-2xl font-semibold text-ink">{formatPrice(revenue)}</p>
      </div>
    </div>
  );
}
