// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// RxJS
import { AuthSingletonService } from 'src/app/views/pages/auth/service/auth-singleton.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    // private store: Store<AppState>,
    private authSingleton: AuthSingletonService,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = this.authSingleton.isLoggedIn();
    console.log(isLoggedIn);
    
    if (!isLoggedIn && state.url === '/auth/login') {
      console.log('very First If');
      return true;
    }

    if (!isLoggedIn) {
      this.router.navigateByUrl('/auth/login');
      console.log('second IF');
      return false
    }

    if (state.url === '/auth/login' && isLoggedIn) {
      console.log('Third If');
      this.router.navigate(['/dashboard']);
      return false;
    }
    // this.router.navigate([this.selectBestRoute()])
    return true
    // this.store
    //   .pipe(
    //     select(isLoggedIn),
    //     tap(loggedIn => {
    //       if (!loggedIn) {
    //         this.router.navigateByUrl('/auth/login');
    //       }
    //     })
    //   );
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }
  selectBestRoute(): string {
    console.log('bestRoute')
    if (!this.authSingleton.getCurrentUser()) {
      console.log('best route if');
      return '/auth/login';
    }
    return '/dashboard';
  }
}
