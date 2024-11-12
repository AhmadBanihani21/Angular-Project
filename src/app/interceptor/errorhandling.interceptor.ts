import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorhandlingInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    debugger;
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.log('Error status:', error);
        switch (error.status) {
          case 404:
            this.router.navigate(['/Home/error404']);
            break;
          case 403:
            this.router.navigate(['/Home/error403']);
            break;
          case 400:
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error[0].code,
            });
            break;
          default:
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error,
            });
            break;
        }
        return throwError('error123');
      })
    );
  }
}
