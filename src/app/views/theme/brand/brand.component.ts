// Angular
import { AfterViewInit, Component, OnInit, ChangeDetectorRef } from '@angular/core';
// Layout
import { LayoutConfigService, ToggleOptions } from '../../../core/_base/layout';
import { DynamicColorChangeService } from '../../shared/services/dynamic-color/dynamic-color-change.service';
import { HtmlClassService } from '../html-class.service';


@Component({
  selector: 'kt-brand',
  templateUrl: './brand.component.html',
})
export class BrandComponent implements OnInit, AfterViewInit {
  // Public properties
  headerLogo = '';
  brandClasses = '';
  edinfini: boolean;
  sbbu: boolean;
  vizalys: boolean;
  localsto: any;
  asideSelfMinimizeToggle = true;

  toggleOptions: ToggleOptions = {
    target: 'kt_body',
    targetState: 'aside-minimize',
    toggleState: 'active'
  };

  /**
   * Component constructor
   *
   * @param layoutConfigService: LayoutConfigService
   * @param htmlClassService: HtmlClassService
   */
  constructor(
    private layoutConfigService: LayoutConfigService,
    private ref: ChangeDetectorRef,
    public htmlClassService: HtmlClassService,
    public dynamicColorChanging: DynamicColorChangeService) {

  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void {
    this.headerLogo = this.getAsideLogo();
    this.brandClasses = this.htmlClassService.getClasses('brand', true).toString();
    this.asideSelfMinimizeToggle = this.layoutConfigService.getConfig('aside.self.minimize.toggle');

    this.dynamicColorChanging.global_color.subscribe((res: any) => {

      if (localStorage.getItem('global_color')) {
        this.localsto = JSON.parse(localStorage.getItem('global_color'))
        this.edinfini = this.localsto.edinfini_true;
        this.vizalys = this.localsto.vizalys_true;
        this.sbbu = this.localsto.nawabshah_true;
      }
      else {
        this.localsto = res;
        this.edinfini = this.localsto.edinfini_true;
        this.vizalys = this.localsto.vizalys_true;
        this.sbbu = this.localsto.nawabshah_true;
      }

      this.ref.detectChanges()
    })
  }

  /**
   * On after view init
   */
  ngAfterViewInit(): void {
  }

  getAsideLogo() {
    let result = 'logo-light.png';
    const brandSelfTheme = this.layoutConfigService.getConfig('brand.self.theme') || '';
    if (brandSelfTheme === 'light') {
      result = 'final-logo-new.png';
    }
    return `./assets/media/logos/${result}`;
  }

  toggleAsideClick() {
    document.body.classList.toggle('aside-minimize');
  }
}
