"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useOrdersQuery } from "@/lib/queries/orders";
import { OrderStatus } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { OrderStatusFilter } from "@/components/orders/OrderStatusFilter";

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const status = (searchParams.get("status") as OrderStatus) || undefined;
  const { data: orders = [] } = useOrdersQuery(status);

  return (
    <div>
      <h1 className="font-semibold text-2xl text-ink">Замовлення</h1>
      <p className="mt-1 text-sm text-ink-soft">{orders.length} замовлень</p>

      <div className="mt-6">
        <OrderStatusFilter />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-soft text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Номер</th>
              <th className="px-4 py-3 font-medium">Клієнт</th>
              <th className="px-4 py-3 font-medium">Сума</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 font-medium">Дата</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-paper">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-paper-soft">
                <td className="px-4 py-3">
                  <Link
                    href={`/orders/${order._id}`}
                    className="font-medium text-ink hover:text-accent"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {order.firstName} {order.lastName}
                </td>
                <td className="px-4 py-3 font-medium text-ink">
                  {formatPrice(order.totalPrice + order.shippingCost)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink-soft">
                  Замовлень не знайдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="h-96 rounded-2xl bg-paper-soft" />}>
      <OrdersPageContent />
    </Suspense>
  );
}
