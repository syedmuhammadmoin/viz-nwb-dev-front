import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';
import * as objectPath from 'object-path';
// Layout
import { LayoutConfigService, MenuAsideService, MenuOptions, OffcanvasOptions } from '../../../core/_base/layout';
import { HtmlClassService } from '../html-class.service';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthSingletonService } from '../../pages/auth/service/auth-singleton.service';
import { AppConst } from '../../shared/AppConst';

@Component({
  selector: 'kt-aside-left',
  templateUrl: './aside-left.component.html',
  styleUrls: ['./aside-left.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsideLeftComponent extends AppComponentBase implements OnInit {
  private offcanvas: any;

  @ViewChild('asideMenuOffcanvas', { static: true }) asideMenuOffcanvas: ElementRef;
  @ViewChild('asideMenu', { static: true }) asideMenu: ElementRef;

  asideLogo = '';
  asideClasses = '';
  currentRouteUrl = '';
  insideTm: any;
  outsideTm: any;

  menuCanvasOptions: OffcanvasOptions = {
    baseClass: 'aside',
    overlay: true,
    closeBy: 'kt_aside_close_btn',
    toggleBy: {
      target: 'kt_aside_mobile_toggle',
      state: 'mobile-toggle-active'
    }
  };

  menuOptions: MenuOptions = {
    // submenu setup
    submenu: {
      desktop: {
        // by default the menu mode set to accordion in desktop mode
        default: 'dropdown',
      },
      tablet: 'accordion', // menu set to accordion in tablet mode
      mobile: 'accordion' // menu set to accordion in mobile mode
    },

    // accordion setup
    accordion: {
      expandAll: false // allow having multiple expanded accordions in the menu
    }
  };

  public menuItems: [] = [];
  /**
   * Component Constructor
   *
   * param htmlClassService: HtmlClassService
   * param menuAsideService
   * param layoutConfigService: LayoutConfigService
   * param router: Router
   * param render: Renderer2
   * param cdr: ChangeDetectorRef
   */
  constructor(
    public htmlClassService: HtmlClassService,
    public menuAsideService: MenuAsideService,
    public layoutConfigService: LayoutConfigService,
    private render: Renderer2,
    private cdr: ChangeDetectorRef,
    private permissionsService: NgxPermissionsService,
    private authSingleton: AuthSingletonService,
    injector: Injector
  ) {
    super(injector)

    if (AppConst.ClientConfig.config.isCampus == false) {
      removeItemByTitle(this.menuAsideService.menuList$.value, 'Campus');      
    }

    if (AppConst.ClientConfig.config.isAdmission == false) {
      removeItemByTitle(this.menuAsideService.menuList$.value, 'Admission');      
    }

    function removeItemByTitle(arr, titleToRemove) {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];

        if (item.title && item.title === titleToRemove) {
          // Remove the object with the specified title
          arr.splice(i, 1);
          i--; // Decrement i to adjust for the removed element
        }

        if (item.submenu && Array.isArray(item.submenu)) {
          // Recursively check and remove from submenu
          removeItemByTitle(item.submenu, titleToRemove);
        }
      }
    }


    this.permissionsService.loadPermissions(this.authSingleton.getCurrentUserPermission() ?? []);
  }

  ngOnInit() {

    this.currentRouteUrl = this.router.url.split(/[?#]/)[0];

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
        //  this.mobileMenuClose();
        this.cdr.markForCheck();
      });


    const config = this.layoutConfigService.getConfig();

    if (objectPath.get(config, 'aside.menu.dropdown')) {
      this.render.setAttribute(this.asideMenu.nativeElement, 'data-ktmenu-dropdown', '1');
      // tslint:disable-next-line:max-line-length
      this.render.setAttribute(this.asideMenu.nativeElement, 'data-ktmenu-dropdown-timeout', objectPath.get(config, 'aside.menu.submenu.dropdown.hover-timeout'));
    }

    this.asideClasses = this.htmlClassService.getClasses('aside', true).toString();
    this.asideLogo = this.getAsideLogo();
    setTimeout(() => {
      this.offcanvas = new KTOffcanvas(this.asideMenuOffcanvas.nativeElement, this.menuCanvasOptions);
    });
  }

  getAsideLogo() {
    let result = 'logo-light.png';
    const brandSelfTheme = this.layoutConfigService.getConfig('brand.self.theme') || '';
    if (brandSelfTheme === 'light') {
      result = 'logo-dark.png';
    }
    return `./assets/media/logos/${result}`;
  }

  /**
   * Check Menu is active
   * @param item: any
   */
  isMenuItemIsActive(item): boolean {
    if (item.submenu) {
      return this.isMenuRootItemIsActive(item);
    }

    if (!item.page) {
      return false;
    }

    return this.currentRouteUrl.indexOf(item.page) !== -1;
    // return false

  }

  /**
   * Check Menu Root Item is active
   * @param item: any
   */
  isMenuRootItemIsActive(item): boolean {
    let result = false;

    for (const subItem of item.submenu) {
      result = this.isMenuItemIsActive(subItem);
      if (result) {
        return true;
      }
    }

    return false;
  }

  /**
   * Use for fixed left aside menu, to show menu on mouseenter event.
   * @param e Event
   */
  mouseEnter() {
    // check if the left aside menu is fixed
    if (document.body.classList.contains('aside-fixed')) {
      if (this.outsideTm) {
        clearTimeout(this.outsideTm);
        this.outsideTm = null;
      }

      this.insideTm = setTimeout(() => {
        // if the left aside menu is minimized
        if (document.body.classList.contains('aside-minimize') && KTUtil.isInResponsiveRange('desktop')) {
          // show the left aside menu
          this.render.removeClass(document.body, 'aside-minimize');
          this.render.addClass(document.body, 'aside-minimize-hover');
        }
      }, 50);
    }
  }

  /**
   * Use for fixed left aside menu, to show menu on mouseenter event.
   * @param e Event
   */
  mouseLeave() {
    if (document.body.classList.contains('aside-fixed')) {
      if (this.insideTm) {
        clearTimeout(this.insideTm);
        this.insideTm = null;
      }

      this.outsideTm = setTimeout(() => {
        // if the left aside menu is expand
        if (document.body.classList.contains('aside-minimize-hover') && KTUtil.isInResponsiveRange('desktop')) {
          // hide back the left aside menu
          this.render.removeClass(document.body, 'aside-minimize-hover');
          this.render.addClass(document.body, 'aside-minimize');
        }
      }, 100);
    }
  }

  /**
   * Returns Submenu CSS Class Name
   * @param item: any
   */
  getItemCssClasses(item) {
    let classes = 'menu-item';

    if (objectPath.get(item, 'submenu')) {
      classes += ' menu-item-submenu';
    }

    if (!item.submenu && this.isMenuItemIsActive(item)) {
      classes += ' menu-item-active menu-item-here';
    }

    // if (item.submenu && this.isMenuItemIsActive(item)) {
    //   classes += ' menu-item-open menu-item-here';
    // }

    // custom class for menu item
    const customClass = objectPath.get(item, 'custom-class');
    if (customClass) {
      classes += ' ' + customClass;
    }

    if (objectPath.get(item, 'icon-only')) {
      classes += ' menu-item-icon-only';
    }

    return classes;
  }

  getItemAttrSubmenuToggle(item) {
    let toggle = 'hover';
    if (objectPath.get(item, 'toggle') === 'click') {
      toggle = 'click';
    } else if (objectPath.get(item, 'submenu.type') === 'tabs') {
      toggle = 'tabs';
    } else {
      // submenu toggle default to 'hover'
    }

    return toggle;
  }


  mobileMenuClose() {
    if (KTUtil.isBreakpointDown('lg') && this.offcanvas) { // Tablet and mobile mode
      this.offcanvas.hide(); // Hide offcanvas after general link click
    }
  }

  showMenuItem(permissions: any): boolean {
    if (permissions) {
      return permissions.filter(item => this.permission.isGranted(item)).length > 0 ? true : false;
    }
    return true
  }
}
