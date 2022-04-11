import { Injectable, } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AccountLevel4State } from 'src/app/core/shared-state/account-state/store/account-level4.state';

import { CityState } from 'src/app/core/shared-state/account-state/store/city.state';
import { CountryState } from 'src/app/core/shared-state/account-state/store/country.state';
import { StateState } from 'src/app/core/shared-state/account-state/store/state.state';
import { BudgetService } from 'src/app/views/pages/budget/service/budget.service';
import { BudgetState } from 'src/app/views/pages/budget/store/budget.state';
import { BankAccountService } from 'src/app/views/pages/finance/bank-account/service/bankAccount.service';
import { BankAccountState } from 'src/app/views/pages/finance/bank-account/store/bank-account.state';
import { ChartOfAccountService } from 'src/app/views/pages/finance/chat-of-account/service/chart-of-account.service';
import { BusinessPartnerService } from 'src/app/views/pages/profiling/business-partner/service/businessPartner.service';

import { BusinessPartnerState } from 'src/app/views/pages/profiling/business-partner/store/business-partner.state';
import { CampusService } from 'src/app/views/pages/profiling/campus/service/campus.service';
import { CampusState } from 'src/app/views/pages/profiling/campus/store/campus.state';
import { CategoryService } from 'src/app/views/pages/profiling/category/service/category.service';
import { CategoryState } from 'src/app/views/pages/profiling/category/store/category.state';
import { DepartmentService } from 'src/app/views/pages/profiling/department/service/department.service';
import { DepartmentState } from 'src/app/views/pages/profiling/department/store/department.state';
import { LocationService } from 'src/app/views/pages/profiling/location/service/location.service';
import { LocationState } from 'src/app/views/pages/profiling/location/store/location.state';
import { OrganizationService } from 'src/app/views/pages/profiling/organization/services/organization.service';
import { OrganizationState } from 'src/app/views/pages/profiling/organization/store/organization.state';
import { ProductService } from 'src/app/views/pages/profiling/product/service/product.service';
import { ProductState } from 'src/app/views/pages/profiling/product/store/product.state.state';
import { GetList } from 'src/app/views/pages/profiling/store/profiling.action';
import { WarehouseService } from 'src/app/views/pages/profiling/warehouse/services/warehouse.service';
import { WarehouseState } from 'src/app/views/pages/profiling/warehouse/store/warehouse.state';
import { StatusState } from 'src/app/views/pages/workflows/status/store/status.state';
import { CscService } from 'src/app/views/shared/csc.service';

export class NgxsCustomService {

  // constructor
  constructor(
    // services
    public businessPartnerService: BusinessPartnerService,
    public campusService: CampusService,
    public categoryService: CategoryService,
    public chartOfAccountService: ChartOfAccountService,
    public departmentService: DepartmentService,
    public locationService: LocationService,
    public organizationService: OrganizationService,
    public productService: ProductService,
    public warehouseService: WarehouseService,
    public cscService: CscService,
    public bankAccountService: BankAccountService,
    public budgetService: BudgetService,
    public store: Store,
  ) { }

  //selector region start
  // Business Partner
  @Select(BusinessPartnerState.entities) businessPartners$: Observable<any>;
  @Select(BusinessPartnerState.isFetchCompleted) businessPartnerFetchCompleted$: Observable<any>;
  @Select(BusinessPartnerState.isLoading) businessPartnerIsLoading$: Observable<any>;

  // Business Partner
  @Select(CampusState.entities) campuses$: Observable<any>;
  @Select(CampusState.isFetchCompleted) campusFetchCompleted$: Observable<any>;
  @Select(CampusState.isLoading) campusIsLoading$: Observable<any>;


  //  // Business Partner Country
  //  @Select(CountryState.entities) countries$: Observable<any>;
  //  @Select(CountryState.isFetchCompleted) countryFetchCompleted$: Observable<any>;
  //  @Select(CountryState.isLoading) countryIsLoading$: Observable<any>;


  //  // Business Partner State
  //  @Select(StateState.entities) states$: Observable<any>;
  //  @Select(StateState.isFetchCompleted) stateFetchCompleted$: Observable<any>;
  //  @Select(StateState.isLoading) stateIsLoading$: Observable<any>;

