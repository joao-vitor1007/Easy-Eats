import { Adicional } from '../cadastro-produto/adicional.service';

export interface AdicionalSelecionado {
  adicional: Adicional;
  quantidade: number;
}

export interface CustomizacaoProduto {
  composicaoRemovidaIds: number[];
  adicionaisSelecionados: AdicionalSelecionado[];
  observacao: string;
}

export function customizacaoVazia(): CustomizacaoProduto {
  return { composicaoRemovidaIds: [], adicionaisSelecionados: [], observacao: '' };
}

export function mesmaCustomizacao(a: CustomizacaoProduto, b: CustomizacaoProduto): boolean {
  const chave = (c: CustomizacaoProduto) =>
    JSON.stringify({
      removidos: [...c.composicaoRemovidaIds].sort((x, y) => x - y),
      adicionais: c.adicionaisSelecionados
        .map((s) => `${s.adicional.id}:${s.quantidade}`)
        .sort(),
      observacao: c.observacao.trim(),
    });
  return chave(a) === chave(b);
}
