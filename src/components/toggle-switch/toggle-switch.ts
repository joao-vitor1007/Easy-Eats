import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

let proximoId = 0;

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggle-switch.html',
  styleUrl: './toggle-switch.scss',
})
export class ToggleSwitchComponent {
  @Input() checked = false;
  @Input() label = '';
  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  readonly inputId = `toggle-switch-${proximoId++}`;

  alternar() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
