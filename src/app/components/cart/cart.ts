import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { cartService } from '../../services/cart-Service';
import { OrderService } from '../../services/order-service';
import { AdminSyncService } from '../../services/admin-sync.service';
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { ProductListItem } from '../../models/product.types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: ProductListItem[] = [];
  savedItems: any[] = [];
  couponCode: string = '';
  appliedDiscount: number = 0;
  totalAmount: number = 0;
  customerName: string = '';
  customerEmail: string = '';
  customerPhone: string = '';
  showCheckoutForm: boolean = false;

  cartSubscription!: Subscription;

  constructor(
    private cartService: cartService,
    private orderService: OrderService,
    private adminSyncService: AdminSyncService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  changeQuantity(index: number, delta: number): void {
    const item = this.cartItems[index];
    const newQty = (item.quantity ?? 0) + delta;

    if (newQty >= 1 && newQty <= 5) {
      this.cartService.updateQuantity(index, delta);
    } else if (newQty > 5) {
      alert('Maximum quantity allowed is 5.');
    }
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (sum, item) => sum + (item.price * (item.quantity || 1)),
      0
    );

    if (this.appliedDiscount > 0) {
      this.totalAmount -= this.appliedDiscount;
    }
  }

  applyCoupon(): void {
    const code = this.couponCode.trim().toUpperCase();

    if (code === 'SAVE50') {
      this.appliedDiscount = 50;
      alert('Coupon applied: ₹50 off!');
    } else if (code === 'DISCOUNT10') {
      const subtotal = this.cartItems.reduce(
        (sum, item) => sum + (item.price * (item.quantity || 1)),
        0
      );
      this.appliedDiscount = subtotal * 0.1;
      alert('Coupon applied: 10% off!');
    } else {
      alert('Invalid coupon code.');
      this.appliedDiscount = 0;
    }

    this.calculateTotal();
  }

  confirmRemove(index: number): void {
    if (window.confirm('Are you sure you want to remove this item?')) {
      this.removeItem(index);
    }
  }

  removeItem(index: number): void {
    this.cartService.removeItem(index);
    this.calculateTotal();
  }

  saveForLater(index: number): void {
    const item = this.cartItems[index];
    this.savedItems.push(item);
    this.cartService.removeItem(index);
    alert(`${item.name} has been saved for later.`);
  }

  toggleCheckoutForm(): void {
    this.showCheckoutForm = !this.showCheckoutForm;
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!this.customerName || !this.customerEmail || !this.customerPhone) {
      alert('Please fill in all customer details!');
      return;
    }

    const customerInfo = {
      name: this.customerName,
      email: this.customerEmail,
      phone: this.customerPhone
    };

    try {
      const orderId = this.cartService.checkout(customerInfo);
      alert(`Order placed successfully! Order ID: ${orderId}`);

      // Redirect to admin dashboard
      this.cartService.redirectToAdmin(orderId);

      this.showCheckoutForm = false;
    } catch (error) {
      alert('Error placing order: ' + (error as Error).message);
    }
  }

  viewOrderInAdmin(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Create a temporary order for viewing in admin
    const customerInfo = {
      name: 'Guest User',
      email: 'guest@example.com',
      phone: '0000000000'
    };

    const orderId = this.cartService.checkout(customerInfo);
    this.cartService.redirectToAdmin(orderId);
  }

  payNow(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    this.toggleCheckoutForm();
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Show payment success alert with amount
    alert(`Payment successful! Amount: ₹${this.totalAmount.toFixed(2)}`);
  }
}
