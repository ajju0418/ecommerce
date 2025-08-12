
import { Routes } from '@angular/router';
import { NotFound } from './components/not-found/not-found';
import { Home } from './components/home/home';
import { CartComponent } from './components/cart/cart';
import { ProductPage } from './components/product-page/product-page';
import { UserLogin } from './components/user-login/user-login';
import { UserRegister } from './components/user-register/user-register';
import { AboutUs } from './components/about-us/about-us';
import { NewArrivals } from './components/new-arrivals/new-arrivals';
import { DealsOfTheDay } from './components/deals-of-the-day/deals-of-the-day';
import { Sale } from './components/sale/sale';
import { ContactUs } from './components/contact-us/contact-us';
import { UserProfileComponent } from './components/user-profile/user-profile';
import { LoginPage } from './components/login-page/login-page';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { AdminDashboardOverview } from './components/admin-dashboard-overview/admin-dashboard-overview';
import { AdminProducts } from './components/admin-products/admin-products';
import { AdminSales } from './components/admin-sales/admin-sales';
import { AdminCustomers } from './components/admin-customers/admin-customers';
import { Adminlogin } from './components/adminlogin/adminlogin';




export const routes: Routes = [
    { path: "home", component: Home },
    { path: "login-page", component: LoginPage },
    { path: "", redirectTo: "login-page", pathMatch: "full" },
    { path: "home/cart", component: CartComponent },
    // Admin shell layout with child routes
    { path: 'admin', component: AdminDashboard, children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: AdminDashboardOverview },
        { path: 'products', component: AdminProducts },
        { path: 'sales', component: AdminSales },
        { path: 'customers', component: AdminCustomers },
      ]
    },
    { path: "products-page", component: ProductPage },
    { path: "login", component: UserLogin },
    { path: "register", component: UserRegister },
    { path: "aboutus", component: AboutUs },
    { path: "new-arrivals", component: NewArrivals },
    { path: "deals-of-the-day", component: DealsOfTheDay },
    { path: "sale", component: Sale },
    { path: "user-profile", component: UserProfileComponent },

    { path: "contact-us", component: ContactUs },
    { path: "adminlogin", component: Adminlogin},
    { path: "**", component: NotFound }
];

