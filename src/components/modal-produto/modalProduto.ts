import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchComponent } from '../toggle-switch/toggle-switch';
import { Adicional, AdicionalService } from '../../app/cadastro-produto/adicional.service';
import { ComposicaoItem, ComposicaoItemService } from '../../app/cadastro-produto/composicao-item.service';
import { Produto } from '../../app/cadastro-produto/produto.service';
import { AdicionalSelecionado, CustomizacaoProduto } from '../../app/novo-pedido/carrinho.model';

const ICONE_POR_CATEGORIA: Record<string, string> = {
  Lanches: 'bi-egg-fried',
  Acompanhamentos: 'bi-basket3',
  Bebidas: 'bi-cup-straw',
};

@Component({
  selector: 'app-modal-produto',
  imports: [CommonModule, FormsModule, ToggleSwitchComponent],
  templateUrl: './modal-produto.html',
  styleUrls: ['./modal-produto.scss'],
})
export class ModalProdutoComponent implements OnChanges {
  @Input() produto: Produto | null = null;
  @Output() fechar = new EventEmitter<void>();
  @Output() adicionar = new EventEmitter<{ produto: Produto; customizacao: CustomizacaoProduto }>();

  private composicaoItemService = inject(ComposicaoItemService);
  private adicionalService = inject(AdicionalService);

  composicao: ComposicaoItem[] = [];
  adicionaisDisponiveis: Adicional[] = [];
  composicaoRemovidaIds = new Set<number>();
  adicionaisSelecionados = new Map<number, AdicionalSelecionado>();
  observacao = '';
  carregandoDetalhes = false;

  get iconeProduto(): string {
    const nomeCategoria = this.produto?.categoria?.nome;
    return (nomeCategoria && ICONE_POR_CATEGORIA[nomeCategoria]) || 'bi-basket3';
  }

  get ehPreparado(): boolean {
    return this.produto?.natureza === 'PREPARADO';
  }

  get totalAdicionais(): number {
    let total = 0;
    for (const selecionado of this.adicionaisSelecionados.values()) {
      total += selecionado.adicional.preco * selecionado.quantidade;
    }
    return total;
  }

  get precoTotal(): number {
    return (this.produto?.preco ?? 0) + this.totalAdicionais;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['produto']) {
      this.resetarCustomizacao();
      if (this.produto && this.ehPreparado) {
        this.carregarComposicaoEAdicionais(this.produto.id);
      }
    }
  }

  private resetarCustomizacao() {
    this.composicao = [];
    this.adicionaisDisponiveis = [];
    this.composicaoRemovidaIds = new Set();
    this.adicionaisSelecionados = new Map();
    this.observacao = '';
  }

  private carregarComposicaoEAdicionais(produtoId: number) {
    this.carregandoDetalhes = true;
    this.composicaoItemService.listar(produtoId).subscribe({
      next: (itens) => {
        this.composicao = itens;
        this.carregandoDetalhes = false;
      },
      error: () => (this.carregandoDetalhes = false),
    });
    this.adicionalService.listar(produtoId).subscribe({
      next: (adicionais) => (this.adicionaisDisponiveis = adicionais),
    });
  }

  estaMantido(item: ComposicaoItem): boolean {
    return !this.composicaoRemovidaIds.has(item.id);
  }

  alternarComposicao(item: ComposicaoItem, manter: boolean) {
    if (manter) {
      this.composicaoRemovidaIds.delete(item.id);
    } else {
      this.composicaoRemovidaIds.add(item.id);
    }
  }

  estaSelecionado(adicional: Adicional): boolean {
    return this.adicionaisSelecionados.has(adicional.id);
  }

  alternarAdicional(adicional: Adicional, selecionado: boolean) {
    if (selecionado) {
      this.adicionaisSelecionados.set(adicional.id, { adicional, quantidade: 1 });
    } else {
      this.adicionaisSelecionados.delete(adicional.id);
    }
  }

  fecharModal() {
    this.fechar.emit();
  }

  adicionarProduto() {
    if (!this.produto) return;

    this.adicionar.emit({
      produto: this.produto,
      customizacao: {
        composicaoRemovidaIds: [...this.composicaoRemovidaIds],
        adicionaisSelecionados: [...this.adicionaisSelecionados.values()],
        observacao: this.observacao.trim(),
      },
    });
    this.fecharModal();
  }
}
