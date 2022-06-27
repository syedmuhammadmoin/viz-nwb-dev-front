import { Injectable, } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AccountLevel4State } from 'src/app/views/pages/finance/chat-of-account/store/account-level4.state';
import { BudgetAccountState } from 'src/app/core/shared-state/account-state/store/budget-account.state';

import { BudgetService } from 'src/app/views/pages/budget/current-budget/service/budget.service';
import { BudgetState } from 'src/app/views/pages/budget/current-budget/store/budget.state';
import { BankAccountService } from 'src/app/views/pages/finance/bank-account/service/bankAccount.service';
import { BankAccountState } from 'src/app/views/pages/finance/bank-account/store/bank-account.state';
import { CashAccountService } from 'src/app/views/pages/finance/cash-account/service/cashAccount.service';
import { CashAccountState } from 'src/app/views/pages/finance/cash-account/store/cash-account.state';
import { ChartOfAccountService } from 'src/app/views/pages/finance/chat-of-account/service/chart-of-account.service';
import { DepartmentService } from 'src/app/views/pages/payroll/department/service/department.service';
import { DepartmentState } from 'src/app/views/pages/payroll/department/store/department.store';
import { DesignationService } from 'src/app/views/pages/payroll/designation/service/designation.service';
import { DesignationState } from 'src/app/views/pages/payroll/designation/store/designation.store';
import { EmployeeService } from 'src/app/views/pages/payroll/employee/service/employee.service';
import { EmployeeState } from 'src/app/views/pages/payroll/employee/store/employee.state';
import { BusinessPartnerService } from 'src/app/views/pages/profiling/business-partner/service/businessPartner.service';

import { BusinessPartnerState } from 'src/app/views/pages/profiling/business-partner/store/business-partner.state';
import { CampusService } from 'src/app/views/pages/profiling/campus/service/campus.service';
import { CampusState } from 'src/app/views/pages/profiling/campus/store/campus.state';
import { CategoryService } from 'src/app/views/pages/profiling/category/service/category.service';
import { CategoryState } from 'src/app/views/pages/profiling/category/store/category.state';
import { LocationService } from 'src/app/views/pages/profiling/location/service/location.service';
import { OrganizationService } from 'src/app/views/pages/profiling/organization/services/organization.service';
import { ProductService } from 'src/app/views/pages/profiling/product/service/product.service';
import { ProductState } from 'src/app/views/pages/profiling/product/store/product.state.state';
import { GetList } from 'src/app/views/pages/profiling/store/profiling.action';
import { WarehouseService } from 'src/app/views/pages/profiling/warehouse/services/warehouse.service';
import { WarehouseState } from 'src/app/views/pages/profiling/warehouse/store/warehouse.state';
import { StatusState } from 'src/app/views/pages/workflows/status/store/status.state';
import { CscService } from 'src/app/views/shared/csc.service';
import { AccountPayableState } from 'src/app/views/pages/finance/chat-of-account/store/account-payable.state';
import { StatusService } from 'src/app/views/pages/workflows/status/service/status.service';
import { BasicPayState } from 'src/app/views/pages/payroll/payroll-item/store/basic-pay.state';
import { IncrementState } from 'src/app/views/pages/payroll/payroll-item/store/increment.state';
import { DeductionState } from 'src/app/views/pages/payroll/payroll-item/store/deduction.state';
import { PayrollItemService } from 'src/app/views/pages/payroll/payroll-item/service/payroll-item.service';
import { OtherAccountState } from 'src/app/views/pages/finance/chat-of-account/store/other-account.state';
import { AccountReceivableState } from 'src/app/views/pages/finance/chat-of-account/store/account-receivable.state';
import { RoleState } from 'src/app/views/pages/access-management/store/role.state';
import { AccessManagementService } from 'src/app/views/pages/access-management/service/access-management.service';
import { UnitOfMeasurementState } from 'src/app/views/pages/profiling/unit-of-measurement/store/unit.state';
import { UnitOfMeasurementService } from 'src/app/views/pages/profiling/unit-of-measurement/service/unit-of-measurement.service';

