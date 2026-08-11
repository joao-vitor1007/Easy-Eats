import { Component, Input } from '@angular/core';

/**
 * Indicador de carregamento padrão, usado no lugar de cada tela escrever
 * seu próprio "Carregando..." em texto simples.
 */
@Component({
  selector: 'app-carregando',
  standalone: true,
  templateUrl: './carregando.html',
  styleUrl: './carregando.scss',
})
export class CarregandoComponent {
  @Input() texto = 'Carregando...';
}
