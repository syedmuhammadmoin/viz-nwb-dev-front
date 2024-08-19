import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicColorChangeService {

  

  public global_color : BehaviorSubject<any> = new BehaviorSubject<any> (
  
    {
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
  
    //   {
  //   bg_gradient_color_one : "#1a6b85",
  //       bg_gradient_color_two : '#4a8a9e',
  //       bg_white :'#ffffff',
  //       primary_color :'#1a6b85',
  //       secondary_color :'#cba058',
  //       input_filed_primary_color :'#808080',
  //       input_filed_background_color :'#f2f2f2',
  //       input_filed_border_color :'#d0d0d0',
  //       form_border_color :'#aad7e6',
  //       test_shadow_color :'#9195a9',
  //       button_background_color :'#e9f5f9',
  //       light_gray_color :'#B5B5C3',
  //       toggler_arrow_color :'#1a6b85',
  //       home_logo_bg :'#fff',
  //       db_dd_t_c :'#fff',
  //       title :'SBBU',
  //       login_title :'Main Campus SBBU Shaheed benazirabad.',
  //       login_cover_image :"url('assets/media/logos/bg_login.jpg')",
  //       site_logo :"url('assets/media/logos/logo-wr.png')",
  //       dashboard_hight :'90px',
  //       dashboard_logo_width :'70px',
  //       dashboard_logo_hight :'70px',
  //       chart_color : ['#1a6b85', '#1a6b85', '#5390a3', '#5390a3'],
  //       site_title : 'SBBU',
  //       fav_icon : 'assets/media/logos/logo-wr.png',
  //       edinfini_true :false,
  //       nawabshah_true :true,
  //       vizalys_true :false,
  //       print_logo : "url('assets/media/logos/logo-wr.png')"

  // }
)

  constructor() {
   }
}
