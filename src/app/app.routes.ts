import { Routes } from '@angular/router';
import { Login } from './login/login';
import { AppLayout } from './layout/app-layout';
import { authGuard } from './auth/auth.guard';
import { superadminGuard } from './auth/role.guard';
import { funcionalidadeGuard } from './auth/funcionalidade.guard';
import { garcomAreaGuard } from './auth/garcom-area.guard';
import { cozinheiroAreaGuard } from './auth/cozinheiro-area.guard';
import { Home } from './home/home';
import { DashboardComponent } from './dashboard/dashboard';
import { ComponentFila } from './Fila/component.fila';
import { TelaCozinha } from './tela-cozinha/tela-cozinha';
import { RelatorioCozinha } from './relatorio-cozinha/relatorio-cozinha';
import { RelatorioPedidos } from './relatorio-pedidos/relatorio-pedidos';
import { ConfirmarPedComponent } from './confirmar-pedido/confirmar-pedido';
import { ControleEstoque } from './controle-estoque/controle-estoque';
import { HistoricoVendasComponent } from './historico-vendas/historico-vendas';
import { Financeiro } from './financeiro/financeiro';
import { NovoPedido } from './novo-pedido/novo-pedido';
import { PerfilAdmin } from './perfil-admin/perfilAdmin';
import { PerfilGarcom } from './perfil-garcom/perfilGarcom';
import { CadastroProdutoComponent } from './cadastro-produto/cadastroProduto';
import { CardapioAdmin } from './cardapio-admin/cardapio-admin';
import { CaixaComponent } from './caixa/caixa';
import { CuponsCashback } from './cupons-cashback/cupons-cashback';
import { Mesas } from './mesas/mesas';
import { Comandas } from './comandas/comandas';
import { Fornecedores } from './fornecedores/fornecedores';
import { RelatorioEstoque } from './relatorio-estoque/relatorio-estoque';
import { PedidosCompra } from './pedidos-compra/pedidos-compra';
import { GestaoFinanceira } from './gestao-financeira/gestao-financeira';
import { FichaTecnica } from './ficha-tecnica/ficha-tecnica';
import { Clientes } from './clientes/clientes';
import { Fidelidade } from './fidelidade/fidelidade';
import { Usuarios } from './usuarios/usuarios';
import { GruposAcesso } from './grupos-acesso/grupos-acesso';
import { ConfiguracoesGeral } from './configuracoes-geral/configuracoes-geral';
import { ConfiguracoesIntegracoes } from './configuracoes-integracoes/configuracoes-integracoes';
import { DeliveryDashboard } from './delivery-dashboard/delivery-dashboard';
import { DeliveryRelatorios } from './delivery-relatorios/delivery-relatorios';
import { Categorias } from './categorias/categorias';
import { SuperadminDashboard } from './superadmin-dashboard/superadmin-dashboard';
import { SuperadminEmpresas } from './superadmin-empresas/superadmin-empresas';
import { SuperadminSegmentos } from './superadmin-segmentos/superadmin-segmentos';
import { SuperadminUsuarios } from './superadmin-usuarios/superadmin-usuarios';
import { SuperadminPagamentos } from './superadmin-pagamentos/superadmin-pagamentos';
import { SuperadminFinanceiro } from './superadmin-financeiro/superadmin-financeiro';
import { SuperadminConfiguracoes } from './superadmin-configuracoes/superadmin-configuracoes';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'login',
    component: Login,
  },

  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard],
    canActivateChild: [garcomAreaGuard, cozinheiroAreaGuard],
    children: [
      { path: 'home', component: Home },
      { path: 'dashboard', component: DashboardComponent },

      { path: 'mesas', component: Mesas, canActivate: [funcionalidadeGuard(['OPERACAO'])] },
      { path: 'comandas', component: Comandas, canActivate: [funcionalidadeGuard(['OPERACAO'])] },
      { path: 'caixa', component: CaixaComponent, canActivate: [funcionalidadeGuard(['CAIXA'])] },

      { path: 'novo-pedido', component: NovoPedido, canActivate: [funcionalidadeGuard(['PEDIDO'])] },
      { path: 'historico-vendas', component: HistoricoVendasComponent, canActivate: [funcionalidadeGuard(['PEDIDO'])] },
      { path: 'relatorio-pedidos', component: RelatorioPedidos, canActivate: [funcionalidadeGuard(['PEDIDO'])] },

      { path: 'fila', component: ComponentFila, canActivate: [funcionalidadeGuard(['COZINHA'])] },
      { path: 'tela-cozinha', component: TelaCozinha, canActivate: [funcionalidadeGuard(['COZINHA'])] },
      { path: 'relatorio-cozinha', component: RelatorioCozinha, canActivate: [funcionalidadeGuard(['COZINHA'])] },

      { path: 'delivery-dashboard', component: DeliveryDashboard, canActivate: [funcionalidadeGuard(['DELIVERY'])] },
      { path: 'delivery-relatorios', component: DeliveryRelatorios, canActivate: [funcionalidadeGuard(['DELIVERY'])] },

      { path: 'controle-estoque', component: ControleEstoque, canActivate: [funcionalidadeGuard(['ESTOQUE'])] },
      { path: 'categorias', component: Categorias, canActivate: [funcionalidadeGuard(['ESTOQUE', 'PRODUTOS'])] },
      { path: 'relatorio-estoque', component: RelatorioEstoque, canActivate: [funcionalidadeGuard(['ESTOQUE'])] },

      { path: 'pedidos-compra', component: PedidosCompra, canActivate: [funcionalidadeGuard(['COMPRAS'])] },
      { path: 'fornecedores', component: Fornecedores, canActivate: [funcionalidadeGuard(['COMPRAS'])] },

      { path: 'financeiro', component: Financeiro, canActivate: [funcionalidadeGuard(['FINANCEIRO'])] },
      { path: 'gestao-financeira', component: GestaoFinanceira, canActivate: [funcionalidadeGuard(['FINANCEIRO'])] },

      { path: 'cadastro-produto', component: CadastroProdutoComponent, canActivate: [funcionalidadeGuard(['PRODUTOS'])] },
      { path: 'ficha-tecnica', component: FichaTecnica, canActivate: [funcionalidadeGuard(['PRODUTOS'])] },
      { path: 'cardapio-admin', component: CardapioAdmin, canActivate: [funcionalidadeGuard(['PRODUTOS'])] },

      { path: 'clientes', component: Clientes, canActivate: [funcionalidadeGuard(['CLIENTES'])] },
      { path: 'fidelidade', component: Fidelidade, canActivate: [funcionalidadeGuard(['CLIENTES'])] },
      { path: 'cupons-cashback', component: CuponsCashback, canActivate: [funcionalidadeGuard(['CUPONS'])] },

      { path: 'usuarios', component: Usuarios, canActivate: [funcionalidadeGuard(['USUARIOS'])] },
      { path: 'grupos-acesso', component: GruposAcesso, canActivate: [funcionalidadeGuard(['USUARIOS'])] },

      { path: 'configuracoes-geral', component: ConfiguracoesGeral, canActivate: [funcionalidadeGuard(['CONFIGURACOES'])] },
      { path: 'configuracoes-integracoes', component: ConfiguracoesIntegracoes, canActivate: [funcionalidadeGuard(['CONFIGURACOES'])] },

      { path: 'superadmin-dashboard', component: SuperadminDashboard, canActivate: [superadminGuard] },
      { path: 'superadmin-empresas', component: SuperadminEmpresas, canActivate: [superadminGuard] },
      { path: 'superadmin-segmentos', component: SuperadminSegmentos, canActivate: [superadminGuard] },
      { path: 'superadmin-usuarios', component: SuperadminUsuarios, canActivate: [superadminGuard] },
      { path: 'superadmin-pagamentos', component: SuperadminPagamentos, canActivate: [superadminGuard] },
      { path: 'superadmin-financeiro', component: SuperadminFinanceiro, canActivate: [superadminGuard] },
      { path: 'superadmin-configuracoes', component: SuperadminConfiguracoes, canActivate: [superadminGuard] },

      { path: 'perfil-admin', component: PerfilAdmin },
      { path: 'perfil-garcom', component: PerfilGarcom },
      { path: 'confirmar-pedido', component: ConfirmarPedComponent },
    ],
  },
];
