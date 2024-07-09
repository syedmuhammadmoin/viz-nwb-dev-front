// Angular
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
// Layout
import { HtmlClassService } from '../../html-class.service';
import { LayoutConfigService, ToggleOptions } from '../../../../core/_base/layout';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';

@Component({
  selector: 'kt-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.scss'],
})
export class HeaderMobileComponent implements OnInit {
  // Public properties
  headerLogo = '';
  asideSelfDisplay = true;
  headerMenuSelfDisplay = true;
  headerMobileClasses = '';
  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;

  public showThis: boolean = false;

  toggleOptions: ToggleOptions = {
  target: KTUtil.getBody(),
  targetState: 'topbar-mobile-on',
  toggleState: 'active'
  };

  /**
   * Component constructor
   *
   * @param layoutConfigService: LayoutConfigService
   */
  constructor(
    private layoutConfigService: LayoutConfigService,
    private uiService: HtmlClassService,
    public dynamicColorChanging : DynamicColorChangeService,
		private ref: ChangeDetectorRef
    ) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    this.headerMobileClasses = this.uiService.getClasses('header_mobile', true).toString();
    this.headerLogo = this.getLogoUrl();
    this.asideSelfDisplay = this.layoutConfigService.getConfig('aside.self.display');
    this.headerMenuSelfDisplay = this.layoutConfigService.getConfig('header.menu.self.display');

    this.dynamicColorChanging.global_color.subscribe(( res : any) => {
      
			if(localStorage.getItem('global_color')) {
				this.localsto = JSON.parse(localStorage.getItem('global_color'))
				this.edinfini = this.localsto.edinfini_true;
				this.sbbu = this.localsto.nawabshah_true;
				this.vizalys = this.localsto.vizalys_true;    
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

  getLogoUrl() {
    const headerSelfTheme = this.layoutConfigService.getConfig('header.self.theme') || '';
    const brandSelfTheme = this.layoutConfigService.getConfig('brand.self.theme') || '';
    let result = 'logo-light.png';
    if (!this.asideSelfDisplay) {
      if (headerSelfTheme === 'light') {
        result = 'logo-dark.png';
      }
    } else {
      if (brandSelfTheme === 'light') {
        result = 'logo-dark.png';
      }
    }
    return `./assets/media/logos/${result}`;
  }
}
