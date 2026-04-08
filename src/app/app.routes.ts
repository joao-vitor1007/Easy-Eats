import { Routes } from '@angular/router';

// Importações corrigidas seguindo a árvore de arquivos da imagem
import { Login } from './login/login'; // Verifique se o nome da classe é LoginComponent
import { Cadastro } from './cadastro/cadastro'; 
import { Dashboard } from './dashboard/dashboard';
import { ComponentFila } from './Fila/component.fila'; // Note o "F" maiúsculo da pasta Fila
import { PerfilAdmin } from './perfilAdmin/perfilAdmin';
import { PerfilGarcom } from './perfilGarcom/perfilGarcom';
import { ConfirmarPedComponent } from './confirmar-ped/confirmar-ped';
import { ControleEstoque } from './controle-estoque/controle-estoque';

import { TelaPedido } from './telaPedido/telaPedido';

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
    component: Dashboard,
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
  },
  {
    path:'confirmar-ped',
    component:ConfirmarPedComponent,
  },
{
  path: 'controle-estoque',
  component: ControleEstoque,
},
{
  path: 'tela-pedido',
  component: TelaPedido,
},
];

