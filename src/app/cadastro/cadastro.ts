import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormatarCPFUtil } from '../utils/formatarCpfUtil';
import { FormatarTelefoneUtil } from '../utils/formatarTelefoneUtil';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.scss'],
})
export class Cadastro implements OnInit {
  showPassword: boolean = false;
  showPasswordDown: boolean = false;
  currentYear: number = new Date().getFullYear();

  private fb = inject(FormBuilder);

  form = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required, Validators.minLength(10)]],
    cpf: ['', [Validators.required, Validators.minLength(11)]],
    senha: ['', [Validators.required, Validators.minLength(8)]],
    confirmarSenha: ['', Validators.required],
  });

  mensagensValidacoes = {
    nome: {
      required: 'Nome é obrigatório.',
    },
    email: {
      required: 'Email é obrigatório.',
      email: 'Email inválido.',
    },
    telefone: {
      required: 'Telefone é obrigatório.',
      minlength: 'Telefone inválido.',
    },
    cpf: {
      required: 'CPF é obrigatório.',
      minlength: 'CPF inválido.',
    },
    senha: {
      required: 'Senha obrigatória.',
      minlength: 'Mínimo 8 caracteres.',
    },
    confirmarSenha: {
      required: 'Confirmação obrigatória.',
    },
  };

  ngOnInit() {
    this.form.get('cpf')?.valueChanges.subscribe((cpf) => {
      if (!cpf) return;
      const formatado = FormatarCPFUtil.formatar(cpf);
      if (cpf !== formatado) {
        this.form.get('cpf')?.setValue(formatado, { emitEvent: false });
      }
    });

    this.form.get('telefone')?.valueChanges.subscribe((tel) => {
      if (!tel) return;
      const formatado = FormatarTelefoneUtil.formatar(tel);
      if (tel !== formatado) {
        this.form.get('telefone')?.setValue(formatado, { emitEvent: false });
      }
    });
  }

  constructor(private router: Router) {}

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('Dados de Cadastro:', this.form.value);

    this.acessarRota('/dashboard');
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordDown() {
    this.showPasswordDown = !this.showPasswordDown;
  }

  protected acessarRota(rota: string) {
    this.router.navigate([rota]);
  }
}
