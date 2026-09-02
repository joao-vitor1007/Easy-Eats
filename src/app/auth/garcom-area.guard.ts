import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

const ROTAS_PERMITIDAS_GARCOM = [
  'home',
  'novo-pedido',
  'tela-cozinha',
  'perfil-garcom',
  'mesas',
  'comandas',
  'caixa',
];

/**
 * O Garçom tem acesso apenas a um pequeno conjunto de telas (pedido e
 * cozinha), independente de quais funcionalidades a empresa libera para
 * outros perfis. Aplicado como canActivateChild na rota pai do layout
 * autenticado, em vez de em cada rota filha individualmente.
 */
export const garcomAreaGuard: CanActivateChildFn = (childRoute) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isGarcom()) {
    return true;
  }

  const path = childRoute.routeConfig?.path;
  if (path && ROTAS_PERMITIDAS_GARCOM.includes(path)) {
    return true;
  }

  router.navigate(['/novo-pedido']);
  return false;
};