  //  //Business Partner Cities
  //  @Select(CityState.entities) cities$: Observable<any>;
  //  @Select(CityState.isFetchCompleted) cityFetchCompleted$: Observable<any>;
  //  @Select(CityState.isLoading) cityIsLoading$: Observable<any>;

  // Account Payable
  @Select(AccountLevel4State.entities) accountsLevel4$: Observable<any>;
  @Select(AccountLevel4State.isFetchCompleted) accountLevel4FetchCompleted$: Observable<any>;
  @Select(AccountLevel4State.isLoading) accountLevel4IsLoading$: Observable<any>;


  // Category
  @Select(CategoryState.entities) categories$: Observable<any>;
  @Select(CategoryState.isFetchCompleted) categoryFetchCompleted$: Observable<any>;
  @Select(CategoryState.isLoading) categoryIsLoading$: Observable<any>;


  // // Department
  // @Select(DepartmentState.entities) departments$: Observable<any>;
  // @Select(DepartmentState.isFetchCompleted) departmentFetchCompleted$: Observable<any>;
  // @Select(DepartmentState.isLoading) departmentIsLoading$: Observable<any>;


  // // Location
  // @Select(LocationState.entities) locations$: Observable<any>;
  // @Select(LocationState.isFetchCompleted) locationFetchCompleted$: Observable<any>;
  // @Select(LocationState.isLoading) locationIsLoading$: Observable<any>;

  // // Organization
  // @Select(OrganizationState.entities) organizations$: Observable<any>;
  // @Select(OrganizationState.isFetchCompleted) organizationFetchCompleted$: Observable<any>;
  // @Select(OrganizationState.isLoading) organizationIsLoading$: Observable<any>;

  // Product
  @Select(ProductState.entities) products$: Observable<any>;
  @Select(ProductState.isFetchCompleted) productFetchCompleted$: Observable<any>;
  @Select(ProductState.isLoading) productIsLoading$: Observable<any>;

  // Product
  @Select(WarehouseState.entities) warehouses$: Observable<any>;
  @Select(WarehouseState.isFetchCompleted) warehouseFetchCompleted$: Observable<any>;
  @Select(WarehouseState.isLoading) warehouseIsLoading$: Observable<any>;
  //selector region end

  //finance module selectors
   // Business Partner Country
   @Select(BankAccountState.entities) bankAccounts$: Observable<any>;
   @Select(BankAccountState.isFetchCompleted) bankAccountFetchCompleted$: Observable<any>;
   @Select(BankAccountState.isLoading) bankAccountIsLoading$: Observable<any>;


  //region State Management

  // Get Business Partner From Store if available else fetch from the server and cache.
  getBusinessPartnerFromState() {
    this.businessPartnerFetchCompleted$.subscribe((res) => {
      //console.log('Business Partner State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(BusinessPartnerState, {
          serviceClass: this.businessPartnerService,
          methodName: 'getBusinessPartnersDropdown',
          context: this
        }))
      }
    })
  }

  // Get Campus From Store if available else fetch from the server and cache.
  getCampusFromState() {
    this.campusFetchCompleted$.subscribe((res) => {
      //console.log('Campus State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(CampusState, {
          serviceClass: this.campusService,
          methodName: 'getCampusDropdown',
          context: this
        }))
      }
    })
  }

  // Get Budgets From Store if available else fetch from the server and cache.
  getBudgetsFromState() {
    this.campusFetchCompleted$.subscribe((res) => {
      //console.log('Budget State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(BudgetState, {
          serviceClass: this.campusService,
          methodName: 'getBudgetDropdown',
          context: this
        }))
      }
    })
  }

  // Get Status From Store if available else fetch from the server and cache.
  getStatusFromState() {
    this.campusFetchCompleted$.subscribe((res) => {
      //console.log('Status State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(StatusState, {
          serviceClass: this.campusService,
          methodName: 'getStatusDropdown',
          context: this
        }))
      }
    })
  }

//  // Get Country From Store if available else fetch from the server and cache.
//  getCountryFromState() {
//   this.countryFetchCompleted$.subscribe((res) => {
//     console.log('Country State fetch completed: ', res);
//     if (!res) {
//       this.store.dispatch(new GetList(CountryState, {
//         serviceClass: this.cscService,
//         methodName: 'getCountries',
//         context: this
//       }))
//     }
//   })
// }

