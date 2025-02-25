import {WarehouseState} from './views/pages/profiling/warehouse/store/warehouse.state';
import {OrganizationState} from './views/pages/profiling/organization/store/organization.state';
import {CategoryState} from './views/pages/profiling/category/store/category.state';
import {CommonModule} from '@angular/common';
// Angular
import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {OverlayModule} from '@angular/cdk/overlay';

// NGX Permissions
import {NgxPermissionsModule} from 'ngx-permissions';
// NGRX
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
// State
import {metaReducers, reducers} from './core/reducers';
// NGXS state management
import {NgxsModule} from '@ngxs/store';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';

// Components
import {AppComponent} from './app.component';
// Modules
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core/core.module';
import {ThemeModule} from './views/theme/theme.module';
// Partials
import {PartialsModule} from './views/partials/partials.module';
// Layout Services
import {
  DataTableService,
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
import {AuthModule} from './views/pages/auth/auth.module';
import {AuthService} from './core/auth';
// CRUD
import {HttpUtilsService, LayoutUtilsService, TypesUtilsService} from './core/_base/crud';
// Config
import {LayoutConfig} from './core/_config/layout.config';
// Highlight JS
import {HIGHLIGHT_OPTIONS, HighlightModule} from 'ngx-highlightjs';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
import {SharedModule} from './views/shared/modules/shared.module';
import {BusinessPartnerState} from './views/pages/profiling/business-partner/store/business-partner.state';
import {ProductState} from './views/pages/profiling/product/store/product.state.state';
import {DisposalDropdownState} from './views/pages/fixed-asset/asset/store/disposal-dropdown.state';
import {BankAccountState} from './views/pages/finance/bank-account/store/bank-account.state';
import {CampusState} from './views/pages/profiling/campus/store/campus.state';
import {BudgetState} from './views/pages/budget/current-budget/store/budget.state';
import {StatusState} from './views/pages/workflows/status/store/status.state';
import {DesignationState} from './views/pages/payroll/designation/store/designation.store';
import {EmployeeState} from './views/pages/payroll/employee/store/employee.state';
import {DepartmentState} from './views/pages/payroll/department/store/department.store';
import {CashAccountState} from './views/pages/finance/cash-account/store/cash-account.state';
import {AccountPayableState} from './views/pages/finance/chat-of-account/store/account-payable.state';
import {AccountLevel4State} from './views/pages/finance/chat-of-account/store/account-level4.state';
import {BasicPayState} from './views/pages/payroll/payroll-item/store/basic-pay.state';
import {IncrementState} from './views/pages/payroll/payroll-item/store/increment.state';
import {DeductionState} from './views/pages/payroll/payroll-item/store/deduction.state';
import {AccountReceivableState} from './views/pages/finance/chat-of-account/store/account-receivable.state';
import {OtherAccountState} from './views/pages/finance/chat-of-account/store/other-account.state';
import {RoleState} from './views/pages/access-management/store/role.state';
import {UnitOfMeasurementState} from './views/pages/profiling/unit-of-measurement/store/unit.state';
import {DepreciationModelState} from './views/pages/fixed-asset/depreciation-model/store/depreciation-model.state';
import {AssetAccountState} from './views/pages/finance/chat-of-account/store/asset-account.state';
import {AppInitializer} from 'AppInitializer';
import {EmployeePaymentState} from './views/pages/payroll/employee/store/employeePayment.state';
import {AllBusinessPartnerState} from './views/pages/profiling/business-partner/store/All-business-partner.state';
import {PayrollItemState} from './views/pages/payroll/payroll-item/store/payroll-item.state';
import {RequisitionState} from './views/pages/procurement/requisition/store/requisition.state';
import {CategoryAssetState} from './views/pages/profiling/category/store/categoryAsset.state';
import {ExpenseAccountState} from './views/pages/finance/chat-of-account/store/expense-account.state';
import {GetLiabilityAccountsState} from './views/pages/finance/chat-of-account/store/getLiabilityAccount.state';
import {AssetState} from './views/pages/fixed-asset/store/asset.state';
import {CourseState} from './views/pages/admission/course/store/course.state';
import {SemesterState} from './views/pages/admission/semester/store/semester.state';
import {CountryStateState} from './views/pages/admission/state/store/country-state.state';
import {CountryState} from './views/pages/admission/country/store/country.state';
import {CityState} from './views/pages/admission/city/store/city.state';
import { FacultyState } from './views/pages/admission/faculty/store/faculty.state';
import { DegreeState } from './views/pages/admission/degree/store/degree.state';
import { QualificationState } from './views/pages/admission/qualification/store/qualification.state';
import { DistrictState } from './views/pages/admission/district/store/district.state';
import { DomicileState } from './views/pages/admission/domicile/store/domicile.state';
import {AcademicDepartmentState} from './views/pages/admission/academic-department/store/academic-department.state';
import {ShiftState} from './views/pages/admission/shift/store/shift.state';
import {ProgramState} from './views/pages/admission/program/store/program.state';
import {BatchState} from './views/pages/admission/batch/store/batch.state';
import {SubjectState} from './views/pages/admission/subject/store/subject.state';
import { MatCommonModule } from '@angular/material/core';
import { BudgetAccountState } from './views/pages/budget/current-budget/store/budget-account.state';

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
    {name: 'typescript', func: typescript},
    {name: 'scss', func: scss},
    {name: 'xml', func: xml},
    {name: 'json', func: json}
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
    MatCommonModule,
    NgxPermissionsModule.forRoot(),
    NgxsModule.forRoot([
      BusinessPartnerState,
      AllBusinessPartnerState,
      CampusState,
      FacultyState,
      DegreeState,
      DistrictState,
      DomicileState,
      QualificationState,
      CategoryState,
      OrganizationState,
      DepartmentState,
      DesignationState,
      EmployeeState,
      EmployeePaymentState,
      ProductState,
      WarehouseState,
      AccountLevel4State,
      AccountPayableState,
      AccountReceivableState,
      OtherAccountState,
      ExpenseAccountState,
      GetLiabilityAccountsState,
      BudgetAccountState,
      CountryState,
      RoleState,
      UnitOfMeasurementState,
      BasicPayState,
      IncrementState,
      DeductionState,
      BankAccountState,
      CashAccountState,
      AssetAccountState,
      CategoryAssetState,
      DepreciationModelState,
      BudgetState,
      StatusState,
      PayrollItemState,
      RequisitionState,
      AssetState,
      DisposalDropdownState,
      CourseState,
      SemesterState,
      CountryStateState,
      CountryState,
      CityState,
      AcademicDepartmentState,
      ShiftState,
      ProgramState,
      BatchState,
      SubjectState
    ]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot({ disabled: true }),
    HighlightModule,
    PartialsModule,
    CoreModule,
    OverlayModule,
    StoreModule.forRoot(reducers, {metaReducers}),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
    StoreDevtoolsModule.instrument(),
    AuthModule.forRoot(),
    TranslateModule.forRoot(),
    MatProgressSpinnerModule,
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
