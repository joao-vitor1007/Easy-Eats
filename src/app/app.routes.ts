import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Cadastro } from './cadastro/cadastro';

import { DashboardComponent } from './dashboard/dashboard';
import { ComponentFila } from './Fila/component.fila';





export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'cadastro',
    component: Cadastro,
  },
  {

    path: 'dashboard',
    component: DashboardComponent,
  },
 {
    path: 'fila',
    component: ComponentFila,
 }
];