import {Subscription} from 'rxjs';
// title
import { Title } from '@angular/platform-browser';
// Angular
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, NavigationStart, Router, Event, NavigationCancel} from '@angular/router';
// Layout
import {LayoutConfigService, SplashScreenService, TranslationService} from './core/_base/layout';
// language list
import {locale as enLang} from './core/_config/i18n/en';
import {locale as chLang} from './core/_config/i18n/ch';
import {locale as esLang} from './core/_config/i18n/es';
import {locale as jpLang} from './core/_config/i18n/jp';
import {locale as deLang} from './core/_config/i18n/de';
import {locale as frLang} from './core/_config/i18n/fr';
import { DynamicColorChangeService } from './views/shared/services/dynamic-color/dynamic-color-change.service';
import { AppConst } from './views/shared/AppConst';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[kt-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  // Public properties
  // title = 'Welcome to Vizalys';
  // logo: string = './assets/media/logos/favicon.png';
  loader: false;
  // custom property fr overlay
  showOverlay = true;

  globalcolor_localStorage : any = '';
  globalcolor_sessionStorage : any = '';

  chackSecission: any = '';
  chacklocalstorage: any = '';

  favIcon: HTMLLinkElement = document.querySelector('#favIcon'); 


  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  /**
   * Component constructor
   * @param translationService: TranslationService
   * @param router: Router
   * @param layoutConfigService: LayoutConfigService
   * @param splashScreenService: SplashScreenService
   */
  constructor(
    private translationService: TranslationService,
    private router: Router,
    private layoutConfigService: LayoutConfigService,
    private splashScreenService: SplashScreenService,
    public dynamicColorChanging : DynamicColorChangeService,
    private title: Title,
  ) {
    // this.loading=true;
    // register translations
    this.translationService.loadTranslations(enLang, chLang, esLang, jpLang, deLang, frLang);

    
    

  }
  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  public currentClient: any = {}
  ngOnInit(): void {
    debugger;
    this.currentClient = AppConst.ClientConfig.config
		console.log("Ooper",this.currentClient);
    this.changeColor();
    // this.globalStyle.textcolor;
    // enable/disable loader

    this.loader = this.layoutConfigService.getConfig('page-loader.type');

    const routerSubscription = this.router.events.subscribe(event => {
      // custom loader start
      if (event instanceof NavigationStart) {
        this.showOverlay = true;
      }

      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.showOverlay = false;
        // hide splash screen
        this.splashScreenService.hide();
        // scroll to top on every route change
        window.scrollTo(0, 0);
        // to display back the body content
        setTimeout(() => {
          document.body.classList.add('page-loaded');
        }, 300);
      }
    });
    this.unsubscribe.push(routerSubscription);

    this.dynamicColorChanging.global_color.subscribe((res : any)  => {
      this.chacklocalstorage = localStorage.getItem('global_color');

      if (this.chacklocalstorage){

        this.globalcolor_localStorage = JSON.parse(localStorage.getItem('global_color'))
        
        document.documentElement.style.setProperty('--bg_gradient_color_one' ,this.globalcolor_localStorage.bg_gradient_color_one)

        document.documentElement.style.setProperty('--bg_gradient_color_two' ,this.globalcolor_localStorage.bg_gradient_color_two)

        document.documentElement.style.setProperty('--bg_white' ,this.globalcolor_localStorage.bg_white)

        document.documentElement.style.setProperty('--primary_color' ,this.globalcolor_localStorage.primary_color)

        document.documentElement.style.setProperty('--secondary_color' ,this.globalcolor_localStorage.secondary_color)

        document.documentElement.style.setProperty('--input_filed_primary_color' ,this.globalcolor_localStorage.input_filed_primary_color)

        document.documentElement.style.setProperty('--input_filed_background_color' ,this.globalcolor_localStorage.input_filed_background_color)

        document.documentElement.style.setProperty('--input_filed_border_color' ,this.globalcolor_localStorage.input_filed_border_color)

        document.documentElement.style.setProperty('--form_border_color' ,this.globalcolor_localStorage.form_border_color)

        document.documentElement.style.setProperty('--test_shadow_color' ,this.globalcolor_localStorage.test_shadow_color)

        document.documentElement.style.setProperty('--button_background_color' ,this.globalcolor_localStorage.button_background_color)

        document.documentElement.style.setProperty('--button_background_color' ,this.globalcolor_localStorage.button_background_color)

        document.documentElement.style.setProperty('--light_gray_color' ,this.globalcolor_localStorage.light_gray_color)

        document.documentElement.style.setProperty('--toggler_arrow_color' ,this.globalcolor_localStorage.toggler_arrow_color)

        document.documentElement.style.setProperty('--home_logo_bg' ,this.globalcolor_localStorage.home_logo_bg)

        document.documentElement.style.setProperty('--db_dd_t_c' ,this.globalcolor_localStorage.db_dd_t_c)

        document.documentElement.style.setProperty('--title' ,this.globalcolor_localStorage.title)

        document.documentElement.style.setProperty('--login_title' ,this.globalcolor_localStorage.login_title)

        document.documentElement.style.setProperty('--login_title' ,this.globalcolor_localStorage.login_title)

        document.documentElement.style.setProperty('--login_cover_image' ,this.globalcolor_localStorage.login_cover_image)

        document.documentElement.style.setProperty('--site_logo' ,this.globalcolor_localStorage.site_logo)

        document.documentElement.style.setProperty('--dashboard_hight' ,this.globalcolor_localStorage.dashboard_hight)

        document.documentElement.style.setProperty('--dashboard_logo_width' ,this.globalcolor_localStorage.dashboard_logo_width)

        document.documentElement.style.setProperty('--dashboard_logo_hight' ,this.globalcolor_localStorage.dashboard_logo_hight)

        document.documentElement.style.setProperty('--chart_color' ,this.globalcolor_localStorage.chart_color)

        document.documentElement.style.setProperty('--site_title' ,this.globalcolor_localStorage.site_title)

        document.documentElement.style.setProperty('--fav_icon' ,this.globalcolor_localStorage.fav_icon)

        document.documentElement.style.setProperty('--edinfini_true' ,this.globalcolor_localStorage.edinfini_true)

        document.documentElement.style.setProperty('--nawabshah_true' ,this.globalcolor_localStorage.nawabshah_true)

        document.documentElement.style.setProperty('--vizalys_true' ,this.globalcolor_localStorage.vizalys_true)
        document.documentElement.style.setProperty('--print_logo' ,this.globalcolor_localStorage.print_logo)

        this.title.setTitle(this.globalcolor_localStorage.site_title)
        this.favIcon.href =(this.globalcolor_localStorage.fav_icon)


        // this.dynamicColorChanging.edinfini.next(true)
      }

      else{
        localStorage.setItem('global_color' , JSON.stringify(res))

        this.globalcolor_localStorage = JSON.parse(localStorage.getItem('global_color'))

        document.documentElement.style.setProperty('--bg_gradient_color_one' ,this.globalcolor_localStorage.bg_gradient_color_one)

        document.documentElement.style.setProperty('--bg_gradient_color_two' ,this.globalcolor_localStorage.bg_gradient_color_two)
        
        document.documentElement.style.setProperty('--bg_white' ,this.globalcolor_localStorage.bg_white)
      
        document.documentElement.style.setProperty('--primary_color' ,this.globalcolor_localStorage.primary_color)

        document.documentElement.style.setProperty('--secondary_color' ,this.globalcolor_localStorage.secondary_color)

        document.documentElement.style.setProperty('--input_filed_primary_color' ,this.globalcolor_localStorage.input_filed_primary_color)
    
        document.documentElement.style.setProperty('--input_filed_background_color' ,this.globalcolor_localStorage.input_filed_background_color)

        document.documentElement.style.setProperty('--input_filed_border_color' ,this.globalcolor_localStorage.input_filed_border_color)
 
        document.documentElement.style.setProperty('--form_border_color' ,this.globalcolor_localStorage.form_border_color)
   
        document.documentElement.style.setProperty('--test_shadow_color' ,this.globalcolor_localStorage.test_shadow_color)
 
        document.documentElement.style.setProperty('--button_background_color' ,this.globalcolor_localStorage.button_background_color)

        document.documentElement.style.setProperty('--light_gray_color' ,this.globalcolor_localStorage.light_gray_color)

        document.documentElement.style.setProperty('--toggler_arrow_color' ,this.globalcolor_localStorage.toggler_arrow_color)

        document.documentElement.style.setProperty('--home_logo_bg' ,this.globalcolor_localStorage.home_logo_bg)

        document.documentElement.style.setProperty('--db_dd_t_c' ,this.globalcolor_localStorage.db_dd_t_c)

        document.documentElement.style.setProperty('--title' ,this.globalcolor_localStorage.title)

        document.documentElement.style.setProperty('--login_title' ,this.globalcolor_localStorage.login_title)

        document.documentElement.style.setProperty('--login_cover_image' ,this.globalcolor_localStorage.login_cover_image)
    
        document.documentElement.style.setProperty('--site_logo' ,this.globalcolor_localStorage.site_logo)
  
        document.documentElement.style.setProperty('--dashboard_hight' ,this.globalcolor_localStorage.dashboard_hight)

        document.documentElement.style.setProperty('--dashboard_logo_width' ,this.globalcolor_localStorage.dashboard_logo_width)

        document.documentElement.style.setProperty('--dashboard_logo_hight' ,this.globalcolor_localStorage.dashboard_logo_width)

        document.documentElement.style.setProperty('--chart_color' ,this.globalcolor_localStorage.chart_color)

        document.documentElement.style.setProperty('--site_title' ,this.globalcolor_localStorage.site_title)

        document.documentElement.style.setProperty('--fav_icon' ,this.globalcolor_localStorage.fav_icon)

        document.documentElement.style.setProperty('--edinfini_true' ,this.globalcolor_localStorage.edinfini_true)
        document.documentElement.style.setProperty('--nawabshah_true' ,this.globalcolor_localStorage.nawabshah_true)
        document.documentElement.style.setProperty('--vizalys_true' ,this.globalcolor_localStorage.vizalys_true)
        document.documentElement.style.setProperty('--print_logo' ,this.globalcolor_localStorage.print_logo)

        this.title.setTitle(this.globalcolor_localStorage.site_title)
        this.favIcon.href =(this.globalcolor_localStorage.fav_icon)
        
      }
    })

  }

  changeColor() {
		debugger;
		console.log("Neechay",this.currentClient);
		localStorage.setItem('global_color', JSON.stringify(this.currentClient));
		this.dynamicColorChanging.global_color.next(this.currentClient);
	}


  /**
   * On Destroy
   */

  ngOnDestroy() {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
  }
}
