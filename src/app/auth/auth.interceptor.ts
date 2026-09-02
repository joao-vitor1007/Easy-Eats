import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

// Rotas do link público (cardápio do cliente final, checkout, callback do
// Stripe) não usam sessão de funcionário — não faz sentido anexar um token
// (possivelmente inválido/expirado) nem redirecionar para /login em caso de
// erro, já que quem está ali é o cliente, não um usuário do sistema.
const isRotaPublica = (url: string) => url.includes('/public/');

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (isRotaPublica(req.url)) {
    return next(req);
  }

  const token = authService.getToken();

  const requisicao = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(requisicao).pipe(
    catchError((erro) => {
      if (erro.status === 401 || erro.status === 403) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => erro);
    }),
  );
};
