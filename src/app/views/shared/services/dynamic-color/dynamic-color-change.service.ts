import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicColorChangeService {



  public global_color : BehaviorSubject<{}> = new BehaviorSubject<{}> ({
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
    home_logo_bg :'fff',
    db_dd_t_c :'fff',
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
  })

  // public edinfini : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  // edinfini$ : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

    // public bg_gradient_color_one : BehaviorSubject<any> = new BehaviorSubject<any>("rgba(0, 0, 0, 0.6)")
    // public bg_gradient_color_two : BehaviorSubject<any> = new BehaviorSubject<any>('#65c18c')
    // public bg_white : BehaviorSubject<any> = new BehaviorSubject<any>('#ffffff')
    // public primary_color : BehaviorSubject<any> = new BehaviorSubject<any>('#65c18c')
    // public secondary_color : BehaviorSubject<any> = new BehaviorSubject<any>('#141e27')
    // public input_filed_primary_color : BehaviorSubject<any> = new BehaviorSubject<any>('#808080')
    // public input_filed_background_color : BehaviorSubject<any> = new BehaviorSubject<any>('#f2f2f2')
    // public input_filed_border_color : BehaviorSubject<any> = new BehaviorSubject<any>('#d0d0d0')
    // public form_border_color : BehaviorSubject<any> = new BehaviorSubject<any>('rgba(101, 193, 140, 0.1)')
    // public test_shadow_color : BehaviorSubject<any> = new BehaviorSubject<any>('#9195a9')
    // public button_background_color : BehaviorSubject<any> = new BehaviorSubject<any>('rgba(101, 193, 140, 0.1)')
    // public light_gray_color : BehaviorSubject<any> = new BehaviorSubject<any>('#B5B5C3')
    // public title : BehaviorSubject<any> = new BehaviorSubject<any>('')
    // public login_title : BehaviorSubject<any> = new BehaviorSubject<any>('')
    // public login_cover_image : BehaviorSubject<any> = new BehaviorSubject<any>("url('assets/media/logos/edinfini-login-image.jpg')")
    // public site_logo : BehaviorSubject<any> = new BehaviorSubject<any>("url('assets/media/logos/LOGO-EDINFINI-HEADER.png')")
    // public dashboard_hight : BehaviorSubject<any> = new BehaviorSubject<any>('65px')
    // public dashboard_logo_width : BehaviorSubject<any> = new BehaviorSubject<any>('110px')
    // public dashboard_logo_hight : BehaviorSubject<any> = new BehaviorSubject<any>('80px')
    // public edinfini_true : BehaviorSubject<any> = new BehaviorSubject<any>(true)
    // public sbbu_true : BehaviorSubject<any> = new BehaviorSubject<any>(false)

  constructor() {
   }
}
