// Angular
import { Component, Injector, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
// Layout
import { OffcanvasOptions } from '../../../../../core/_base/layout';
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User } from '../../../../../core/auth';
import {DecodeTokenService} from '../../../../shared/decode-token.service';
import { environment } from '../../../../../../environments/environment';
import {AuthenticationService} from 'src/app/views/pages/auth/service/authentication.service';
import { Router } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ACCESS_MANAGEMENT, APP_ROUTES } from 'src/app/views/shared/AppRoutes';


@Component({
  selector: 'kt-user-profile4',
  templateUrl: './user-profile4.component.html',
})
export class UserProfile4Component extends AppComponentBase implements OnInit {
   
  user$: Observable<User>;
  user: User;
  // Public properties
  offcanvasOptions: OffcanvasOptions = {
    overlay: true,
    baseClass: 'offcanvas',
    placement: 'right',
    closeBy: 'kt_quick_user_close',
    toggleBy: 'kt_quick_user_toggle'
  };

  constructor(
   
    private decodeService: DecodeTokenService,
    private authService: AuthenticationService,
    public router: Router,
    injector: Injector
  ) {
      super(injector)
  }

  /**
   * On init
   */
  ngOnInit(): void {
    this.user = this.decodeService.setUser(this.decodeService.decode(localStorage.getItem(environment.authTokenKey)));
    // this.user$ = this.store.pipe(select(currentUser));
  }

  /**
   * Log out
   */
  logout() {
    this.authService.signOut().subscribe((isLoggedOut) => {
      if (isLoggedOut) {
        this.router.navigate(['/auth/login']);
      } else {
        this.toastService.error('Something went wrong, we\'re\ working on it. We will notify you when it\'s\ done', 'Error')
      }
    })
   // this.store.dispatch(new Logout());
  }

  changePassword() {
   // console.log(this.router)
    this.router.navigate(['/' + APP_ROUTES.ACCESS_MANAGEMENT + '/' + ACCESS_MANAGEMENT.CHANGE_PASSWORD])
  }


  // // Public properties
  // user$: Observable<User>;
  // user: User;


  // @Input() avatar = true;
  // @Input() greeting = true;
  // @Input() badge: boolean;
  // @Input() icon: boolean;

  // /**
  //  * Component constructor
  //  *
  //  * @param store: Store<AppState>
  //  */
  // constructor(
  //   private store: Store<AppState>,
  //   private router: Router,
  //   private decodeService: DecodeTokenService
  //   ) {
  // }

  // /**
  //  * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
  //  */

  // /**
  //  * On init
  //  */
  // ngOnInit(): void {
  //   this.user = this.decodeService.setUser(this.decodeService.decode(localStorage.getItem(environment.authTokenKey)));
  //   // this.user$ = this.store.pipe(select(currentUser));
  // }

  // /**
  //  * Log out
  //  */
  // logout() {
  //   this.store.dispatch(new Logout());
  // }

  // changePassword() {
  //   this.router.navigate(['/' + APP_ROUTES.ACCESS_MANAGEMENT + '/' + ACCESS_MANAGEMENT.CHANGE_PASSWORD])
  // }
}



