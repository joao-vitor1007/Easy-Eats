import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, Perfil, Funcionalidade } from '../../app/auth/auth.service';

interface ItemMenu {
  label: string;
  icon: string;
  rota: string | null;
  cor: string;
  perfis?: Perfil[];
  funcionalidades?: Funcionalidade[];
  filhos?: ItemMenu[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Input() colapsado = false;
  @Input() abertoMobile = false;
  @Output() alternar = new EventEmitter<void>();

  abertos = new Set<string>(['Home']);

  constructor(protected authService: AuthService) {}

  private readonly todosItens: ItemMenu[] = [
    {
      label: 'Home',
      icon: 'bi-house',
      rota: null,
      cor: '#2563eb',
      filhos: [
        { label: 'Homepage', icon: 'bi-house-door', rota: '/home', cor: '#2563eb' },
        { label: 'Dashboard', icon: 'bi-speedometer2', rota: '/dashboard', cor: '#2563eb' },
      ],
    },
    {
      label: 'Operação',
      icon: 'bi-lightning-charge',
      rota: null,
      cor: '#7c3aed',
      perfis: ['ADMINISTRADOR'],
      funcionalidades: ['OPERACAO'],
      filhos: [
        { label: 'Mesas', icon: 'bi-grid-3x3-gap', rota: '/mesas', cor: '#7c3aed' },
        { label: 'Comandas', icon: 'bi-receipt', rota: '/comandas', cor: '#7c3aed' },
      ],
    },
    {
      label: 'Caixa',
      icon: 'bi-cash-stack',
      rota: '/caixa',
      cor: '#16a34a',
      funcionalidades: ['CAIXA'],
    },
    {
      label: 'Pedido',
      icon: 'bi-cart3',
      rota: null,
      cor: '#ea580c',
      funcionalidades: ['PEDIDO'],
      filhos: [
        { label: 'Novo Pedido', icon: 'bi-plus-circle', rota: '/novo-pedido', cor: '#ea580c' },
        { label: 'Histórico de Pedidos', icon: 'bi-clock-history', rota: '/historico-vendas', cor: '#ea580c' },
        { label: 'Relatório de Pedidos', icon: 'bi-bar-chart-line', rota: '/relatorio-pedidos', cor: '#ea580c' },
      ],
    },
    {
      label: 'Cozinha',
      icon: 'bi-egg-fried',
      rota: null,
      cor: '#d97706',
      funcionalidades: ['COZINHA'],
      filhos: [
        { label: 'Fila da Cozinha', icon: 'bi-list-task', rota: '/fila', cor: '#d97706' },
        { label: 'Tela Cozinha', icon: 'bi-display', rota: '/tela-cozinha', cor: '#d97706' },
        { label: 'Relatório da Cozinha', icon: 'bi-bar-chart-line', rota: '/relatorio-cozinha', cor: '#d97706' },
      ],
    },
    {
      label: 'Delivery',
      icon: 'bi-bicycle',
      rota: null,
      cor: '#0891b2',
      perfis: ['ADMINISTRADOR'],
      funcionalidades: ['DELIVERY'],
      filhos: [
        { label: 'Dashboard', icon: 'bi-speedometer2', rota: '/delivery-dashboard', cor: '#0891b2' },
        { label: 'Relatórios', icon: 'bi-bar-chart-line', rota: '/delivery-relatorios', cor: '#0891b2' },
      ],
    },
    {
      label: 'Estoque',
      icon: 'bi-box-seam',
      rota: null,
      cor: '#16a34a',
      perfis: ['ADMINISTRADOR'],
      funcionalidades: ['ESTOQUE'],
      filhos: [
        { label: 'Itens em Estoque', icon: 'bi-boxes', rota: '/controle-estoque', cor: '#16a34a' },
        { label: 'Categorias', icon: 'bi-tags', rota: '/categorias', cor: '#16a34a' },
        { label: 'Relatório de Estoque', icon: 'bi-bar-chart-line', rota: '/relatorio-estoque', cor: '#16a34a' },
      ],
    },
    {
      label: 'Compras',
      icon: 'bi-bag-check',
      rota: null,
      cor: '#b45309',
      perfis: ['ADMINISTRADOR'],
      funcionalidades: ['COMPRAS'],
      filhos: [
        { label: 'Pedidos de Compra', icon: 'bi-cart-plus', rota: '/pedidos-compra', cor: '#b45309' },
        { label: 'Fornecedores', icon: 'bi-truck', rota: '/fornecedores', cor: '#b45309' },
      ],
    },
    {
      label: 'Financeiro',
      icon: 'bi-cash-coin',
      rota: null,
      cor: '#db2777',
      perfis: ['ADMINISTRADOR'],
      funcionalidades: ['FINANCEIRO'],
      filhos: [
        { label: 'Visão Geral', icon: 'bi-graph-up', rota: '/financeiro', cor: '#db2777' },
        { label: 'Gestão Financeira', icon: 'bi-wallet2', rota: '/gestao-financeira', cor: '#db2777' },
      ],
    },
    {
      label: 'Produtos',
      icon: 'bi-basket3',
      rota: null,
      cor: '#4f46e5',
      perfis: ['ADMINISTRADOR'],
      funcionalidades: ['PRODUTOS'],
      filhos: [
        { label: 'Catálogo', icon: 'bi-grid', rota: '/cadastro-produto', cor: '#4f46e5' },
        { label: 'Categorias', icon: 'bi-tags', rota: '/categorias', cor: '#4f46e5' },
        { label: 'Ficha Técnica', icon: 'bi-clipboard2-data', rota: '/ficha-tecnica', cor: '#4f46e5' },
        { label: 'Cardápio Digital', icon: 'bi-phone', rota: '/cardapio-admin', cor: '#4f46e5' },
      ],
    },
    {
      label: 'Clientes',
      icon: 'bi-people',
      rota: null,
      cor: '#0d9488',
      funcionalidades: ['CLIENTES'],
      filhos: [
        { label: 'Lista de Clientes', icon: 'bi-person-lines-fill', rota: '/clientes', cor: '#0d9488' },
        { label: 'Fidelidade', icon: 'bi-star', rota: '/fidelidade', cor: '#0d9488' },
        { label: 'Cupons e Cashback', icon: 'bi-ticket-perforated', rota: '/cupons-cashback', cor: '#0d9488' },
      ],
    },
    {
      label: 'Usuários',
      icon: 'bi-person-badge',
      rota: null,
      cor: '#dc2626',
      perfis: ['ADMINISTRADOR'],
      funcionalidades: ['USUARIOS'],
      filhos: [
        { label: 'Usuários', icon: 'bi-person-badge', rota: '/usuarios', cor: '#dc2626' },
        { label: 'Grupos de Acesso', icon: 'bi-shield-lock', rota: '/grupos-acesso', cor: '#dc2626' },
      ],
    },
    {
      label: 'Configurações',
      icon: 'bi-gear',
      rota: null,
      cor: '#64748b',
      perfis: ['ADMINISTRADOR'],
      funcionalidades: ['CONFIGURACOES'],
      filhos: [
        { label: 'Geral', icon: 'bi-sliders', rota: '/configuracoes-geral', cor: '#64748b' },
        { label: 'Integrações', icon: 'bi-plug', rota: '/configuracoes-integracoes', cor: '#64748b' },
      ],
    },
  ];

  private readonly itensGarcom: ItemMenu[] = [
    { label: 'Novo Pedido', icon: 'bi-plus-circle', rota: '/novo-pedido', cor: '#ea580c' },
    { label: 'Cozinha', icon: 'bi-egg-fried', rota: '/tela-cozinha', cor: '#d97706' },
  ];

  private readonly itensSuperadmin: ItemMenu[] = [
    { label: 'Dashboard', icon: 'bi-speedometer2', rota: '/superadmin-dashboard', cor: '#2563eb' },
    { label: 'Empresas', icon: 'bi-buildings', rota: '/superadmin-empresas', cor: '#7c3aed' },
    { label: 'Segmentos', icon: 'bi-diagram-3', rota: '/superadmin-segmentos', cor: '#0891b2' },
    { label: 'Usuários', icon: 'bi-person-badge', rota: '/superadmin-usuarios', cor: '#dc2626' },
    { label: 'Pagamentos', icon: 'bi-credit-card', rota: '/superadmin-pagamentos', cor: '#db2777' },
    { label: 'Financeiro', icon: 'bi-cash-coin', rota: '/superadmin-financeiro', cor: '#16a34a' },
    { label: 'Configurações', icon: 'bi-gear', rota: '/superadmin-configuracoes', cor: '#64748b' },
  ];

  get itens(): ItemMenu[] {
    const perfilAtual = this.authService.usuario()?.role;

    if (perfilAtual === 'SUPERADMIN') {
      return this.itensSuperadmin;
    }

    if (perfilAtual === 'GARCOM') {
      return this.itensGarcom;
    }

    return this.todosItens.filter((item) => {
      const perfilOk = !item.perfis || (perfilAtual && item.perfis.includes(perfilAtual));
      const funcionalidadeOk =
        !item.funcionalidades || item.funcionalidades.some((f) => this.authService.temFuncionalidade(f));
      return perfilOk && funcionalidadeOk;
    });
  }

  alternarGrupo(label: string) {
    if (this.abertos.has(label)) {
      this.abertos.delete(label);
    } else {
      this.abertos.add(label);
    }
  }

  grupoAberto(label: string): boolean {
    return this.abertos.has(label);
  }

  primeiroFilho(item: ItemMenu): string | null {
    return item.filhos?.find((f) => f.rota)?.rota ?? null;
  }
}
