import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { Order } from '../models';

@Injectable()
export class OrderService {
  private orders: Order[] = [];

  getAll(): Order[] {
    return this.orders;
  }

  findById(orderId: string): Order {
    const order = this.orders.find(({ id }) => orderId === id);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    return order;
  }

  create(newOrder: Order): Order {
    const id = v4(v4());
    const order = {
      ...newOrder,
      id,
      status: 'inProgress',
    };

    this.orders.push(order);

    return order;
  }

  update(orderId, updatedOrder): Order {
    const order = this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    const itemIndex = this.orders.findIndex(({ id }) => id == orderId);
    
    this.orders[itemIndex] = updatedOrder;

    return updatedOrder;
  }

  delete(orderId): void {
    const itemIndex = this.orders.findIndex(({ id }) => id == orderId);

    this.orders.splice(itemIndex, 1);
  }
}
