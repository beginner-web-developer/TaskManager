import { Routes } from '@angular/router';
import { SignUp } from './components/sign-up/sign-up';
import { Login } from './components/login/login';
import { Tasks } from './components/tasks/tasks';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';

export const routes: Routes = [
    { path: "", redirectTo: "register", pathMatch: 'full' },
    { path: "register", component: SignUp, data: { isAdmin: false } },
    { path: "login", component: Login, data: { isAdmin: false } }, 
    { path: "tasks", component: Tasks },
    
    // admin paths
    { path: "admin/register", component: SignUp, data: { isAdmin: true } },
    { path: "admin/login", component: Login, data: { isAdmin: true } }, 
    { path: "admin/dashboard", component: AdminDashboard }
];
