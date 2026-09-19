import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { api } from "@/lib/api";
import { Order } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/orders/OrderStatusSelect";
import { DeleteOrderButton } from "@/components/orders/DeleteOrderButton";

const DELIVERY_LABELS: Record<Order["deliveryMethod"], string> = {
  "np-branch": "Нова пошта, відділення",
  courier: "Кур'єром за адресою",
};

const PAYMENT_LABELS: Record<Order["paymentMethod"], string> = {
  cod: "Оплата при отриманні",
  card: "Оплата карткою онлайн",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await api.get<Order>(`/orders/${id}`);

  return (
    <div className="max-w-3xl">
      <Link
        href="/orders"
        className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
      >
        <LuArrowLeft size={14} /> До списку замовлень
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-semibold text-2xl text-ink">{order.orderNumber}</h1>
        <span className="text-sm text-ink-soft">{formatDate(order.createdAt)}</span>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <h2 className="font-medium text-ink">Клієнт</h2>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Імʼя</dt>
              <dd className="text-ink">{order.firstName} {order.lastName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Телефон</dt>
              <dd className="text-ink">{order.phone}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Email</dt>
              <dd className="text-ink">{order.email}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-5">
          <h2 className="font-medium text-ink">Доставка та оплата</h2>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Спосіб</dt>
              <dd className="text-ink">{DELIVERY_LABELS[order.deliveryMethod]}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Місто</dt>
              <dd className="text-ink">{order.city}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Адреса/відділення</dt>
              <dd className="text-ink">{order.address}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Оплата</dt>
              <dd className="text-ink">{PAYMENT_LABELS[order.paymentMethod]}</dd>
            </div>
          </dl>
        </div>
      </div>

      {order.comment && (
        <div className="mt-6 rounded-2xl border border-line bg-paper p-5">
          <h2 className="font-medium text-ink">Коментар</h2>
          <p className="mt-2 text-sm text-ink-soft">{order.comment}</p>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-line bg-paper p-5">
        <h2 className="font-medium text-ink">Товари</h2>
        <ul className="mt-3 divide-y divide-line">
          {order.items.map((item, index) => (
            <li key={index} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium text-ink">{item.name}</p>
                <p className="text-ink-soft">
                  {item.size} · {item.color} · {item.quantity} шт
                </p>
              </div>
              <span className="font-medium text-ink">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
          <div className="flex justify-between text-ink-soft">
            <span>Товари</span>
            <span>{formatPrice(order.totalPrice)}</span>
          </div>
          <div className="flex justify-between text-ink-soft">
            <span>Доставка</span>
            <span>{formatPrice(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between font-semibold text-ink">
            <span>Разом</span>
            <span>{formatPrice(order.totalPrice + order.shippingCost)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between gap-4 rounded-2xl border border-line bg-paper p-5">
        <div className="flex-1">
          <p className="mb-1.5 text-sm font-medium text-ink">Статус замовлення</p>
          <OrderStatusSelect orderId={order._id} status={order.status} />
        </div>
        <DeleteOrderButton id={order._id} />
      </div>
    </div>
  );
}
