import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para o *ngIf no HTML
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class Login implements OnInit {
  showPassword: boolean = false;
  currentYear: number = new Date().getFullYear();

  private fb = inject(FormBuilder);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  mensagensValidacoes = {
    email: {
      required: 'Email é obrigatório.',
      email: 'Email inválido.',
    },
    password: {
      required: 'Senha obrigatória.',
    },
  };

  constructor() {}

  ngOnInit(): void {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  handleLogin() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('Dados de Login:', this.form.value);

    this.acessarRota('/dashboard');
  }

  protected acessarRota(rota: string) {
    this.router.navigate([rota]);
  }
}
