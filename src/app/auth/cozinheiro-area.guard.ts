import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

const ROTAS_PERMITIDAS_COZINHEIRO = ['home', 'tela-cozinha', 'fila', 'relatorio-cozinha', 'perfil-garcom'];

/**
 * Mesmo princípio do garcomAreaGuard: o Cozinheiro só deve acessar as telas
 * de cozinha, independente das funcionalidades liberadas para outros perfis
 * da mesma empresa. Aplicado como canActivateChild na rota pai do layout
 * autenticado, junto com o garcomAreaGuard.
 */
export const cozinheiroAreaGuard: CanActivateChildFn = (childRoute) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isCozinheiro()) {
    return true;
  }

  const path = childRoute.routeConfig?.path;
  if (path && ROTAS_PERMITIDAS_COZINHEIRO.includes(path)) {
    return true;
  }

  router.navigate(['/tela-cozinha']);
  return false;
};
