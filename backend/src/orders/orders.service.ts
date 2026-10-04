import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { ProductsService } from '../products/products.service.js';
import { sendAdminMessage } from '../common/telegram-notify.js';

const SITE_URL = 'https://martosoli.com';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    private readonly productsService: ProductsService,
  ) {}

  private async generateOrderNumber(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = `SL-${Math.floor(100000 + Math.random() * 900000)}`;
      const exists = await this.orderModel.exists({ orderNumber: candidate });
      if (!exists) return candidate;
    }
    return `SL-${Date.now()}`;
  }

  async create(dto: CreateOrderDto) {
    const orderNumber = await this.generateOrderNumber();
    const order = await this.orderModel.create({ ...dto, orderNumber });
    await this.notifyTelegram(order);
    return order;
  }

  private async notifyTelegram(order: OrderDocument) {
    const deliveryLabel =
      order.deliveryMethod === 'np-branch' ? 'Нова пошта, відділення' : "Кур'єром";
    const paymentLabel = order.paymentMethod === 'cod' ? 'При отриманні' : 'Карткою онлайн';

    // Best-effort lookup — a deleted/missing product just means no link for that line.
    const resolvedItems = await Promise.all(
      order.items.map(async (item) => {
        if (!item.productId) return { item, url: undefined };
        try {
          const product = await this.productsService.findOne(item.productId);
          return { item, url: `${SITE_URL}/product/${product.slug}` };
        } catch {
          return { item, url: undefined };
        }
      }),
    );

    const itemsText = resolvedItems
      .map(({ item, url }) => {
        const line = `• ${item.name} — ${item.size}, ${item.color}, ${item.quantity} шт — ${item.price * item.quantity} грн`;
        return url ? `${line}\n  ${url}` : line;
      })
      .join('\n');

    const text = [
      `🆕 Нове замовлення ${order.orderNumber}`,
      '',
      `👤 ${order.firstName} ${order.lastName}`,
      `📞 ${order.phone}`,
      `✉️ ${order.email}`,
      '',
      `📦 ${deliveryLabel}`,
      `🏙 ${order.city}, ${order.address}`,
      `💳 ${paymentLabel}`,
      '',
      'Товари:',
      itemsText,
      '',
      `Разом: ${order.totalPrice + order.shippingCost} грн`,
      ...(order.comment ? ['', `Коментар: ${order.comment}`] : []),
    ].join('\n');

    await sendAdminMessage(text);
  }

  findAll(status?: OrderStatus) {
    const query: QueryFilter<OrderDocument> = {};
    if (status) query.status = status;
    return this.orderModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException('Замовлення не знайдено');
    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!order) throw new NotFoundException('Замовлення не знайдено');
    return order;
  }

  async remove(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id).exec();
    if (!order) throw new NotFoundException('Замовлення не знайдено');
    return order;
  }
}
