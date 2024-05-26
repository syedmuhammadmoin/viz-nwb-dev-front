// Angular
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
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

  constructor(private toastService: ToastrService, injector: Injector , private route : Router) { }
  // intercept request and add token
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // tslint:disable-next-line:no-debugger
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
        },
        error => {
          let message = 'Something went wrong, Please try again later.'
          let title = 'Internal Server Error';
          switch (error.status) {
            case 400:
              //This was the code before showing exact domain fields
             // message = error?.errors?.message ?? 'Please verify form fields are correct, if issue presists please contact System Administrator'
            message = error.error.errors.map((error: any) => {             
              return `${error.error}\n`;
            });
             console.log("Checking 400 Error", message);
              
              title = 'Bad Request'
              break;
            case 401:
              message = error?.error?.message ?? 'Unauhtorised access, Please login again.'
              title = 'Unauthorised'
              //window.location.href = '/login'
              this.route.navigateByUrl('/login')
              break;
            case 403:
              message = error?.error?.message ?? 'You don\'\t have permission to access this resource'
              title = 'Forbidden'
              //window.location.href = '/error/unauthorized'
              this.route.navigateByUrl('/error/unauthorized')
              break;
            case 404:
              message = error?.error?.message ?? 'Requested resource not found.'
              title = 'Resource Not Found'
             // window.location.href = '/error/404'
              //this.route.navigateByUrl('/error/404')
              break;
            case 408:
              message = error?.error?.message ?? 'Requested resource timed out.'
              title = 'Request Timeout'
              break;
            case 500:
              message = error?.error?.message ?? 'Something went wrong, Please try again later.'
              title = 'Internal Server Error'
              this.route.navigateByUrl('/error/500')
              break;
            default:
              message = error?.error?.message ?? 'Please try again later, If issue presists please contact System Administrator';
              title = 'General Processing Error'
              break;
          }
          this.toastService.error(`${message}\n  ${title}`);
          // http response status code
          // console.log('----response----');
          // console.error('status code:');
          // tslint:disable-next-line:no-debugger
          console.error(error.status);
          console.error(error.message);
          // console.log('--- end of response---');
        }
      )
    );
  }
}
