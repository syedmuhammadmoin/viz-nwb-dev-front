import { CityState } from './core/shared-state/account-state/store/city.state';
import { StateState } from './core/shared-state/account-state/store/state.state';
import { CountryState } from './core/shared-state/account-state/store/country.state';
import { WarehouseState } from './views/pages/profiling/warehouse/store/warehouse.state';
import { LocationState } from './views/pages/profiling/location/store/location.state';
import { OrganizationState } from './views/pages/profiling/organization/store/organization.state';
import { CategoryState } from './views/pages/profiling/category/store/category.state';
import { CommonModule } from '@angular/common';
// Angular
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GestureConfig } from '@angular/material/core';
import { OverlayModule } from '@angular/cdk/overlay';

// Angular in memory
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// Perfect Scroll bar
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
// SVG inline
import { InlineSVGModule } from 'ng-inline-svg';
// Env
import { environment } from '../environments/environment';
// Hammer JS
import 'hammerjs';
// NGX Permissions
import { NgxPermissionsModule } from 'ngx-permissions';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// State
import { metaReducers, reducers } from './core/reducers';
// NGXS state management
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

// Components
import { AppComponent } from './app.component';
// Modules
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ThemeModule } from './views/theme/theme.module';
// Partials
import { PartialsModule } from './views/partials/partials.module';
// Layout Services
import {
  DataTableService,
  FakeApiService,
  KtDialogService,
  LayoutConfigService,
  LayoutRefService,
  MenuAsideService,
  MenuConfigService,
  MenuHorizontalService,
  PageConfigService,
  SplashScreenService,
  SubheaderService
} from './core/_base/layout';
// Auth
import { AuthModule } from './views/pages/auth/auth.module';
import { AuthService } from './core/auth';
// CRUD
import {
  HttpUtilsService,
  LayoutUtilsService,
  TypesUtilsService
} from './core/_base/crud';
// Config
import { LayoutConfig } from './core/_config/layout.config';
// Highlight JS
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
import { SharedModule } from './views/shared/modules/shared.module';
import { BusinessPartnerState } from './views/pages/profiling/business-partner/store/business-partner.state';
import { ProductState } from './views/pages/profiling/product/store/product.state.state';
import { BankAccountState } from './views/pages/finance/bank-account/store/bank-account.state';
import { CampusState } from './views/pages/profiling/campus/store/campus.state';
import { BudgetState } from './views/pages/budget/current-budget/store/budget.state';
import { StatusState } from './views/pages/workflows/status/store/status.state';
import { BudgetAccountState } from './core/shared-state/account-state/store/budget-account.state';
import { DesignationState } from './views/pages/payroll/designation/store/designation.store';
import { EmployeeState } from './views/pages/payroll/employee/store/employee.state';
import { DepartmentState } from './views/pages/payroll/department/store/department.store';
import { CashAccountState } from './views/pages/finance/cash-account/store/cash-account.state';
import { AccountPayableState } from './views/pages/finance/chat-of-account/store/account-payable.state';
import { AccountLevel4State } from './views/pages/finance/chat-of-account/store/account-level4.state';
import { BasicPayState } from './views/pages/payroll/payroll-item/store/basic-pay.state';
import { IncrementState } from './views/pages/payroll/payroll-item/store/increment.state';
import { DeductionState } from './views/pages/payroll/payroll-item/store/deduction.state';
import { AccountReceivableState } from './views/pages/finance/chat-of-account/store/account-receivable.state';
import { OtherAccountState } from './views/pages/finance/chat-of-account/store/other-account.state';
import { RoleState } from './views/pages/access-management/store/role.state';
import { UnitOfMeasurementState } from './views/pages/profiling/unit-of-measurement/store/unit.state';
import { CustomRemarksComponent } from './views/shared/components/custom-remarks/custom-remarks.component';
import { CustomUploadFileComponent } from './views/shared/components/custom-upload-file/custom-upload-file.component';
import { ShowRemarksComponent } from './views/shared/components/show-remarks/show-remarks.component';
import { AssetCategoryState } from './views/pages/fixed-asset/asset-category/store/asset-category.state';
import { DepreciationModelState } from './views/pages/fixed-asset/depreciation-model/store/depreciation-model.state';
import { AssetAccountState } from './views/pages/finance/chat-of-account/store/asset-account.state';
import { AppInitializer } from 'AppInitializer';
import { EmployeePaymentState } from './views/pages/payroll/employee/store/employeePayment.state';
import { AllBusinessPartnerState } from './views/pages/profiling/business-partner/store/All-business-partner.state';
import { PayrollItemState } from './views/pages/payroll/payroll-item/store/payroll-item.state';
import { RequisitionState } from './views/pages/procurement/requisition/store/requisition.state';

