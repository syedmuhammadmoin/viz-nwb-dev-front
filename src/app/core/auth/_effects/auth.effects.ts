// Angular
import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// RxJS
import { tap } from 'rxjs/operators';
// NGRX
import { Actions, createEffect, ofType } from '@ngrx/effects';
// Auth actions
import { AuthActionTypes } from '../_actions/auth.actions';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AuthEffects {

  login$ = createEffect(() => 
    inject(Actions).pipe( 
      ofType(AuthActionTypes.Login),
      tap((action: any) => {
        localStorage.setItem(environment.authTokenKey, action.payload.authToken);
      }),
    ),
    { dispatch: false }
  );
  
  logout$ = createEffect(() => 
    inject(Actions).pipe( 
      ofType(AuthActionTypes.Logout),
      tap(() => {
        localStorage.removeItem(environment.authTokenKey);
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.returnUrl } });
        window.location.reload(); // Use window.location.reload() for consistency
      }),
    ),
    { dispatch: false }
  );

  // @Effect({ dispatch: false })
  // register$ = this.actions$.pipe(
  //   ofType<Register>(AuthActionTypes.Register),
  //   tap(action => {
  //     localStorage.setItem(environment.authTokenKey, action.payload.authToken);
  //   })
  // );

  // @Effect({ dispatch: false })
  // loadUser$ = this.actions$
  //   .pipe(
  //     ofType<UserRequested>(AuthActionTypes.UserRequested),
  //     withLatestFrom(this.store.pipe(select(isUserLoaded))),
  //     filter(([action, _isUserLoaded]) => !_isUserLoaded),
  //     mergeMap(([action, _isUserLoaded]) => this.auth.getUserByToken()),
  //     tap(_user => {
  //       if (_user) {
  //         // console.log('effect Load User', _user);
  //         this.store.dispatch(new UserLoaded({ user: _user }));
  //       } else {
  //         this.store.dispatch(new Logout());
  //       }
  //     })
  //   );

  // @Effect()
  // init$: Observable<Action> = defer(() => {
  //   const userToken = localStorage.getItem(environment.authTokenKey);
  //   const decodedToken = this.decodeTokenService.decode(userToken);
  //   let observableResult = of({ type: 'NO_ACTION' });
  //   if (decodedToken) {
  //     observableResult = of(new Login({ authToken: userToken }));
  //   }
  //   return observableResult;
  // });

  private returnUrl: string;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.returnUrl = event.url;
      }
    });
  }
}