import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Cadastro } from './cadastro/cadastro';
import { DashboardComponent } from './dashboard/dashboard';
import { PerfilAdmin } from './perfilAdmin/perfilAdmin';
import { PerfilGarcom } from './perfilGarcom/perfilGarcom';


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
    path: 'perfil-admin',
    component: PerfilAdmin,
  },
  {
    path: 'perfil-garcom',
    component: PerfilGarcom,
  }
];