// tslint:disable-next-line:class-name
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelSpeed: 0.5,
  swipeEasing: true,
  minScrollbarLength: 40,
  maxScrollbarLength: 300
};

export function initializeLayoutConfig(appConfig: LayoutConfigService) {
  // initialize app by loading default demo layout config
  return () => {
    if (appConfig.getConfig() === null) {
      appConfig.loadConfigs(new LayoutConfig().configs);
    }
  };
}

/**
 * Import specific languages to avoid importing everything
 * The following will lazy load highlight.js core script (~9.6KB) + the selected languages bundle (each lang. ~1kb)
 */
export function getHighlightLanguages() {
  return [
    { name: 'typescript', func: typescript },
    { name: 'scss', func: scss },
    { name: 'xml', func: xml },
    { name: 'json', func: json }
  ];
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // environment.isMockEnabled
    //   ? HttpClientInMemoryWebApiModule.forRoot(FakeApiService, {
    //     passThruUnknownUrl: true,
    //     dataEncapsulation: false
    //   })
    //   : [],
    NgxPermissionsModule.forRoot(),
    NgxsModule.forRoot([
      BusinessPartnerState,
      AllBusinessPartnerState,
      CampusState,
      CategoryState,
      OrganizationState,
      DepartmentState,
      DesignationState,
      EmployeeState,
      EmployeePaymentState,
      LocationState,
      ProductState,
      WarehouseState,
      AccountLevel4State,
      AccountPayableState,
      AccountReceivableState,
      OtherAccountState,
      BudgetAccountState,
      CountryState,
      RoleState,
      StateState,
      CityState,
      UnitOfMeasurementState,
      BasicPayState,
      IncrementState,
      DeductionState,
      BankAccountState,
      CashAccountState,
      AssetAccountState,
      AssetCategoryState,
      DepreciationModelState,
      BudgetState,
      StatusState,
      PayrollItemState,
      RequisitionState
    ]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    HighlightModule,
    PartialsModule,
    CoreModule,
    OverlayModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    StoreDevtoolsModule.instrument(),
    AuthModule.forRoot(),
    TranslateModule.forRoot(),
    MatProgressSpinnerModule,
    InlineSVGModule.forRoot(),
    ThemeModule,
    SharedModule
  ],
  exports: [],
  providers: [
    AuthService,
    LayoutConfigService,
    LayoutRefService,
    MenuConfigService,
    PageConfigService,
    KtDialogService,
    DataTableService,
    SplashScreenService,
    // BusinessPartnerResolverService,
    // LocationResolverService,
    // AccountResolverService,
    // ProductResolverService,
    // BankAccountResolverService,
    // DepartmentResolverService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: GestureConfig
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (appInitializer: AppInitializer) => appInitializer.init(),
      deps: [AppInitializer],
      multi: true,
    },
    {
      // layout config initializer
      provide: APP_INITIALIZER,
      useFactory: initializeLayoutConfig,
      deps: [LayoutConfigService],
      multi: true
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        languages: getHighlightLanguages
      }
    },
    // template services
    SubheaderService,
    MenuHorizontalService,
    MenuAsideService,
    HttpUtilsService,
    TypesUtilsService,
    LayoutUtilsService
  ],
  bootstrap: [AppComponent],

})
export class AppModule {
}
