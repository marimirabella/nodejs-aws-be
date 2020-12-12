import {
  Controller,
  Req,
  Get,
  Param,
  Post,
  Body,
  HttpStatus,
  Delete,
  Put,
} from '@nestjs/common';

import { AppRequest } from '../shared';
import { Order } from './models';
import { OrderService } from './services/order.service';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Get()
  getOrders(@Req() req: AppRequest) {
    const orders = this.orderService.getAll();

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { orders },
    };
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Get(':id')
  getOrder(@Param('id') id: string) {
    const order = this.orderService.findById(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order },
    };
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Post()
  addOrder(@Body() order: Order) {
    const createdOrder = this.orderService.create(order);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'OK',
      data: { order: createdOrder },
    };
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Put(':id')
  updateOrder(@Param('id') id: string, @Body() order: Order) {
    const updatedOrder = this.orderService.update(id, order);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order: updatedOrder },
    };
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    this.orderService.delete(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }
}
