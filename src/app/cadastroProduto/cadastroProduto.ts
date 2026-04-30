import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Navbar } from '../../components/navbar';

@Component({
  selector: 'app-cadastro-produto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Navbar],
  templateUrl: './cadastroProduto.html',
  styleUrls: ['./cadastroProduto.scss'],
})
export class CadastroProdutoComponent {
  currentYear = new Date().getFullYear();

  form = new FormGroup({
    nome: new FormControl('', Validators.required),
    categoria: new FormControl('', Validators.required),
    preco: new FormControl('', Validators.required),
    estoque: new FormControl('', Validators.required),
  });

  salvar() {
    if (this.form.valid) {
      console.log('Dados do produto:', this.form.value);
      alert('Produto salvo com sucesso!');
    } else {
      alert('Preencha todos os campos corretamente!');
    }
  }
}
