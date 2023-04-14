import {Injectable,} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {AccountLevel4State} from 'src/app/views/pages/finance/chat-of-account/store/account-level4.state';
import {BudgetAccountState} from 'src/app/core/shared-state/account-state/store/budget-account.state';

import {BudgetService} from 'src/app/views/pages/budget/current-budget/service/budget.service';
import {BudgetState} from 'src/app/views/pages/budget/current-budget/store/budget.state';
import {BankAccountService} from 'src/app/views/pages/finance/bank-account/service/bankAccount.service';
import {BankAccountState} from 'src/app/views/pages/finance/bank-account/store/bank-account.state';
import {CashAccountService} from 'src/app/views/pages/finance/cash-account/service/cashAccount.service';
import {CashAccountState} from 'src/app/views/pages/finance/cash-account/store/cash-account.state';
import {ChartOfAccountService} from 'src/app/views/pages/finance/chat-of-account/service/chart-of-account.service';
import {DepartmentService} from 'src/app/views/pages/payroll/department/service/department.service';
import {DepartmentState} from 'src/app/views/pages/payroll/department/store/department.store';
import {DesignationService} from 'src/app/views/pages/payroll/designation/service/designation.service';
import {DesignationState} from 'src/app/views/pages/payroll/designation/store/designation.store';
import {EmployeeService} from 'src/app/views/pages/payroll/employee/service/employee.service';
import {EmployeeState} from 'src/app/views/pages/payroll/employee/store/employee.state';
import {BusinessPartnerService} from 'src/app/views/pages/profiling/business-partner/service/businessPartner.service';

