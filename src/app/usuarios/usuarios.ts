import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CampoSenhaComponent } from '../../components/campo-senha/campo-senha';
import { CampoTextoComponent } from '../../components/campo-texto/campo-texto';
import { CarregandoComponent } from '../../components/carregando/carregando';
import { MensagemErroApiUtil } from '../utils/mensagemErroApiUtil';
import { Perfil } from '../auth/auth.service';
import { Usuario, UsuarioService } from './usuario.service';

interface OpcaoPerfil {
  valor: Perfil;
  label: string;
  descricao: string;
  icone: string;
}

const OPCOES_PERFIL: OpcaoPerfil[] = [
  { valor: 'ADMINISTRADOR', label: 'Administrador', descricao: 'Acesso completo ao sistema', icone: 'bi-shield-check' },
  { valor: 'OPERADOR', label: 'Operador', descricao: 'Opera o caixa e o balcão', icone: 'bi-person-badge' },
  { valor: 'GARCOM', label: 'Garçom', descricao: 'Atende as mesas e lança os pedidos', icone: 'bi-cup-straw' },
  { valor: 'COZINHEIRO', label: 'Cozinheiro', descricao: 'Prepara os pedidos na cozinha', icone: 'bi-egg-fried' },
];

function semApenasEspacos(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string | null;
  if (!valor) return null;
  return valor.trim().length > 0 ? null : { somenteEspacos: true };
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CampoSenhaComponent, CampoTextoComponent, CarregandoComponent],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class Usuarios implements OnInit {
  opcoesPerfil = OPCOES_PERFIL;

  usuarios: Usuario[] = [];
  carregando = true;
  enviando = false;
  erro: string | null = null;
  sucesso = false;

  form = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required, semApenasEspacos] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    senha: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    role: new FormControl<Perfil>('OPERADOR', { nonNullable: true, validators: Validators.required }),
  });

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.carregarUsuarios();
  }

  private carregarUsuarios() {
    this.carregando = true;
    this.usuarioService.listar().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os usuários cadastrados.';
        this.carregando = false;
      },
    });
  }

  selecionarPerfil(perfil: Perfil) {
    this.form.controls.role.setValue(perfil);
  }

  labelPerfil(role: Perfil): string {
    return this.opcoesPerfil.find((opcao) => opcao.valor === role)?.label ?? role;
  }

  adicionar() {
    if (this.form.invalid || this.enviando) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    this.enviando = true;
    this.erro = null;

    this.usuarioService
      .criar({
        nome: valores.nome.trim(),
        email: valores.email.trim(),
        senha: valores.senha,
        role: valores.role,
        flAtivo: true,
      })
      .subscribe({
        next: (usuarioCriado) => {
          this.enviando = false;
          this.usuarios = [usuarioCriado, ...this.usuarios];
          this.sucesso = true;
          this.form.reset({ role: 'OPERADOR' });
          setTimeout(() => (this.sucesso = false), 4000);
        },
        error: (erro) => {
          this.enviando = false;
          this.erro = MensagemErroApiUtil.extrair(
            erro,
            'Não foi possível cadastrar o usuário. Verifique os dados e tente novamente.',
          );
        },
      });
  }
}
