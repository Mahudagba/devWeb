import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';


export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  let token = null;
  const router = inject(Router);


  try {
    
   token = localStorage.getItem('token');

  } catch (error) {
    
  }

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  // return next(authReq).pipe(
  //   catchError((error: HttpErrorResponse) => {
  //     if (error.status === 401) {
  //       localStorage.removeItem('token');
  //       router.navigate(['/login']);
  //     }
  //     return throwError(() => error);
  //   })
  // );

 return next(authReq);
};
