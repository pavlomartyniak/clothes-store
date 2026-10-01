import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema.js';
import { CreateOrderDto } from './dto/create-order.dto.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
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
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;

    const deliveryLabel =
      order.deliveryMethod === 'np-branch' ? 'Нова пошта, відділення' : "Кур'єром";
    const paymentLabel = order.paymentMethod === 'cod' ? 'При отриманні' : 'Карткою онлайн';

    const itemsText = order.items
      .map(
        (item) =>
          `• ${item.name} — ${item.size}, ${item.color}, ${item.quantity} шт — ${item.price * item.quantity} грн`,
      )
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

    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
    } catch (err) {
      // Telegram being down shouldn't fail order creation.
      console.error('Failed to send Telegram order notification:', err);
    }
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