@Injectable({
  providedIn: 'root'
})

export class NgxsCustomService {

  // constructor
  constructor(
    // services
    public businessPartnerService: BusinessPartnerService,
    public campusService: CampusService,
    public categoryService: CategoryService,
    public chartOfAccountService: ChartOfAccountService,
    public departmentService: DepartmentService,
    public designationService: DesignationService,
    public employeeService: EmployeeService,
    public locationService: LocationService,
    public organizationService: OrganizationService,
    public productService: ProductService,
    public warehouseService: WarehouseService,
    public payrollItemService: PayrollItemService,
    public unitOfMeasurementService: UnitOfMeasurementService,
    public cscService: CscService,
    public statusService: StatusService,
    public accessManagementService: AccessManagementService,
    public cashAccountService: CashAccountService,
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

  // Level 4 Accounts
  @Select(AccountLevel4State.entities) accountsLevel4$: Observable<any>;
  @Select(AccountLevel4State.isFetchCompleted) accountLevel4FetchCompleted$: Observable<any>;
  @Select(AccountLevel4State.isLoading) accountLevel4IsLoading$: Observable<any>;

  // Account Payable
  @Select(AccountPayableState.entities) accountsPayable$: Observable<any>;
  @Select(AccountPayableState.isFetchCompleted) accountPayableFetchCompleted$: Observable<any>;
  @Select(AccountPayableState.isLoading) accountPayableIsLoading$: Observable<any>;

  // Account Receivable
  @Select(AccountReceivableState.entities) accountsReceivable$: Observable<any>;
  @Select(AccountReceivableState.isFetchCompleted) accountReceivableFetchCompleted$: Observable<any>;
  @Select(AccountReceivableState.isLoading) accountReceivableIsLoading$: Observable<any>;

  // Other Accounts
  @Select(OtherAccountState.entities) otherAccounts$: Observable<any>;
  @Select(OtherAccountState.isFetchCompleted) otherAccountsFetchCompleted$: Observable<any>;
  @Select(OtherAccountState.isLoading) otherAccountsIsLoading$: Observable<any>;

  // Budget Accounts
  @Select(BudgetAccountState.entities) budgetAccount$: Observable<any>;
  @Select(BudgetAccountState.isFetchCompleted) budgetAccountFetchCompleted$: Observable<any>;
  @Select(BudgetAccountState.isLoading) budgetAccountIsLoading$: Observable<any>;


  // Category
  @Select(CategoryState.entities) categories$: Observable<any>;
  @Select(CategoryState.isFetchCompleted) categoryFetchCompleted$: Observable<any>;
  @Select(CategoryState.isLoading) categoryIsLoading$: Observable<any>;


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

  // Budget
  @Select(BudgetState.entities) budgets$: Observable<any>;
  @Select(BudgetState.isFetchCompleted) budgetFetchCompleted$: Observable<any>;
  @Select(BudgetState.isLoading) budgetIsLoading$: Observable<any>;

  // Product
  @Select(WarehouseState.entities) warehouses$: Observable<any>;
  @Select(WarehouseState.isFetchCompleted) warehouseFetchCompleted$: Observable<any>;
  @Select(WarehouseState.isLoading) warehouseIsLoading$: Observable<any>;
  //selector region end

  //finance module selectors
   // Bank Account
   @Select(BankAccountState.entities) bankAccounts$: Observable<any>;
   @Select(BankAccountState.isFetchCompleted) bankAccountFetchCompleted$: Observable<any>;
   @Select(BankAccountState.isLoading) bankAccountIsLoading$: Observable<any>;

   //Cash Account
   @Select(CashAccountState.entities) cashAccounts$: Observable<any>;
   @Select(CashAccountState.isFetchCompleted) cashAccountFetchCompleted$: Observable<any>;
   @Select(CashAccountState.isLoading) cashAccountIsLoading$: Observable<any>;


   //Department
   @Select(DepartmentState.entities) departments$: Observable<any>;
   @Select(DepartmentState.isFetchCompleted) departmentFetchCompleted$: Observable<any>;
   @Select(DepartmentState.isLoading) departmentIsLoading$: Observable<any>;


  //Designation
   @Select(DesignationState.entities) designations$: Observable<any>;
   @Select(DesignationState.isFetchCompleted) designationFetchCompleted$: Observable<any>;
   @Select(DesignationState.isLoading) designationIsLoading$: Observable<any>;


  //Employee
   @Select(EmployeeState.entities) employees$: Observable<any>;
   @Select(EmployeeState.isFetchCompleted) employeeFetchCompleted$: Observable<any>;
   @Select(EmployeeState.isLoading) employeeIsLoading$: Observable<any>;

   //Status
   @Select(StatusState.entities) statuses$: Observable<any>;
   @Select(StatusState.isFetchCompleted) statusFetchCompleted$: Observable<any>;
   @Select(StatusState.isLoading) statusIsLoading$: Observable<any>;

   // Basic Payroll Items
   @Select(BasicPayState.entities) basicPayrollItems$: Observable<any>;
   @Select(BasicPayState.isFetchCompleted) basicPayrollItemsFetchCompleted$: Observable<any>;
   @Select(BasicPayState.isLoading) basicPayrollItemsIsLoading$: Observable<any>;

   // Increments Payroll Items
   @Select(IncrementState.entities) incrementPayrollItems$: Observable<any>;
   @Select(IncrementState.isFetchCompleted) incrementPayrollItemsFetchCompleted$: Observable<any>;
   @Select(IncrementState.isLoading) incrementPayrollItemsIsLoading$: Observable<any>;

    // Deduction Payroll Items
   @Select(DeductionState.entities) deductionPayrollItems$: Observable<any>;
   @Select(DeductionState.isFetchCompleted) deductionPayrollItemsFetchCompleted$: Observable<any>;
   @Select(DeductionState.isLoading) deductionPayrollItemsIsLoading$: Observable<any>;

   // Roles
   @Select(RoleState.entities) roles$: Observable<any>;
   @Select(RoleState.isFetchCompleted) rolesFetchCompleted$: Observable<any>;
   @Select(RoleState.isLoading) rolesIsLoading$: Observable<any>;

   // Roles
   @Select(UnitOfMeasurementState.entities) units$: Observable<any>;
   @Select(UnitOfMeasurementState.isFetchCompleted) unitsFetchCompleted$: Observable<any>;
   @Select(UnitOfMeasurementState.isLoading) unitsIsLoading$: Observable<any>;


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
    this.budgetFetchCompleted$.subscribe((res) => {
      //console.log('Budget State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(BudgetState, {
          serviceClass: this.budgetService,
          methodName: 'getBudgetDropdown',
          context: this
        }))
      }
    })
  }

  // Get Status From Store if available else fetch from the server and cache.
  getStatusesFromState() {
    this.statusFetchCompleted$.subscribe((res) => {
      //console.log('Status State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(StatusState, {
          serviceClass: this.statusService,
          methodName: 'getStatusesDropdown',
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

  // Get All Payable Accounts State From Store if available else fetch from the server and cache.
  getAccountPayableFromState() {
    this.accountPayableFetchCompleted$.subscribe((res) => {
      //console.log('Account Payable FetchCompleted: ', res);
      if (!res) {
        this.store.dispatch(new GetList(AccountPayableState, {
          serviceClass: this.chartOfAccountService,
          methodName: 'getPayableAccounts',
          context: this
        }))
      }
    })
  }  

  // Get All Receivable Accounts State From Store if available else fetch from the server and cache.
  getAccountReceivableFromState() {
    this.accountReceivableFetchCompleted$.subscribe((res) => {
      //console.log('Account Receivable FetchCompleted: ', res);
      if (!res) {
        this.store.dispatch(new GetList(AccountReceivableState, {
          serviceClass: this.chartOfAccountService,
          methodName: 'getReceivableAccounts',
          context: this
        }))
      }
    })
  }  

  // Get All Other Accounts State From Store if available else fetch from the server and cache.
  getOtherAccountsFromState() {
    this.otherAccountsFetchCompleted$.subscribe((res) => {
      //console.log('Other Account FetchCompleted: ', res);
      if (!res) {
        this.store.dispatch(new GetList(OtherAccountState, {
          serviceClass: this.chartOfAccountService,
          methodName: 'getOtherAccounts',
          context: this
        }))
      }
    })
  }  

  // Get All Budget Accounts State From Store if available else fetch from the server and cache.
  getBudgetAccountsFromState() {
    this.budgetAccountFetchCompleted$.subscribe((res) => {
      //console.log('Budget Accounts FetchCompleted: ', res);
      if (!res) {
        this.store.dispatch(new GetList(BudgetAccountState, {
          serviceClass: this.chartOfAccountService,
          methodName: 'getBudgetAccounts',
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

  //Get Department From Store if available else fetch from the server and cache.
  getDepartmentFromState() {
    this.departmentFetchCompleted$.subscribe((res) => {
      console.log('Department State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(DepartmentState, {
          serviceClass: this.departmentService,
          methodName: 'getDepartmentsDropdown',
          context: this
        }))
      }
    })
  }

  // Get Designation From Store if available else fetch from the server and cache.
  getDesignationFromState() {
    this.designationFetchCompleted$.subscribe((res) => {
      console.log('Designation State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(DesignationState, {
          serviceClass: this.designationService,
          methodName: 'getDesignationsDropdown',
          context: this
        }))
      }
    })
  }

  //Get Employee From Store if available else fetch from the server and cache.
  getEmployeeFromState() {
    this.employeeFetchCompleted$.subscribe((res) => {
      console.log('Employee State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(EmployeeState, {
          serviceClass: this.employeeService,
          methodName: 'getEmployeesDropdown',
          context: this
        }))
      }
    })
  }

  getBasicPayFromState() {
    this.basicPayrollItemsFetchCompleted$.subscribe((res) => {
     // console.log('basicPayrollItemsFetchCompleted$: ', res);
      if (!res) {
        this.store.dispatch(new GetList(BasicPayState, {
          serviceClass: this.payrollItemService,
          methodName: 'getBasicPay',
          context: this
        }))
      }
    })
  }

  getIncrementsFromState() {
    this.incrementPayrollItemsFetchCompleted$.subscribe((res) => {
     // console.log('incrementPayrollItemsFetchCompleted$: ', res);
      if (!res) {
        this.store.dispatch(new GetList(IncrementState, {
          serviceClass: this.payrollItemService,
          methodName: 'getIncrements',
          context: this
        }))
      }
    })
  }

  getDeductionFromState() {
    this.deductionPayrollItemsFetchCompleted$.subscribe((res) => {
    //  console.log('otherPayrollItemsFetchCompleted$: ', res);
      if (!res) {
        this.store.dispatch(new GetList(DeductionState, {
          serviceClass: this.payrollItemService,
          methodName: 'getDeductions',
          context: this
        }))
      }
    })
  }


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

  // Get roles From Store if available else fetch from the server and cache.
  getUnitsFromState() {
    this.unitsFetchCompleted$.subscribe((res) => {
      //console.log('Role State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(UnitOfMeasurementState, {
          serviceClass: this.unitOfMeasurementService,
          methodName: 'getUnitsOfMeasurementDropdown',
          context: this
        }))
      }
    })
  }

  // Get Units From Store if available else fetch from the server and cache.
  getRolesFromState() {
    this.unitsFetchCompleted$.subscribe((res) => {
      //console.log('Unit State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(RoleState, {
          serviceClass: this.accessManagementService,
          methodName: 'getRolesDropdown',
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

  // Get Cash Account State From Store if available else fetch from the server and cache.
  getCashAccountFromState() {
    this.cashAccountFetchCompleted$.subscribe((res) => {
      //console.log('Cash Account State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(CashAccountState, {
          serviceClass: this.bankAccountService,
          methodName: 'getCashAccountsDropdown',
          context: this
        }))
      }
    })
  }

  










  //end state region 
}


