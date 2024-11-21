import { Controller, Get, Post, Patch, Body, Param, Req, ForbiddenException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: AuthenticatedRequest) {
    const authenticatedUserId = req.user.id;
    return this.ordersService.create(createOrderDto, authenticatedUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOrderById(@Param('id') orderId: string, @Req() req: AuthenticatedRequest) {
    const authenticatedUserId = req.user.id;
    return this.ordersService.findOrderById(orderId, authenticatedUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async findOrdersByUserId(@Param('userId') userId: string, @Req() req: AuthenticatedRequest) {
    const authenticatedUserId = req.user.id;
    if (authenticatedUserId !== userId) {
      throw new ForbiddenException('You are not authorized to view these orders.');
    }
    return this.ordersService.findOrdersByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body('status') status: string,
    @Req() req: AuthenticatedRequest
  ) {
    const authenticatedUserId = req.user.id;
    return this.ordersService.updateOrderStatus(orderId, status, authenticatedUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/approve')
  async approveDelivery(@Param('id') orderId: string, @Req() req: AuthenticatedRequest) {
    const authenticatedUserId = req.user.id;
    return this.ordersService.approveDelivery(orderId, authenticatedUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/payment-status')
  async updatePaymentStatus(
    @Param('id') orderId: string,
    @Body('paymentStatus') paymentStatus: string,
  ) {
    return this.ordersService.updatePaymentStatus(orderId, paymentStatus);
  }
}
