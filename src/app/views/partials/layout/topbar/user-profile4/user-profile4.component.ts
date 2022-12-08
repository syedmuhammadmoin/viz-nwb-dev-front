// Angular
import { Component, Injector, OnInit , ChangeDetectorRef } from '@angular/core';
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
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';


@Component({
  selector: 'kt-user-profile4',
  templateUrl: './user-profile4.component.html',
})
export class UserProfile4Component extends AppComponentBase implements OnInit {
   
  user$: Observable<User>;
  user: User;
  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;
  edinfinitheming : any = '';
  sbbutheming : any = '';
  vizalystheming : any = '';
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
    injector: Injector,
    public dynamicColorChanging : DynamicColorChangeService,
    private ref: ChangeDetectorRef,
  ) {
      super(injector)
  }

  /**
   * On init
   */
  ngOnInit(): void {
    this.user = this.decodeService.setUser(this.decodeService.decode(localStorage.getItem(environment.authTokenKey)));
    // this.user$ = this.store.pipe(select(currentUser));

    this.dynamicColorChanging.global_color.subscribe(( res : any) => {
      
      if(localStorage.getItem('global_color')) {
       this.localsto = JSON.parse(localStorage.getItem('global_color'))
       this.edinfini = this.localsto.edinfini_true;
       this.sbbu = this.localsto.nawabshah_true;
       this.vizalys = this.localsto.vizalys_true;
        console.log("yes Called")
      } 
      else{
       this.localsto = res;
       this.edinfini = this.localsto.edinfini_true;
       this.sbbu = this.localsto.nawabshah_true;
       this.vizalys = this.localsto.vizalys_true;
      }

      this.ref.detectChanges()
    })
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

  changeColor(name: string){

    if(name === 'sbbu') {

      console.log('sbbu')

      this.sbbutheming = {
        bg_gradient_color_one : "#1a6b85",
        bg_gradient_color_two : '#4a8a9e',
        bg_white :'#ffffff',
        primary_color :'#1a6b85',
        secondary_color :'#cba058',
        input_filed_primary_color :'#808080',
        input_filed_background_color :'#f2f2f2',
        input_filed_border_color :'#d0d0d0',
        form_border_color :'#aad7e6',
        test_shadow_color :'#9195a9',
        button_background_color :'#e9f5f9',
        light_gray_color :'#B5B5C3',
        toggler_arrow_color :'#1a6b85',
        home_logo_bg :'#fff',
        db_dd_t_c :'#fff',
        title :'SBBU',
        login_title :'Main Campus SBBU Shaheed benazirabad.',
        login_cover_image :"url('assets/media/logos/bg_login.jpg')",
        site_logo :"url('assets/media/logos/logo-wr.png')",
        dashboard_hight :'90px',
        dashboard_logo_width :'70px',
        dashboard_logo_hight :'70px',
        chart_color : ['#1a6b85', '#1a6b85', '#5390a3', '#5390a3'],
        site_title : 'SBBU',
        fav_icon : 'assets/media/logos/logo-wr.png',
        edinfini_true :false,
        nawabshah_true :true,
        vizalys_true :false,
      }

      localStorage.setItem('global_color', JSON.stringify(this.sbbutheming))
      this.dynamicColorChanging.global_color.next(this.sbbutheming)
      
    }

    else if(name === 'edinfini'){

      this.edinfinitheming = {
        bg_gradient_color_one : "rgba(0, 0, 0, 0.6)",
        bg_gradient_color_two : '#65c18c',
        bg_white :'#ffffff',
        primary_color :'#65c18c',
        secondary_color :'#141e27',
        input_filed_primary_color :'#808080',
        input_filed_background_color :'#f2f2f2',
        input_filed_border_color :'#d0d0d0',
        form_border_color :'rgba(101, 193, 140, 0.1)',
        test_shadow_color :'#9195a9',
        button_background_color :'rgba(101, 193, 140, 0.1)',
        light_gray_color :'#B5B5C3',
        toggler_arrow_color :'#65c18c',
        home_logo_bg :'#fff',
        db_dd_t_c :'#fff',
        title :'',
        login_title :'',
        login_cover_image :"url('assets/media/logos/edinfini-login-image.jpg')",
        site_logo :"url('assets/media/logos/LOGO-EDINFINI-HEADER.png')",
        dashboard_hight :'65px',
        dashboard_logo_width :'110px',
        dashboard_logo_hight :'80px',
        chart_color : ['#65c18c', '#65c18c', '#69a381', '#69a381'],
        site_title : 'EDINFINI',
        fav_icon : 'assets/media/logos/EDINFINI-FAV-ICON.png',
        edinfini_true :true,
        nawabshah_true :false,
        vizalys_true :false,
      }

      localStorage.setItem('global_color', JSON.stringify(this.edinfinitheming))
      this.dynamicColorChanging.global_color.next(this.edinfinitheming)

    }

    else if(name === 'sbbu') {

      console.log('sbbu')

      this.sbbutheming = {
        bg_gradient_color_one : "#1a6b85",
        bg_gradient_color_two : '#4a8a9e',
        bg_white :'#ffffff',
        primary_color :'#1a6b85',
        secondary_color :'#cba058',
        input_filed_primary_color :'#808080',
        input_filed_background_color :'#f2f2f2',
        input_filed_border_color :'#d0d0d0',
        form_border_color :'#aad7e6',
        test_shadow_color :'#9195a9',
        button_background_color :'#e9f5f9',
        light_gray_color :'#B5B5C3',
        toggler_arrow_color : '#1a6b85',
        db_dd_t_c : '#fff',
        home_logo_bg : '#fff',
        title :'SBBU',
        login_title :'Main Campus SBBU Shaheed benazirabad.',
        login_cover_image :"url('assets/media/logos/bg_login.jpg')",
        site_logo :"url('assets/media/logos/logo-wr.png')",
        dashboard_hight :'90px',
        dashboard_logo_width :'70px',
        dashboard_logo_hight :'70px',
        chart_color : ['#1a6b85', '#1a6b85', '#5390a3', '#5390a3'],
        site_title : 'SBBU',
        fav_icon : 'assets/media/logos/logo-wr.png',
        edinfini_true :false,
        nawabshah_true :true,
        vizalys_true :false,
      }

      localStorage.setItem('global_color', JSON.stringify(this.sbbutheming))
      this.dynamicColorChanging.global_color.next(this.sbbutheming)
      
    }

    else if(name === 'vizalys') {

      console.log('vizalys')

      this.vizalystheming = {
        bg_gradient_color_one : "#2988bc",
        bg_gradient_color_two : '#2988bc',
        bg_white :'#ffffff',
        primary_color :'#2988bc',
        secondary_color :'#fff',
        input_filed_primary_color :'#808080',
        input_filed_background_color :'#f2f2f2',
        input_filed_border_color :'#d0d0d0',
        form_border_color :'#aad7e6',
        test_shadow_color :'#9195a9',
        button_background_color :'#e4edf3',
        light_gray_color :'#B5B5C3',
        toggler_arrow_color : '#fff',
        home_logo_bg : '#2988bc',
        db_dd_t_c : '#2988bc',
        title :'',
        login_title :'Main Campus SBBU Shaheed benazirabad.',
        login_cover_image :"url('assets/media/logos/vizalys-login.jpg')",
        site_logo :"url('assets/media/logos/vizalys-logo.png')",
        dashboard_hight :'65px',
        dashboard_logo_width :'175px',
        dashboard_logo_hight :'40px',
        chart_color : ['#1a6b85', '#1a6b85', '#5390a3', '#5390a3'],
        site_title : 'Vizalys',
        fav_icon : 'assets/media/logos/vizalys-favicon.png',
        edinfini_true :false,
        nawabshah_true :false,
        vizalys_true :true,
      }

      localStorage.setItem('global_color', JSON.stringify(this.vizalystheming))
      this.dynamicColorChanging.global_color.next(this.vizalystheming)
      


      // localStorage.setItem('light_gray_color' ,'#B5B5C3')
      // this.dynamicColorChanging.light_gray_color.next('#B5B5C3')

      // localStorage.setItem('input_filed_background_color' ,'#f2f2f2')
      // this.dynamicColorChanging.input_filed_background_color.next('#f2f2f2')

      // localStorage.setItem('secondary_color' ,'#cba058')
      // this.dynamicColorChanging.secondary_color.next('#cba058')

      // localStorage.setItem('login_cover_image' ,"url('assets/media/logos/bg_login.jpg')")
      // this.dynamicColorChanging.login_cover_image.next("url('assets/media/logos/bg_login.jpg')")

      // localStorage.setItem('form_border_color' ,'#aad7e6')
      // this.dynamicColorChanging.form_border_color.next('#aad7e6')

      // localStorage.setItem('bg_gradient_color_one' ,'#1a6b85')
      // this.dynamicColorChanging.bg_gradient_color_one.next('#1a6b85')

      // localStorage.setItem('bg_gradient_color_two' ,'#4a8a9e')
      // this.dynamicColorChanging.bg_gradient_color_two.next('#4a8a9e')

      // localStorage.setItem('title' ,'SBBU')
      // this.dynamicColorChanging.title.next('SBBU')

      // localStorage.setItem('login_title' ,'Main Campus SBBU Shaheed benazirabad.')
      // this.dynamicColorChanging.login_title.next('Main Campus SBBU Shaheed benazirabad.')

      // localStorage.setItem('input_filed_border_color' ,'#d0d0d0')
      // this.dynamicColorChanging.input_filed_border_color.next('#d0d0d0')

      // localStorage.setItem('test_shadow_color' ,'#9195a9')
      // this.dynamicColorChanging.test_shadow_color.next('#9195a9')

      // localStorage.setItem('button_background_color' ,'#e9f5f9')
      // this.dynamicColorChanging.button_background_color.next('#e9f5f9')

      // localStorage.setItem('site_logo' ,"url('assets/media/logos/logo-wr.png')")
      // this.dynamicColorChanging.site_logo.next("url('assets/media/logos/logo-wr.png')")

      // localStorage.setItem('bg_white' ,'#ffffff')
      // this.dynamicColorChanging.bg_white.next('#ffffff')

      // localStorage.setItem('primary_color' ,'#1a6b85')
      // this.dynamicColorChanging.primary_color.next('#1a6b85')

      // localStorage.setItem('input_filed_primary_color' ,'#808080')
      // this.dynamicColorChanging.input_filed_primary_color.next('#808080')

      // localStorage.setItem('dashboard_hight' ,'90px')
      // this.dynamicColorChanging.dashboard_hight.next('90px')

      // localStorage.setItem('dashboard_logo_width' ,'70px')
      // this.dynamicColorChanging.dashboard_logo_width.next('70px')
      
      // localStorage.setItem('dashboard_logo_hight' ,'70px')
      // this.dynamicColorChanging.dashboard_logo_hight.next('70px')
    }
 
    }

  
}



