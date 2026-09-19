import { Badge } from "@/components/ui/Badge";
import { ORDER_STATUS_LABELS, OrderStatus } from "@/lib/types";

const TONES: Record<OrderStatus, "muted" | "accent" | "success" | "danger" | "ink"> = {
  new: "accent",
  processing: "muted",
  shipped: "ink",
  completed: "success",
  cancelled: "danger",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={TONES[status]}>{ORDER_STATUS_LABELS[status]}</Badge>;
}