import {BusinessPartnerState} from 'src/app/views/pages/profiling/business-partner/store/business-partner.state';
import {CampusService} from 'src/app/views/pages/profiling/campus/service/campus.service';
import {CampusState} from 'src/app/views/pages/profiling/campus/store/campus.state';
import {CategoryService} from 'src/app/views/pages/profiling/category/service/category.service';
import {CategoryState} from 'src/app/views/pages/profiling/category/store/category.state';
import {OrganizationService} from 'src/app/views/pages/profiling/organization/services/organization.service';
import {ProductService} from 'src/app/views/pages/profiling/product/service/product.service';
import {ProductState} from 'src/app/views/pages/profiling/product/store/product.state.state';
import {GetList} from 'src/app/views/pages/profiling/store/profiling.action';
import {WarehouseService} from 'src/app/views/pages/profiling/warehouse/services/warehouse.service';
import {WarehouseState} from 'src/app/views/pages/profiling/warehouse/store/warehouse.state';
import {StatusState} from 'src/app/views/pages/workflows/status/store/status.state';
import {AccountPayableState} from 'src/app/views/pages/finance/chat-of-account/store/account-payable.state';
import {StatusService} from 'src/app/views/pages/workflows/status/service/status.service';
import {BasicPayState} from 'src/app/views/pages/payroll/payroll-item/store/basic-pay.state';
import {IncrementState} from 'src/app/views/pages/payroll/payroll-item/store/increment.state';
import {DeductionState} from 'src/app/views/pages/payroll/payroll-item/store/deduction.state';
import {PayrollItemService} from 'src/app/views/pages/payroll/payroll-item/service/payroll-item.service';
import {OtherAccountState} from 'src/app/views/pages/finance/chat-of-account/store/other-account.state';
import {AccountReceivableState} from 'src/app/views/pages/finance/chat-of-account/store/account-receivable.state';
import {RoleState} from 'src/app/views/pages/access-management/store/role.state';
import {AccessManagementService} from 'src/app/views/pages/access-management/service/access-management.service';
import {UnitOfMeasurementState} from 'src/app/views/pages/profiling/unit-of-measurement/store/unit.state';
import {UnitOfMeasurementService} from 'src/app/views/pages/profiling/unit-of-measurement/service/unit-of-measurement.service';
import {DepreciationModelState} from 'src/app/views/pages/fixed-asset/depreciation-model/store/depreciation-model.state';
import {DepreciationMethodService} from 'src/app/views/pages/fixed-asset/depreciation-model/service/depreciation-method.service';
import {AssetAccountState} from 'src/app/views/pages/finance/chat-of-account/store/asset-account.state';
import {EmployeePaymentState} from 'src/app/views/pages/payroll/employee/store/employeePayment.state';
import {AllBusinessPartnerState} from 'src/app/views/pages/profiling/business-partner/store/All-business-partner.state';
import {PayrollItemState} from 'src/app/views/pages/payroll/payroll-item/store/payroll-item.state';
import {RequisitionState} from 'src/app/views/pages/procurement/requisition/store/requisition.state';
import {RequisitionService} from 'src/app/views/pages/procurement/requisition/service/requisition.service';
import {CategoryAssetState} from 'src/app/views/pages/profiling/category/store/categoryAsset.state';
import {ExpenseAccountState} from 'src/app/views/pages/finance/chat-of-account/store/expense-account.state';
import {GetLiabilityAccountsState} from 'src/app/views/pages/finance/chat-of-account/store/getLiabilityAccount.state';
import {AssetService} from 'src/app/views/pages/fixed-asset/asset/service/asset.service';
import {AssetState} from '../../../pages/fixed-asset/store/asset.state';
import {DisposalDropdownState} from 'src/app/views/pages/fixed-asset/asset/store/disposal-dropdown.state';
import { FacultyState } from 'src/app/views/pages/admission/faculty/store/faculty.state';
import { FacultyService } from 'src/app/views/pages/admission/faculty/service/faculty.service';
import { DegreeService } from 'src/app/views/pages/admission/degree/service/degree.service';
import { DegreeState } from 'src/app/views/pages/admission/degree/store/degree.state';
import { QualificationState } from 'src/app/views/pages/admission/qualification/store/qualification.state';
import { QualificationService } from 'src/app/views/pages/admission/qualification/service/qualification.service';
import {CourseService} from '../../../pages/admission/course/service/course.service';
import {CourseState} from '../../../pages/admission/course/store/course.state';
import {SemesterService} from '../../../pages/admission/semester/services/semester.service';
import {SemesterState} from '../../../pages/admission/semester/store/semester.state';
import {CountryService} from '../../../pages/admission/country/service/country.service';
import {CountryState} from '../../../pages/admission/country/store/country.state';
import {StateService} from '../../../pages/admission/state/services/state.service';
import {CountryStateState} from '../../../pages/admission/state/store/country-state.state';
import {CityService} from '../../../pages/admission/city/services/city.service';
import {CityState} from '../../../pages/admission/city/store/city.state';
import {FeeItemService} from '../../../pages/admission/fee-item/services/fee-item.service';
import {FeeItemState} from '../../../pages/admission/fee-item/store/fee-item.state';
import { DomicileState } from 'src/app/views/pages/admission/domicile/store/domicile.state';
import { DomicileService } from 'src/app/views/pages/admission/domicile/service/domicile.service';
import { DistrictState } from 'src/app/views/pages/admission/district/store/district.state';
import { DistrictService } from 'src/app/views/pages/admission/district/service/district.service';
import {AcademicDepartmentState} from '../../../pages/admission/academic-department/store/academic-department.state';
import {AcademicDepartmentService} from '../../../pages/admission/academic-department/service/academic-department.service';
import {ShiftService} from '../../../pages/admission/shift/service/shift.service';
import {ShiftState} from '../../../pages/admission/shift/store/shift.state';
import {ProgramState} from '../../../pages/admission/program/store/program.state';
import {ProgramService} from '../../../pages/admission/program/service/program.service';
import {BatchService} from '../../../pages/admission/batch/service/batch.service';
import {BatchState} from '../../../pages/admission/batch/store/batch.state';
import {AdmissionCriteriaService} from '../../../pages/admission/admission-criteria/services/admission-criteria.service';
import {SubjectService} from '../../../pages/admission/subject/service/subject.service';
import {SubjectState} from '../../../pages/admission/subject/store/subject.state';

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
    public organizationService: OrganizationService,
    public productService: ProductService,
    public warehouseService: WarehouseService,
    public assetService: AssetService,
    public facultyService: FacultyService,
    public domicileService: DomicileService,
    public districtService: DistrictService,
    public degreeService: DegreeService,
    public qualificationService: QualificationService,
    public payrollItemService: PayrollItemService,
    public unitOfMeasurementService: UnitOfMeasurementService,
    public requisitionService: RequisitionService,
    public statusService: StatusService,
    public accessManagementService: AccessManagementService,
    public cashAccountService: CashAccountService,
    public bankAccountService: BankAccountService,
    public depreciationModelService: DepreciationMethodService,
    public budgetService: BudgetService,
    public courseService: CourseService,
    public semesterService: SemesterService,
    public countryService: CountryService,
    public stateService: StateService,
    public cityService: CityService,
    public feeItemService: FeeItemService,
    public academicDepartmentService: AcademicDepartmentService,
    public shiftService: ShiftService,
    public programService: ProgramService,
    public batchService: BatchService,
    public admissionCriteriaService: AdmissionCriteriaService,
    public subjectService: SubjectService,
    public store: Store,
  ) {
  }

  // selector region start

  // Admission

  // Subject
  @Select(SubjectState.entities) subjects$: Observable<any>;
  @Select(SubjectState.isFetchCompleted) subjectFetchCompleted$: Observable<any>;
  @Select(SubjectState.isLoading) subjectIsLoading$: Observable<any>;

  // Batch
  @Select(BatchState.entities) batches$: Observable<any>;
  @Select(BatchState.isFetchCompleted) batchFetchCompleted$: Observable<any>;
  @Select(BatchState.isLoading) batchIsLoading$: Observable<any>;

  // Program
  @Select(ProgramState.entities) programs$: Observable<any>;
  @Select(ProgramState.isFetchCompleted) programsFetchCompleted$: Observable<any>;
  @Select(ProgramState.isLoading) programsIsLoading$: Observable<any>;

  // Shift
  @Select(ShiftState.entities) shifts$: Observable<any>;
  @Select(ShiftState.isFetchCompleted) shiftsFetchCompleted$: Observable<any>;
  @Select(ShiftState.isLoading) shiftsIsLoading$: Observable<any>;

  // Academic Department
  @Select(AcademicDepartmentState.entities) academicDepartments$: Observable<any>;
  @Select(AcademicDepartmentState.isFetchCompleted) academicDepartmentsFetchCompleted$: Observable<any>;
  @Select(AcademicDepartmentState.isLoading) academicDepartmentsIsLoading$: Observable<any>;

  // Fee Item
  @Select(FeeItemState.entities) feeItems$: Observable<any>;
  @Select(FeeItemState.isFetchCompleted) feeItemsFetchCompleted$: Observable<any>;
  @Select(FeeItemState.isLoading) feeItemsIsLoading$: Observable<any>;

  // State
  @Select(CityState.entities) cities$: Observable<any>;
  @Select(CityState.isFetchCompleted) citiesFetchCompleted$: Observable<any>;
  @Select(CityState.isLoading) citiesIsLoading$: Observable<any>;

  // State
  @Select(CountryStateState.entities) countryStates$: Observable<any>;
  @Select(CountryStateState.isFetchCompleted) countryStateFetchCompleted$: Observable<any>;
  @Select(CountryStateState.isLoading) countryStateIsLoading$: Observable<any>;

  // Country
  @Select(CountryState.entities) countries$: Observable<any>;
  @Select(CountryState.isFetchCompleted) countriesFetchCompleted$: Observable<any>;
  @Select(CountryState.isLoading) countryIsLoading$: Observable<any>;

  // Semester
  @Select(SemesterState.entities) semesters$: Observable<any>;
  @Select(SemesterState.isFetchCompleted) semesterFetchCompleted$: Observable<any>;
  @Select(SemesterState.isLoading) semesterIsLoading$: Observable<any>;

  // Course
  @Select(CourseState.entities) courses$: Observable<any>;
  @Select(CourseState.isFetchCompleted) courseFetchCompleted$: Observable<any>;
  @Select(CourseState.isLoading) courseIsLoading$: Observable<any>;


  // Business Partner
  @Select(BusinessPartnerState.entities) businessPartners$: Observable<any>;
  @Select(BusinessPartnerState.isFetchCompleted) businessPartnerFetchCompleted$: Observable<any>;
  @Select(BusinessPartnerState.isLoading) businessPartnerIsLoading$: Observable<any>;

  // Fixed Asset
  @Select(AssetState.entities) assets$: Observable<any>;
  @Select(AssetState.isFetchCompleted) assetsFetchCompleted$: Observable<any>;
  @Select(AssetState.isLoading) assetsIsLoading$: Observable<any>;

  // Faculty
  @Select(FacultyState.entities) faculty$: Observable<any>;
  @Select(FacultyState.isFetchCompleted) facultyFetchCompleted$: Observable<any>;
  @Select(FacultyState.isLoading) facultyIsLoading$: Observable<any>;


  // domicile
  @Select(DomicileState.entities) domicile$: Observable<any>;
  @Select(DomicileState.isFetchCompleted) domicileFetchCompleted$: Observable<any>;
  @Select(DomicileState.isLoading) domicileIsLoading$: Observable<any>;

  // district
  @Select(DistrictState.entities) district$: Observable<any>;
  @Select(DistrictState.isFetchCompleted) districtFetchCompleted$: Observable<any>;
  @Select(DistrictState.isLoading) districtIsLoading$: Observable<any>;

  // Degree
  @Select(DegreeState.entities) degree$: Observable<any>;
  @Select(DegreeState.isFetchCompleted) degreeFetchCompleted$: Observable<any>;
  @Select(DegreeState.isLoading) degreeIsLoading$: Observable<any>;

  // Qualification
  @Select(QualificationState.entities) qualification$: Observable<any>;
  @Select(QualificationState.isFetchCompleted) qualificationFetchCompleted$: Observable<any>;
  @Select(QualificationState.isLoading) qualificationIsLoading$: Observable<any>;

  // All Business Partner with Employees
  @Select(AllBusinessPartnerState.entities) allBusinessPartners$: Observable<any>;
  @Select(AllBusinessPartnerState.isFetchCompleted) allBusinessPartnerFetchCompleted$: Observable<any>;
  @Select(AllBusinessPartnerState.isLoading) allBusinessPartnerIsLoading$: Observable<any>;

  // Campus
  @Select(CampusState.entities) campuses$: Observable<any>;
  @Select(CampusState.isFetchCompleted) campusFetchCompleted$: Observable<any>;
  @Select(CampusState.isLoading) campusIsLoading$: Observable<any>;

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

  // Fixed Asset Account
  @Select(AssetAccountState.entities) assetAccount$: Observable<any>;
  @Select(AssetAccountState.isFetchCompleted) assetAccountFetchCompleted$: Observable<any>;
  @Select(AssetAccountState.isLoading) assetAccountIsLoading$: Observable<any>;

  // Disposal Dropdown
  @Select(DisposalDropdownState.entities) disposalDropdown$: Observable<any>;
  @Select(DisposalDropdownState.isFetchCompleted) disposalDropdownFetchCompleted$: Observable<any>;
  @Select(DisposalDropdownState.isLoading) disposalDropdownIsLoading$: Observable<any>;

  // Other Accounts
  @Select(OtherAccountState.entities) otherAccounts$: Observable<any>;
  @Select(OtherAccountState.isFetchCompleted) otherAccountsFetchCompleted$: Observable<any>;
  @Select(OtherAccountState.isLoading) otherAccountsIsLoading$: Observable<any>;

  // Budget Accounts
  @Select(BudgetAccountState.entities) budgetAccount$: Observable<any>;
  @Select(BudgetAccountState.isFetchCompleted) budgetAccountFetchCompleted$: Observable<any>;
  @Select(BudgetAccountState.isLoading) budgetAccountIsLoading$: Observable<any>;

  // Expense Accounts
  @Select(ExpenseAccountState.entities) expenseAccount$: Observable<any>;
  @Select(ExpenseAccountState.isFetchCompleted) expenseAccountFetchCompleted$: Observable<any>;
  @Select(ExpenseAccountState.isLoading) expenseAccountIsLoading$: Observable<any>;

  // Liability Accounts
  @Select(GetLiabilityAccountsState.entities) getLiabilityAccounts$: Observable<any>;
  @Select(GetLiabilityAccountsState.isFetchCompleted) getLiabilityAccountsFetchCompleted$: Observable<any>;
  @Select(GetLiabilityAccountsState.isLoading) getLiabilityAccountsIsLoading$: Observable<any>;


  // Category
  @Select(CategoryState.entities) categories$: Observable<any>;
  @Select(CategoryState.isFetchCompleted) categoryFetchCompleted$: Observable<any>;
  @Select(CategoryState.isLoading) categoryIsLoading$: Observable<any>;

  // Category Asset
  @Select(CategoryAssetState.entities) categoriesAsset$: Observable<any>;
  @Select(CategoryAssetState.isFetchCompleted) categoriesAssetFetchCompleted$: Observable<any>;
  @Select(CategoryAssetState.isLoading) categoriesAssetIsLoading$: Observable<any>;

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
  // selector region end

  // finance module selectors
  // Bank Account
  @Select(BankAccountState.entities) bankAccounts$: Observable<any>;
  @Select(BankAccountState.isFetchCompleted) bankAccountFetchCompleted$: Observable<any>;
  @Select(BankAccountState.isLoading) bankAccountIsLoading$: Observable<any>;

  // Cash Account
  @Select(CashAccountState.entities) cashAccounts$: Observable<any>;
  @Select(CashAccountState.isFetchCompleted) cashAccountFetchCompleted$: Observable<any>;
  @Select(CashAccountState.isLoading) cashAccountIsLoading$: Observable<any>;

  // Department
  @Select(DepartmentState.entities) departments$: Observable<any>;
  @Select(DepartmentState.isFetchCompleted) departmentFetchCompleted$: Observable<any>;
  @Select(DepartmentState.isLoading) departmentIsLoading$: Observable<any>;

  // Designation
  @Select(DesignationState.entities) designations$: Observable<any>;
  @Select(DesignationState.isFetchCompleted) designationFetchCompleted$: Observable<any>;
  @Select(DesignationState.isLoading) designationIsLoading$: Observable<any>;

  // Employee
  @Select(EmployeeState.entities) employees$: Observable<any>;
  @Select(EmployeeState.isFetchCompleted) employeeFetchCompleted$: Observable<any>;
  @Select(EmployeeState.isLoading) employeeIsLoading$: Observable<any>;

  // Employee Payments
  @Select(EmployeePaymentState.entities) employeePayments$: Observable<any>;
  @Select(EmployeePaymentState.isFetchCompleted) employeePaymentsFetchCompleted$: Observable<any>;
  @Select(EmployeePaymentState.isLoading) employeePaymentsIsLoading$: Observable<any>;

  // Status
  @Select(StatusState.entities) statuses$: Observable<any>;
  @Select(StatusState.isFetchCompleted) statusFetchCompleted$: Observable<any>;
  @Select(StatusState.isLoading) statusIsLoading$: Observable<any>;

  // Payroll Items
  @Select(PayrollItemState.entities) payrollItems$: Observable<any>;
  @Select(PayrollItemState.isFetchCompleted) payrollItemsFetchCompleted$: Observable<any>;
  @Select(PayrollItemState.isLoading) payrollItemsIsLoading$: Observable<any>;

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

  // Depreciation Model
  @Select(DepreciationModelState.entities) depreciationModels$: Observable<any>;
  @Select(DepreciationModelState.isFetchCompleted) depreciationModelsFetchCompleted$: Observable<any>;
  @Select(DepreciationModelState.isLoading) depreciationModelsIsLoading$: Observable<any>;

  // Requisition
  @Select(RequisitionState.entities) requisitions$: Observable<any>;
  @Select(RequisitionState.isFetchCompleted) requisitionsFetchCompleted$: Observable<any>;
  @Select(RequisitionState.isLoading) requisitionsIsLoading$: Observable<any>;


  //region State Management

  // Get Business Partner From Store if available else fetch from the server and cache.
  getBusinessPartnerFromState() {
    this.businessPartnerFetchCompleted$.subscribe((res) => {
      // console.log('Business Partner State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(BusinessPartnerState, {
          serviceClass: this.businessPartnerService,
          methodName: 'getBusinessPartnersDropdown',
          context: this
        }))
      }
    })
  }

  // Get All Business Partner With Employee From Store if available else fetch from the server and cache.
  getAllBusinessPartnerFromState() {
    this.allBusinessPartnerFetchCompleted$.subscribe((res) => {
      if (!res) {
        this.store.dispatch(new GetList(AllBusinessPartnerState, {
          serviceClass: this.businessPartnerService,
          methodName: 'getAllBusinessPartnersDropdown',
          context: this
        }))
      }
    })
  }

  // Get Campus From Store if available else fetch from the server and cache.
  getCampusFromState() {
    this.campusFetchCompleted$.subscribe((res) => {
      // console.log('Campus State fetch completed: ', res);
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
      // console.log('Budget State fetch completed: ', res);
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
      // console.log('Status State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(StatusState, {
          serviceClass: this.statusService,
          methodName: 'getStatusesDropdown',
          context: this
        }))
      }
    })
  }

  // Get All Level 4 Accounts State From Store if available else fetch from the server and cache.
  getAccountLevel4FromState() {
    this.accountLevel4FetchCompleted$.subscribe((res) => {
      // console.log('Account level 4 FetchCompleted: ', res);
      if (!res) {
        this.store.dispatch(new GetList(AccountLevel4State, {
          serviceClass: this.chartOfAccountService,
          methodName: 'getLevel4AccountsDropdown',
          context: this
        }))
      }
    })
  }

  // Get All Asset Accounts State From Store if available else fetch from the server and cache.
  getAssetAccountFromState() {
    this.assetAccountFetchCompleted$.subscribe((res) => {
      if (!res) {
        this.store.dispatch(new GetList(AssetAccountState, {
          serviceClass: this.chartOfAccountService,
          methodName: 'getAssetAccounts',
          context: this
        }))
      }
    })
  }

  // Get All Asset Accounts State From Store if available else fetch from the server and cache.
  getDisposaldropdownFromState() {
    this.disposalDropdownFetchCompleted$.subscribe((res) => {
      if (!res) {
        this.store.dispatch(new GetList(DisposalDropdownState, {
          serviceClass: this.assetService,
          methodName: 'getAssetsDisposalDropdown',
          context: this
        }))
      }
    })
  }

  // Get All Category Assets State From Store if available else fetch from the server and cache.
  getCategoryAssetFromState() {
    this.categoriesAssetFetchCompleted$.subscribe((res) => {
      if (!res) {
        this.store.dispatch(new GetList(CategoryAssetState, {
          serviceClass: this.categoryService,
          methodName: 'getCategoryAssetsDropdown',
          context: this
        }))
      }
    })
  }

  // Get All Payable Accounts State From Store if available else fetch from the server and cache.
  getAccountPayableFromState() {
    this.accountPayableFetchCompleted$.subscribe((res) => {
      // console.log('Account Payable FetchCompleted: ', res);
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
      // console.log('Account Receivable FetchCompleted: ', res);
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
      // console.log('Other Account FetchCompleted: ', res);
      if (!res) {
        this.store.dispatch(new GetList(OtherAccountState, {
          serviceClass: this.chartOfAccountService,
          methodName: 'getOtherAccounts',
          context: this
        }))
      }
    })
  }

  // Get Expense Accounts State From Store if available else fetch from the server and cache.
  getExpenseAccountsFromState() {
    this.expenseAccountFetchCompleted$.subscribe((res) => {
      // console.log('Other Account FetchCompleted: ', res);
      if (!res) {
        this.store.dispatch(new GetList(ExpenseAccountState, {
          serviceClass: this.chartOfAccountService,
          methodName: 'getExpenseAccounts',
          context: this
        }))
      }
    })
  }

  // Get All Other Accounts State From Store if available else fetch from the server and cache.
  getLiabilityAccountsFromState() {
    this.getLiabilityAccountsFetchCompleted$.subscribe((res) => {
      // console.log('Other Account FetchCompleted: ', res);
      if (!res) {
        this.store.dispatch(new GetList(GetLiabilityAccountsState, {
          serviceClass: this.chartOfAccountService,
          methodName: 'getLiabilityAccounts',
          context: this
        }))
      }
    })
  }

  // Get All Budget Accounts State From Store if available else fetch from the server and cache.
  getBudgetAccountsFromState() {
    this.budgetAccountFetchCompleted$.subscribe((res) => {
      // console.log('Budget Accounts FetchCompleted: ', res);
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
      // console.log('Category State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(CategoryState, {
          serviceClass: this.categoryService,
          methodName: 'getCategoriesDropdown',
          context: this
        }))
      }
    })
  }

  // Get Department From Store if available else fetch from the server and cache.
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

  // Get Employee From Store if available else fetch from the server and cache.
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

  // Get Employee Payments From Store if available else fetch from the server and cache.
  getEmployeePaymentsFromState() {
    this.employeePaymentsFetchCompleted$.subscribe((res) => {
      console.log('Employee Payment State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(EmployeePaymentState, {
          serviceClass: this.employeeService,
          methodName: 'getEmployeePaymentDropdown',
          context: this
        }))
      }
    })
  }

  getPayrollItemsFromState() {
    this.payrollItemsFetchCompleted$.subscribe((res) => {
      // console.log('payrollItemsFetchCompleted$: ', res);
      if (!res) {
        this.store.dispatch(new GetList(PayrollItemState, {
          serviceClass: this.payrollItemService,
          methodName: 'getPayrollItemsDropdown',
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
      // console.log('Product State fetch completed: ', res);
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
      // console.log('Warehouse State fetch completed: ', res);
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
      // console.log('Role State fetch completed: ', res);
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
      // console.log('Unit State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(RoleState, {
          serviceClass: this.accessManagementService,
          methodName: 'getRolesDropdown',
          context: this
        }))
      }
    })
  }

  // finance module selector methods
  // Get Bank Account State From Store if available else fetch from the server and cache.
  getBankAccountFromState() {
    this.bankAccountFetchCompleted$.subscribe((res) => {
      // console.log('Bank Account State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(BankAccountState, {
          serviceClass: this.bankAccountService,
          methodName: 'getBankAccountsDropdown',
          context: this
        }))
      }
    })
  }

  // Get Bank Account State From Store if available else fetch from the server and cache.
  getAssetsFromState() {
    this.assetsFetchCompleted$.subscribe((res) => {
      // console.log('Bank Account State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(AssetState, {
          serviceClass: this.assetService,
          methodName: 'getAssetsDropdown',
          context: this
        }))
      }
    })
  }

  // getFacultyFromState State From Store if available else fetch from the server and cache.
  getFacultyFromState() {
    this.facultyFetchCompleted$.subscribe((res) => {
      // console.log('Faculty State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(FacultyState, {
          serviceClass: this.facultyService,
          methodName: 'getFacultyDropdown',
          context: this
        }))
      }
    })
  }


  // getFacultyFromState State From Store if available else fetch from the server and cache.
  getDomicileFromState() {
    this.domicileFetchCompleted$.subscribe((res) => {
      console.log('Domicile State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(DomicileState, {
          serviceClass: this.domicileService,
          methodName: 'getDomicileDropdown',
          context: this
        }))
      }
    })
  }


  // getDistrictFromState State From Store if available else fetch from the server and cache.

  getDistrictFromState() {
    this.districtFetchCompleted$.subscribe((res) => {
      console.log('District State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(DistrictState, {
          serviceClass: this.districtService,
          methodName: 'getDistrictDropdown',
          context: this
        }))
      }
    })
  }


  // getDegreeFromState From Store if available else fetch from the server and cache.
  getDegreeFromState() {
    this.degreeFetchCompleted$.subscribe((res) => {
      console.log('Degree State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(DegreeState, {
          serviceClass: this.degreeService,
          methodName: 'getDegreeDropdown',
          context: this
        }))
      }
    })
  }

  // Get QualificationFromState From Store if available else fetch from the server and cache.
  getQualificationFromState() {
    this.qualificationFetchCompleted$.subscribe((res) => {
      console.log('Qualification State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(QualificationState, {
          serviceClass: this.qualificationService,
          methodName: 'getQualificationDropdown',
          context: this
        }))
      }
    })
  }

  // Get Cash Account State From Store if available else fetch from the server and cache.
  getCashAccountFromState() {
    this.cashAccountFetchCompleted$.subscribe((res) => {
      // console.log('Cash Account State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(CashAccountState, {
          serviceClass: this.bankAccountService,
          methodName: 'getCashAccountsDropdown',
          context: this
        }))
      }
    })
  }

  // Get Depreciation Model State From Store if available else fetch from the server and cache.
  getDepreciationModelFromState() {
    this.depreciationModelsFetchCompleted$.subscribe((res) => {
      // console.log('Depreciation Model State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(DepreciationModelState, {
          serviceClass: this.depreciationModelService,
          methodName: 'getDepreciationModelsDropdown',
          context: this
        }))
      }
    })
  }

  // Get Requisition From Store if available else fetch from the server and cache.
  getRequisitionFromState() {
    this.requisitionsFetchCompleted$.subscribe((res) => {
      // console.log('Requisition State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(RequisitionState, {
          serviceClass: this.requisitionService,
          methodName: 'getRequisitionDropdown',
          context: this
        }))
      }
    })
  }

  // Get Country From Store if available else fetch from the server and cache.
  getCountryFromState() {
    this.countriesFetchCompleted$.subscribe((res) => {
      // console.log('Requisition State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(CountryState, {
          serviceClass: this.countryService,
          methodName: 'getForDropdown',
          context: this
        }))
      }
    })
  }

  // Get City From Store if available else fetch from the server and cache.
  getCityFromState() {
    this.citiesFetchCompleted$.subscribe((res) => {
      // console.log('Requisition State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(CityState, {
          serviceClass: this.cityService,
          methodName: 'getForDropdown',
          context: this
        }))
      }
    })
  }

  // Get City From Store if available else fetch from the server and cache.
  getCountryStateFromState() {
    this.countryStateFetchCompleted$.subscribe((res) => {
      // console.log('Requisition State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(CountryStateState, {
          serviceClass: this.stateService,
          methodName: 'getForDropdown',
          context: this
        }))
      }
    })
  }
  // Get City From Store if available else fetch from the server and cache.
  getFeeItemsFromState() {
    this.feeItemsFetchCompleted$.subscribe((res) => {
      // console.log('Requisition State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(FeeItemState, {
          serviceClass: this.feeItemService,
          methodName: 'getForDropdown',
          context: this
        }))
      }
    })
  }

  getAcademicDepartmentsFromState() {
    this.academicDepartmentsFetchCompleted$.subscribe((res) => {
      // console.log('Requisition State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(AcademicDepartmentState, {
          serviceClass: this.academicDepartmentService,
          methodName: 'getForDropdown',
          context: this
        }))
      }
    })
  }

  getCoursesFromState() {
    this.courseFetchCompleted$.subscribe((res) => {
      // console.log('Requisition State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(CourseState, {
          serviceClass: this.courseService,
          methodName: 'getForDropdown',
          context: this
        }))
      }
    })
  }

  getProgramsFromState() {
    this.programsFetchCompleted$.subscribe((res) => {
      // console.log('Requisition State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(ProgramState, {
          serviceClass: this.programService,
          methodName: 'getForDropdown',
          context: this
        }))
      }
    })
  }
  getShiftsFromState() {
    this.shiftsFetchCompleted$.subscribe((res) => {
      // console.log('Requisition State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(ShiftState, {
          serviceClass: this.shiftService,
          methodName: 'getForDropdown',
          context: this
        }))
      }
    })
  }
  getSemestersFromState() {
    this.semesterFetchCompleted$.subscribe((res) => {
      // console.log('Requisition State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(SemesterState, {
          serviceClass: this.semesterService,
          methodName: 'getForDropdown',
          context: this
        }))
      }
    })
  }

  getBatchFromState() {
    this.batchFetchCompleted$.subscribe((res) => {
      // console.log('Requisition State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(BatchState, {
          serviceClass: this.batchService,
          methodName: 'getForDropdown',
          context: this
        }))
      }
    })
  }

  getSubjectFromState() {
    this.subjectFetchCompleted$.subscribe((res) => {
      // console.log('Requisition State fetch completed: ', res);
      if (!res) {
        this.store.dispatch(new GetList(SubjectState, {
          serviceClass: this.subjectService,
          methodName: 'getForDropdown',
          context: this
        }))
      }
    })
  }

  // end state region
}
