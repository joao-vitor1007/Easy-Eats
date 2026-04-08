import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Cadastro } from './cadastro/cadastro';
import { DashboardComponent } from './dashboard/dashboard';
import { ComponentFila } from './Fila/component.fila';
import { ConfirmarPedComponent } from './confirmar-ped/confirmar-ped';
import { ControleEstoque } from './controle-estoque/controle-estoque';
<<<<<<< HEAD
import { NovoPedido } from './novo-pedido/novo-pedido';
import { PerfilAdmin } from './perfil-admin/perfilAdmin';
import { PerfilGarcom } from './perfil-garcom/perfilGarcom';
=======
import { CadastroProdutoComponent } from './cadastroProduto/cadastroProduto';
>>>>>>> de09b2f (layout tela cadastro produto finalizado)

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
    path: 'confirmar-ped',
    component: ConfirmarPedComponent,
  },
  {
    path: 'controle-estoque',
    component: ControleEstoque,
  },
  {
<<<<<<< HEAD
    path: 'novo-pedido',
    component: NovoPedido,
=======
    path: 'cadastro-produto',
    component: CadastroProdutoComponent,
>>>>>>> de09b2f (layout tela cadastro produto finalizado)
  },
];
