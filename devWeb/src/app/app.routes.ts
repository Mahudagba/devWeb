import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { Checkout } from './components/checkout/checkout';

export const routes: Routes = [
    {path:'',component:Home},//
    {path:'register',component:Register},//
    {path:'login',component:Login},
    {path:'checkout',component:Checkout}
];
