import { IsEnum } from 'class-validator';
import { OrderStatus } from '../schemas/order.schema.js';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
