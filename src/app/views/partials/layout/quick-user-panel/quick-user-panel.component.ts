// Angular
import { Component, Injector, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
// Layout
import { OffcanvasOptions } from '../../../../core/_base/layout';
import { AppState } from '../../../../core/reducers';
import { currentUser, Logout, User } from '../../../../core/auth';
import { DecodeTokenService} from '../../../shared/decode-token.service';
import { environment } from '../../../../../environments/environment';
import { AuthenticationService} from 'src/app/views/pages/auth/service/authentication.service';
import { Router } from '@angular/router';
import { ACCESS_MANAGEMENT, APP_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kt-quick-user-panel',
  templateUrl: './quick-user-panel.component.html',
  styleUrls: ['./quick-user-panel.component.scss']
})
export class QuickUserPanelComponent implements OnInit {
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
    private toastService: ToastrService,
    public router: Router
  ) { }

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
}
