// Angular
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
// RxJS
import { lastValueFrom, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/views/pages/auth/service/authentication.service';
import { isLoggedOut } from 'src/app/core/auth';

/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class InterceptService implements HttpInterceptor {

  router: Router;

  constructor(private toastService: ToastrService,private authService : AuthenticationService,injector: Injector, private route: Router) { }
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
          if (event instanceof HttpResponse) {
          }
        },
        error => {
          let message = 'Something went wrong, Please try again later.'
          let title = 'Internal Server Error';
          switch (error.status) {
            case 400:
              title = 'Bad Request';

              // Check for nested error object or array of errors
              if (error?.error?.errors && Array.isArray(error.error.errors)) {
                message = error.error.errors.map((err: any) => {
                  return `${err.error ?? 'Unknown error'}\n`;
                }).join('');
              } else if (error?.error?.message) {
                // Fallback to single message if errors array is not present
                message = error.error.message;
              } else {
                message = 'Please verify form fields are correct. If the issue persists, contact the System Administrator.';
              }
              break;
            case 401:
              localStorage.clear();
              message = error?.error?.message ?? 'Unauhtorised access, Please login again.'
              title = 'Unauthorised'
            lastValueFrom(  this.authService.signOut()).then(res => {
              console.log('lastValueFrom>then');
              if(isLoggedOut){                
                this.route.navigateByUrl('/auth/login')             
              }else{              
                  this.toastService.error('Something went wrong, we\'re\ working on it. We will notify you when it\'s\ done', 'Error')   ;             
              }
            })
              //window.location.href = '/login'
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
              message = error?.error?.message ?? 'Something went wrong'+ error?.error?.traceId
              title = 'Internal Server Error'
              // this.route.navigateByUrl('/error/500')
              break;
            default:
              message = error?.error?.message ?? 'Check your internet connection or ensure the server is online. If the problem persists, please try again later or contact support.';
              title = 'General Processing Error'
              break;
          }
          this.toastService.error(`${message}<br>${title}`, '', {
            enableHtml: true
          });
        }
      )
    );
  }
}
