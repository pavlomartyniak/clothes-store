import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum OrderStatus {
  NEW = 'new',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum DeliveryMethod {
  NP_BRANCH = 'np-branch',
  COURIER = 'courier',
}

export enum PaymentMethod {
  COD = 'cod',
  CARD = 'card',
}

@Schema({ _id: false })
export class OrderItem {
  @Prop()
  productId?: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, trim: true })
  size: string;

  @Prop({ required: true, trim: true })
  color: string;

  @Prop({ required: true, min: 1 })
  quantity: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ type: String, enum: DeliveryMethod, required: true })
  deliveryMethod: DeliveryMethod;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ type: String, enum: PaymentMethod, required: true })
  paymentMethod: PaymentMethod;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ required: true, min: 0 })
  totalPrice: number;

  @Prop({ default: 0, min: 0 })
  shippingCost: number;

  @Prop({ trim: true })
  comment?: string;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.NEW })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
