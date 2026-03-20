import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Cadastro } from './cadastro/cadastro';
import { TelaPedido } from './telaPedido/telaPedido'; 

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'cadastro',
    component: Cadastro,
  },
   {
    path: 'pedido', 
    component: TelaPedido,
  },
  
];