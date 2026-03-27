import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Cadastro } from './cadastro/cadastro';
import { ComponentFila } from './Fila/component.fila';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'cadastro',
    component: Cadastro,
  },
  {
    path: 'fila',
    component: ComponentFila,
  }
];