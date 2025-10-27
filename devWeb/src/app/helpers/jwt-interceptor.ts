import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  let token: string | null = null;

  // Vérifie si on est bien dans le navigateur
  if (isPlatformBrowser(platformId)) {
    try {
      token = sessionStorage.getItem('token');
    } catch (error) {
      console.log('JWT Interceptor - erreur d’accès au sessionStorage:', error);
    }
  } else {
    console.log('JWT Interceptor - rendu serveur détecté, pas de sessionStorage');
  }

  // Clone la requête avec le header Authorization si token dispo
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${JSON.parse(token)}` },
    });
  }

  console.log('JWT Interceptor - Request:', authReq);

  // Gestion d’erreurs (401 redirige vers /login)
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => { 
      console.error('Erreur HTTP détectée:', error);

      if (error.status === 401 && isPlatformBrowser(platformId)) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
