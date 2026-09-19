export type Subcategory = {
  _id: string;
  name: string;
  slug: string;
};

export type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  subcategories: Subcategory[];
};

export type ProductColor = {
  name: string;
  hex: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  category: Category | string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  description: string;
  details: string[];
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  isNew: boolean;
  isBestseller: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OrderStatus =
  | "new"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export type OrderItem = {
  productId?: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
};

export type Order = {
  _id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  deliveryMethod: "np-branch" | "courier";
  city: string;
  address: string;
  paymentMethod: "cod" | "card";
  items: OrderItem[];
  totalPrice: number;
  shippingCost: number;
  comment?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Нове",
  processing: "В обробці",
  shipped: "Відправлено",
  completed: "Виконано",
  cancelled: "Скасовано",
};
