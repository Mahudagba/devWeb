import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { Checkout } from './components/checkout/checkout';
import { UserProfile } from './components/user-profile/user-profile';
import { Orders } from './components/orders/orders';
import { EditeProfile } from './components/edite-profile/edite-profile';
import { AdminLayaout } from './admin/admin-layaout/admin-layaout';
import { Dashboard } from './admin/dashboard/dashboard';
import { Categories } from './admin/categories/categories';
import { AdminProductsList } from './admin/products/products-list/products-list';
import { ProductDetail } from './admin/products/product-detail/product-detail';
import { OrdersList } from './admin/orders/orders-list/orders-list';
import { OrdersDetail } from './admin/orders/orders-detail/orders-detail';
import { UsersList } from './admin/users/users-list/users-list';

export const routes: Routes = [
  { path: '', component: Home },//
  { path: 'register', component: Register },//
  { path: 'login', component: Login },
  { path: 'checkout', component: Checkout },
  { path: 'profile', component: UserProfile },
  { path: 'edit-profile', component: EditeProfile },
  { path: 'orders', component: Orders },
  {
    path: 'admin',
    component: AdminLayaout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'categories', component: Categories },
      { path: 'products', component: AdminProductsList },
      { path: 'products/:id', component: ProductDetail },
      { path: 'orders', component: OrdersList },
      { path: 'orders/:id', component: OrdersDetail },
      { path: 'users', component: UsersList },
      { path: 'profile', component: UserProfile },
      { path: 'edit-profile', component: EditeProfile },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }

];
