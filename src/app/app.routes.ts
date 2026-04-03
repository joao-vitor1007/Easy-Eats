import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Cadastro } from './cadastro/cadastro';
<<<<<<< HEAD
import { DashboardComponent } from './dashboard/dashboard';
import { ComponentFila } from './fila/component.fila';
import { PerfilAdmin } from './perfilAdmin/perfilAdmin';
import { PerfilGarcom } from './perfilGarcom/perfilGarcom';
=======
import { TelaPedido } from './telaPedido/telaPedido'; 
>>>>>>> telaPedido

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
<<<<<<< HEAD
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'fila',
    component: ComponentFila,
  },
  {
    path: 'perfil-admin',
    component: PerfilAdmin,
  },
  {
    path: 'perfil-garcom',
    component: PerfilGarcom,
  }
=======
   {
    path: 'pedido', 
    component: TelaPedido,
  },
  
>>>>>>> telaPedido
];