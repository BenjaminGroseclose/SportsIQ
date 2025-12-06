import * as Cookies from 'es-cookie';
import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = Cookies.get('access_token');

  console.log(token);
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  console.log(req);

  return next(req);
};
