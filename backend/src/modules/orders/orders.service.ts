import { Model, Types } from 'mongoose';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async create(createOrderDto: CreateOrderDto, authenticatedUserId: string): Promise<Order> {
    const createdOrder = new this.orderModel({ ...createOrderDto, clientId: new Types.ObjectId(authenticatedUserId) });
    return createdOrder.save();
  }

  async findOrderById(orderId: string, authenticatedUserId: string): Promise<Order> {
    const order = await this.orderModel.findById(new Types.ObjectId(orderId)).exec();
    if (!order) throw new NotFoundException(`Order with ID ${orderId} not found`);
    
    if (!order.clientId.equals(new Types.ObjectId(authenticatedUserId)) && !order.talentId.equals(new Types.ObjectId(authenticatedUserId))) {
      throw new ForbiddenException('You are not authorized to view this order.');
    }
    return order;
  }

  async findOrdersByUserId(userId: string): Promise<Order[]> {
    return this.orderModel.find({ $or: [{ clientId: new Types.ObjectId(userId) }, { talentId: new Types.ObjectId(userId) }] }).exec();
  }

  async updateOrderStatus(orderId: string, status: string, authenticatedUserId: string): Promise<Order> {
    const order = await this.orderModel.findById(new Types.ObjectId(orderId)).exec();
    if (!order) throw new NotFoundException(`Order with ID ${orderId} not found`);

    if (status === 'completed' && !order.clientId.equals(new Types.ObjectId(authenticatedUserId))) {
      throw new ForbiddenException('Only the client can mark the order as completed.');
    }

    if (status === 'in_progress' && !order.talentId.equals(new Types.ObjectId(authenticatedUserId))) {
      throw new ForbiddenException('Only the talent can mark the order as in progress.');
    }

    order.status = status;
    return order.save();
  }

  async approveDelivery(orderId: string, authenticatedUserId: string): Promise<Order> {
    const order = await this.orderModel.findById(new Types.ObjectId(orderId)).exec();
    if (!order) throw new NotFoundException(`Order with ID ${orderId} not found`);

    if (!order.clientId.equals(new Types.ObjectId(authenticatedUserId))) {
      throw new ForbiddenException('Only the client can approve the delivery.');
    }

    order.status = 'completed';
    order.approvedByClient = true;
    return order.save();
  }
}