//  // Get Country state From Store if available else fetch from the server and cache.
//  getStateFromState() {
//   this.stateFetchCompleted$.subscribe((res) => {
//     console.log('Country State fetch completed: ', res);
//     if (!res) {
//       this.store.dispatch(new GetList(StateState, {
//         serviceClass: this.cscService,
//         methodName: 'getStates',
//         context: this
//       }))
//     }
//   })
// }

//   // Get City State From Store if available else fetch from the server and cache.
//   getCityFromState() {
//     this.cityFetchCompleted$.subscribe((res) => {
//       console.log('City State fetch completed: ', res);
//       if (!res) {
//         this.store.dispatch(new GetList(CityState, {
//           serviceClass: this.cscService,
//           methodName: 'getCities',
//           context: this
//         }))
//       }
//     })
//   }

   // Get All Level 4 Accounts State From Store if available else fetch from the server and cache.
  getAccountLevel4FromState() {
    this.accountLevel4FetchCompleted$.subscribe((res) => {
      //console.log('Account level 4 FetchCompleted: ', res);
      if (!res) {
        this.store.dispatch(new GetList(AccountLevel4State, {
          serviceClass: this.chartOfAccountService,
          methodName: 'getLevel4AccountsDropdown',
          context: this
        }))
      }
    })
  }  

  // Get Category From Store if available else fetch from the server and cache.
  getCategoryFromState() {
    this.categoryFetchCompleted$.subscribe((res) => {
      //console.log('Category State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(CategoryState, {
          serviceClass: this.categoryService,
          methodName: 'getCategoriesDropdown',
          context: this
        }))
      }
    })
  }
  // // Get Department From Store if available else fetch from the server and cache.
  // getDepatmentFromState() {
  //   this.departmentFetchCompleted$.subscribe((res) => {
  //     console.log('Department State fetch completed: ', res);
  //     if (!res) {
  //       this.store.dispatch(new GetList(DepartmentState, {
  //         serviceClass: this.departmentService,
  //         methodName: 'getDepartmentsDropdown',
  //         context: this
  //       }))
  //     }
  //   })
  // }

  
  // // Get Location From Store if available else fetch from the server and cache.
  // getLocationFromState() {
  //   this.locationFetchCompleted$.subscribe((res) => {
  //     console.log('Location Statefetch completed: ', res);
  //     if (!res) {
  //       this.store.dispatch(new GetList(LocationState, {
  //         serviceClass: this.locationService,
  //         methodName: 'getLocationsDropdown',
  //         context: this
  //       }))
  //     }
  //   })
  // }
  // // Get Organization From Store if available else fetch from the server and cache.
  // getOrganizationFromState() {
  //   this.organizationFetchCompleted$.subscribe((res) => {
  //     console.log('Organization State fetch completed: ', res);
  //     if (!res) {
  //       this.store.dispatch(new GetList(OrganizationState, {
  //         serviceClass: this.organizationService,
  //         methodName: 'getOrganizationsDropdown',
  //         context: this
  //       }))
  //     }
  //   })
  // }
  // Get Product From Store if available else fetch from the server and cache.
  getProductFromState() {
    this.productFetchCompleted$.subscribe((res) => {
      //console.log('Product State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(ProductState, {
          serviceClass: this.productService,
          methodName: 'getProductsDropdown',
          context: this
        }))
      }
    })
  }
  // Get Warehouse From Store if available else fetch from the server and cache.
  getWarehouseFromState() {
    this.warehouseFetchCompleted$.subscribe((res) => {
      //console.log('Warehouse State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(WarehouseState, {
          serviceClass: this.warehouseService,
          methodName: 'getWarehousesDropdown',
          context: this
        }))
      }
    })
  }

  //finance module selector methods
   // Get Bank Account State From Store if available else fetch from the server and cache.
   getBankAccountFromState() {
    this.bankAccountFetchCompleted$.subscribe((res) => {
      //console.log('Bank Account State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(BankAccountState, {
          serviceClass: this.bankAccountService,
          methodName: 'getBankAccountsDropdown',
          context: this
        }))
      }
    })
  }
  //end state region 
}


