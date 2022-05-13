// Angular
import { Component, Input, OnInit } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User } from '../../../../../core/auth';
import {environment} from "../../../../../../environments/environment";
import {DecodeTokenService} from "../../../../shared/decode-token.service";
import { Router} from '@angular/router';
import { APP_ROUTES , ACCESS_MANAGEMENT } from 'src/app/views/shared/AppRoutes'


@Component({
  selector: 'kt-user-profile4',
  templateUrl: './user-profile4.component.html',
})
export class UserProfile4Component implements OnInit {
  // Public properties
  user$: Observable<User>;
  user: User;


  @Input() avatar = true;
  @Input() greeting = true;
  @Input() badge: boolean;
  @Input() icon: boolean;

  /**
   * Component constructor
   *
   * @param store: Store<AppState>
   */
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private decodeService: DecodeTokenService
    ) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

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
    this.store.dispatch(new Logout());
  }

  changePassword() {
    this.router.navigate(['/' + APP_ROUTES.ACCESS_MANAGEMENT + '/' + ACCESS_MANAGEMENT.CHANGE_PASSWORD])
  }
}
