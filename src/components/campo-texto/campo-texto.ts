import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let proximoId = 0;

/**
 * Campo de texto genérico reutilizável (com ícone opcional à esquerda),
 * mesmo padrão do app-campo-senha. Reduz a repetição de
 * <div class="campo"><label>...<input>...</div> presente em quase toda
 * tela com formulário.
 */
@Component({
  selector: 'app-campo-texto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campo-texto.html',
  styleUrl: './campo-texto.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CampoTextoComponent),
      multi: true,
    },
  ],
})
export class CampoTextoComponent implements ControlValueAccessor {
  @Input() type: 'text' | 'email' | 'tel' | 'number' = 'text';
  @Input() placeholder = '';
  @Input() icone: string | null = null;
  @Input() autocomplete: string | null = null;

  readonly inputId = `campo-texto-${proximoId++}`;
  valor: string = '';
  desabilitado = false;

  private onChange: (valor: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(valor: string): void {
    this.valor = valor ?? '';
  }

  registerOnChange(fn: (valor: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(desabilitado: boolean): void {
    this.desabilitado = desabilitado;
  }

  aoDigitar(valor: string) {
    this.valor = valor;
    this.onChange(valor);
  }

  aoTocar() {
    this.onTouched();
  }
}
