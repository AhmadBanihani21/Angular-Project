import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authToken = localStorage.getItem('SecurityKey');
    if (authToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` },
      });
    }
    return next.handle(request);
  }
}
