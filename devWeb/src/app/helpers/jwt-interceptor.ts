import { HttpInterceptorFn } from '@angular/common/http';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
