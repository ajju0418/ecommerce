import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductListItem } from '../models/product.types';
import { OrderService } from './order-service';
import { AdminSyncService } from './admin-sync.service';

@Injectable({
  providedIn: 'root'
})
export class cartService {
  private initialCartItems: ProductListItem[] = [];
  private cartItemsSubject = new BehaviorSubject<ProductListItem[]>(this.initialCartItems);
  cartItems$: Observable<ProductListItem[]> = this.cartItemsSubject.asObservable();

  constructor(
    private orderService: OrderService,
    private adminSyncService: AdminSyncService
  ) {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItemsSubject.next(JSON.parse(storedCart));
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItemsSubject.value));
  }

  addToCart(product: ProductListItem): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 0) + 1;
    } else {
      const newItem = { ...product, quantity: 1 };
      currentItems.push(newItem);
    }

    this.cartItemsSubject.next([...currentItems]);
    this.saveCartToStorage();

    // Sync with admin
    this.adminSyncService.syncProducts(currentItems);
  }

  getCartItems(): ProductListItem[] {
    return this.cartItemsSubject.value;
  }

  updateQuantity(index: number, change: number): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems[index];

    const newQuantity = (item.quantity ?? 0) + change;
    item.quantity = newQuantity;

    if (item.quantity < 1) item.quantity = 1;

    this.cartItemsSubject.next([...currentItems]);
    this.saveCartToStorage();
    this.adminSyncService.syncProducts(currentItems);
  }

  removeItem(index: number): void {
    const currentItems = this.cartItemsSubject.value;
    currentItems.splice(index, 1);
    this.cartItemsSubject.next([...currentItems]);
    this.saveCartToStorage();
    this.adminSyncService.syncProducts(currentItems);
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  }

  checkout(customerInfo: any): string {
    const items = this.cartItemsSubject.value;
    const totalAmount = this.getTotalPrice();

    if (items.length === 0) {
      throw new Error('Cart is empty');
    }

    const order = this.orderService.createOrder(items, totalAmount, customerInfo);
    this.clearCart();

    return order.id;
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveCartToStorage();
    this.adminSyncService.syncProducts([]);
  }

  redirectToAdmin(orderId: string): void {
    this.adminSyncService.redirectToAdmin(orderId);
  }
}
