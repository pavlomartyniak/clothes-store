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
    return this.orderModel.create({ ...dto, orderNumber });
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
