import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Register } from './components/register/register';

export const routes: Routes = [
    {path:'',component:Home},//Homeu
    {path:'register',component:Register},//Home
    {path:'login',component:Login}
];
