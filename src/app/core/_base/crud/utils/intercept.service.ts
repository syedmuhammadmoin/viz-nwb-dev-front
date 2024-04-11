// Angular
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {environment} from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class InterceptService implements HttpInterceptor {

  router: Router;

  constructor(private toastService: ToastrService, private route : Router) { }
  // intercept request and add token
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // modify request
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem(environment.authTokenKey)}`
      }
    });

    return next.handle(request).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) { }
          if (event instanceof HttpResponse) {
            // Do something with successful response (optional)
          } else if (event instanceof HttpErrorResponse) {
            let message = 'Something went wrong, Please try again later.'
          let title = 'Internal Server Error';
          switch (event?.error.status) {
            case 400:
              message = event?.error?.message ?? 'Please verify form fields are correct, if issue presists please contact System Administrator'
              title = 'Bad Request'
              break;
            case 401:
              message = event?.error?.message ?? 'Unauhtorised access, Please login again.'
              title = 'Unauthorised'
              this.route.navigateByUrl('/login')
              break;
            case 403:
              message = event?.error?.message ?? 'You don\'\t have permission to access this resource'
              title = 'Forbidden'
              this.route.navigateByUrl('/error/unauthorized')
              break;
            case 404:
              message = event?.error?.message ?? 'Requested resource not found.'
              title = 'Resource Not Found'
              break;
            case 408:
              message = event?.error?.message ?? 'Requested resource timed out.'
              title = 'Request Timeout'
              break;
            case 500:
              message = event?.error?.message ?? 'Something went wrong, Please try again later.'
              title = 'Internal Server Error'
              this.route.navigateByUrl('/error/500')
              break;
            default:
              message = event?.error?.message ?? 'Please try again later, If issue presists please contact System Administrator';
              title = 'General Processing Error'
              break;
          }

          this.toastService.error(message, title);
          }
        }
      )
    );
  }
}
