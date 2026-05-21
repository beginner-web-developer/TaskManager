import { Routes } from '@angular/router';
import { SignUp } from './components/sign-up/sign-up';
import { Login } from './components/login/login';
import { Tasks } from './components/tasks/tasks';

export const routes: Routes = [
    { path: "", redirectTo: "register", pathMatch: 'full' },
    { path: "register", component: SignUp },
    { path: "login", component: Login }, 
    { path: "tasks", component: Tasks }
];
