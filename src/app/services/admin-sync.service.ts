import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderService, Order } from './order-service';
import { ProductListItem } from '../models/product.types';

@Injectable({
  providedIn: 'root'
})
export class AdminSyncService {
  private adminProductsSubject = new BehaviorSubject<ProductListItem[]>([]);
  public adminProducts$ = this.adminProductsSubject.asObservable();

  private newOrdersSubject = new BehaviorSubject<Order[]>([]);
  public newOrders$ = this.newOrdersSubject.asObservable();

  constructor(private orderService: OrderService) {
    this.initializeSync();
  }

  private initializeSync(): void {
    // Subscribe to orders and notify admin dashboard
    this.orderService.orders$.subscribe(orders => {
      this.newOrdersSubject.next(orders);
    });
  }

  syncProducts(products: ProductListItem[]): void {
    this.adminProductsSubject.next(products);
  }

  getAdminProducts(): Observable<ProductListItem[]> {
    return this.adminProducts$;
  }

  getNewOrders(): Observable<Order[]> {
    return this.newOrders$;
  }

  redirectToAdmin(orderId: string): void {
    // Store the order ID in session storage for admin page access
    sessionStorage.setItem('adminOrderId', orderId);
    window.open('/admin/dashboard', '_blank');
  }
}
