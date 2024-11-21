import { Model, Types } from 'mongoose';
import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  async create(createOrderDto: CreateOrderDto, authenticatedUserId: string): Promise<Order> {
    const createdOrder = new this.orderModel({
      ...createOrderDto,
      clientId: new Types.ObjectId(authenticatedUserId),
      status: 'pending',
      paymentStatus: 'pending',
    });
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
    return this.orderModel
      .find({
        $or: [{ clientId: new Types.ObjectId(userId) }, { talentId: new Types.ObjectId(userId) }],
      })
      .exec();
  }

  async updateOrderStatus(orderId: string, status: string, authenticatedUserId: string): Promise<Order> {
    const order = await this.orderModel.findById(new Types.ObjectId(orderId)).exec();
    if (!order) throw new NotFoundException(`Order with ID ${orderId} not found`);

    const isClient = order.clientId.equals(new Types.ObjectId(authenticatedUserId));
    const isTalent = order.talentId.equals(new Types.ObjectId(authenticatedUserId));

    if (status === 'completed') {
      if (!isClient) throw new ForbiddenException('Only the client can mark the order as completed.');
      if (order.status !== 'in_progress') throw new ConflictException('Order must be in progress to complete.');
    }

    if (status === 'in_progress') {
      if (!isTalent) throw new ForbiddenException('Only the talent can mark the order as in progress.');
      if (order.status !== 'pending') throw new ConflictException('Order must be pending to start progress.');
    }

    if (status === 'cancelled') {
      if (!isClient) throw new ForbiddenException('Only the client can cancel the order.');
      if (order.status === 'completed') throw new ConflictException('Cannot cancel a completed order.');
      order.cancelledAt = new Date();
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

    if (order.status !== 'in_progress') throw new ConflictException('Order must be in progress to approve delivery.');

    order.status = 'completed';
    order.approvedByClient = true;
    order.completedAt = new Date();
    order.paymentStatus = 'released';  // Asumiendo que el pago se libera al completar el pedido

    return order.save();
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string): Promise<Order> {
    const order = await this.orderModel.findById(new Types.ObjectId(orderId)).exec();
    if (!order) throw new NotFoundException(`Order with ID ${orderId} not found`);

    if (['paid', 'held', 'released', 'refunded'].includes(paymentStatus)) {
      order.paymentStatus = paymentStatus;
    } else {
      throw new ConflictException(`Invalid payment status: ${paymentStatus}`);
    }

    return order.save();
  }
}
