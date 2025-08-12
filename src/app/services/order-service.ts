import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductListItem } from '../models/product.types';

export interface Order {
  id: string;
  items: ProductListItem[];
  totalAmount: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  orderDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  private currentOrderSubject = new BehaviorSubject<Order | null>(null);
  public currentOrder$ = this.currentOrderSubject.asObservable();

  constructor() {
    this.loadOrdersFromStorage();
  }

  private loadOrdersFromStorage(): void {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      this.ordersSubject.next(JSON.parse(storedOrders));
    }
  }

  private saveOrdersToStorage(): void {
    localStorage.setItem('orders', JSON.stringify(this.ordersSubject.value));
  }

  createOrder(items: ProductListItem[], totalAmount: number, customerInfo: any): Order {
    const order: Order = {
      id: this.generateOrderId(),
      items: [...items],
      totalAmount,
      customerInfo,
      orderDate: new Date(),
      status: 'pending'
    };

    const currentOrders = this.ordersSubject.value;
    this.ordersSubject.next([...currentOrders, order]);
    this.currentOrderSubject.next(order);
    this.saveOrdersToStorage();

    return order;
  }

  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  getOrderById(id: string): Order | undefined {
    return this.ordersSubject.value.find(order => order.id === id);
  }

  updateOrderStatus(id: string, status: Order['status']): void {
    const orders = this.ordersSubject.value.map(order =>
      order.id === id ? { ...order, status } : order
    );
    this.ordersSubject.next(orders);
    this.saveOrdersToStorage();
  }

  private generateOrderId(): string {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  clearCurrentOrder(): void {
    this.currentOrderSubject.next(null);
  }
}
