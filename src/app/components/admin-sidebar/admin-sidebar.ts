import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css'
})
export class AdminSidebar {
  @Output() sectionChange = new EventEmitter<string>();

  constructor(public router: Router) {}

  menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { id: 'products', label: 'Product List', icon: 'products', route: '/admin/products' },
    { id: 'sales', label: 'Sales', icon: 'sales', route: '/admin/sales' },
    { id: 'customers', label: 'Customers', icon: 'customers', route: '/admin/customers' },
    { id: 'logout', label: 'Log out', icon: 'logout', route: '/login' }
  ];

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  onMenuItemClick(section: string) {
    this.sectionChange.emit(section);
  }
}
