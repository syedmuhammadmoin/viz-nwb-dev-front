import {Injectable,} from '@angular/core';
import {Store} from '@ngxs/store';
import {AccountLevel4State} from 'src/app/views/pages/finance/chat-of-account/store/account-level4.state';

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
import {FacultyState } from 'src/app/views/pages/admission/faculty/store/faculty.state';
import {FacultyService } from 'src/app/views/pages/admission/faculty/service/faculty.service';
import {DegreeService } from 'src/app/views/pages/admission/degree/service/degree.service';
import {DegreeState } from 'src/app/views/pages/admission/degree/store/degree.state';
import {QualificationState } from 'src/app/views/pages/admission/qualification/store/qualification.state';
import {QualificationService } from 'src/app/views/pages/admission/qualification/service/qualification.service';
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
import {DomicileState } from 'src/app/views/pages/admission/domicile/store/domicile.state';
import {DomicileService } from 'src/app/views/pages/admission/domicile/service/domicile.service';
import {DistrictState } from 'src/app/views/pages/admission/district/store/district.state';
import {DistrictService } from 'src/app/views/pages/admission/district/service/district.service';
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
import {BudgetAccountState } from 'src/app/views/pages/budget/current-budget/store/budget-account.state';
import { DefaultAccountState } from 'src/app/views/pages/finance/journal/store/journal.state';

@Injectable({
  providedIn: 'root'
})

export class NgxsCustomService {

  /** Subject */
  subjects$: any;
  subjectFetchCompleted$: any;
  subjectIsLoading$: any;

  /** Batch */
  batches$: any;
  batchFetchCompleted$: any;
  batchIsLoading$: any;

  /** Program */
  programs$: any;
  programsFetchCompleted$: any;
  programsIsLoading$: any;

  /** Shift */
  shifts$: any;
  shiftsFetchCompleted$: any;
  shiftsIsLoading$: any;

  /** Academic Department */
  academicDepartments$: any;
  academicDepartmentsFetchCompleted$: any;
  academicDepartmentsIsLoading$: any;

  /** Fee Item */
  feeItems$: any;
  feeItemsFetchCompleted$: any;
  feeItemsIsLoading$: any;

  /** City */
  cities$: any;
  citiesFetchCompleted$: any;
  citiesIsLoading$: any;

  /** State */
  countryStates$: any;
  countryStateFetchCompleted$: any;
  countryStateIsLoading$: any;

  /** Country */
  countries$: any;
  countriesFetchCompleted$: any;
  countryIsLoading$: any;

  /** Semester */
  semesters$: any;
  semesterFetchCompleted$: any;
  semesterIsLoading$: any;

  /** Course */
  courses$: any;
  courseFetchCompleted$: any;
  courseIsLoading$: any;

  /** Business Partner */
  businessPartners$: any;
  businessPartnerFetchCompleted$: any;
  businessPartnerIsLoading$: any;

  /** Fixed Asset */
  assets$: any;
  assetsFetchCompleted$: any;
  assetsIsLoading$: any;

  /** Faculty */
  faculty$: any;
  facultyFetchCompleted$: any;
  facultyIsLoading$: any;

  /** Domicile */
  domicile$: any;
  domicileFetchCompleted$: any;
  domicileIsLoading$: any;

  /** District */
  district$: any;
  districtFetchCompleted$: any;
  districtIsLoading$: any;

  /** Degree */
  degree$: any;
  degreeFetchCompleted$: any;
  degreeIsLoading$: any;

  /** Qualification */
  qualification$: any;
  qualificationFetchCompleted$: any;
  qualificationIsLoading$: any;

  /** All Business Partner with Employees */
  allBusinessPartners$: any;
  allBusinessPartnerFetchCompleted$: any;
  allBusinessPartnerIsLoading$: any;

  /** Campus */
  campuses$: any;
  campusFetchCompleted$: any;
  campusIsLoading$: any;

  /** Level 4 Accounts */
  accountsLevel4$: any;
  accountLevel4FetchCompleted$: any;
  accountLevel4IsLoading$: any;

  /** Account Payable */
  accountsPayable$: any;
  accountPayableFetchCompleted$: any;
  accountPayableIsLoading$: any;

  /** Account Receivable */
  accountsReceivable$: any;
  accountReceivableFetchCompleted$: any;
  accountReceivableIsLoading$: any;

  /** Fixed Asset Account */
  assetAccount$: any;
  assetAccountFetchCompleted$: any;
  assetAccountIsLoading$: any;

  /** Fixed Asset Account */
  disposalDropdown$: any;
  disposalDropdownFetchCompleted$: any;
  disposalDropdownIsLoading$: any;

  /** Other Accounts */
  otherAccounts$: any;
  otherAccountsFetchCompleted$: any;
  otherAccountsIsLoading$: any;

  /** Budget Accounts */
  budgetAccount$: any;
  budgetAccountFetchCompleted$: any;
  budgetAccountIsLoading$: any;

  /** Expense Accounts */
  expenseAccount$: any;
  expenseAccountFetchCompleted$: any;
  expenseAccountIsLoading$: any;

  /** Liability Accounts */
  getLiabilityAccounts$: any;
  getLiabilityAccountsFetchCompleted$: any;
  getLiabilityAccountsIsLoading$: any;

  /** Category */
  categories$: any;
  categoryFetchCompleted$: any;
  categoryIsLoading$: any;

  /** Category Asset */
  categoriesAsset$: any;
  categoriesAssetFetchCompleted$: any;
  categoriesAssetIsLoading$: any;

  /** Product */
  products$: any;
  productFetchCompleted$: any;
  productIsLoading$: any;

  /** Budget */
  budgets$: any;
  budgetFetchCompleted$: any;
  budgetIsLoading$: any;

  /** Warehouse */
  warehouses$: any;
  warehouseFetchCompleted$: any;
  warehouseIsLoading$: any;

  /** Bank Account */
  bankAccounts$: any;
  bankAccountFetchCompleted$: any;
  bankAccountIsLoading$: any;


  /** Default Account */
  defaultAccounts$: any;
  defaultAccountFetchCompleted$: any;
  defaultAccountIsLoading$: any;

  /** Cash Account */
  cashAccounts$: any;
  cashAccountFetchCompleted$: any;
  cashAccountIsLoading$: any;

  /** Department */
  departments$: any;
  departmentFetchCompleted$: any;
  departmentIsLoading$: any;

  /** Designation */
  designations$: any;
  designationFetchCompleted$: any;
  designationIsLoading$: any;

  /** Employee */
  employees$: any;
  employeeFetchCompleted$: any;
  employeeIsLoading$: any;

  /** Employee Payments */
  employeePayments$: any;
  employeePaymentsFetchCompleted$: any;
  employeePaymentsIsLoading$: any;

  /** Status */
  statuses$: any;
  statusFetchCompleted$: any;
  statusIsLoading$: any;

  /** Payroll Items */
  payrollItems$: any;
  payrollItemsFetchCompleted$: any;
  payrollItemsIsLoading$: any;

  /** Basic Payroll Items */
  basicPayrollItems$: any;
  basicPayrollItemsFetchCompleted$: any;
  basicPayrollItemsIsLoading$: any;

  /** Increments Payroll Items */
  incrementPayrollItems$: any;
  incrementPayrollItemsFetchCompleted$: any;
  incrementPayrollItemsIsLoading$: any;

  /** Deduction Payroll Items */
  deductionPayrollItems$: any;
  deductionPayrollItemsFetchCompleted$: any;
  deductionPayrollItemsIsLoading$: any;

  /** Roles */
  roles$: any;
  rolesFetchCompleted$: any;
  rolesIsLoading$: any;

  /** Unit of Measurement */
  units$: any;
  unitsFetchCompleted$: any;
  unitsIsLoading$: any;

  /** Depreciation Model */
  depreciationModels$: any;
  depreciationModelsFetchCompleted$: any;
  depreciationModelsIsLoading$: any;

  /** Requisition */
  requisitions$: any;
  requisitionsFetchCompleted$: any;
  requisitionsIsLoading$: any;

  constructor(
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

    /** Subject */
    this.subjects$ = this.store.select(SubjectState.entities);
    this.subjectFetchCompleted$ = this.store.select(SubjectState.isFetchCompleted);
    this.subjectIsLoading$ = this.store.select(SubjectState.isLoading);

    /** Batch */
    this.batches$ = this.store.select(BatchState.entities);
    this.batchFetchCompleted$ = this.store.select(BatchState.isFetchCompleted);
    this.batchIsLoading$ = this.store.select(BatchState.isLoading);

    /** Program */
    this.programs$ = this.store.select(ProgramState.entities);
    this.programsFetchCompleted$ = this.store.select(ProgramState.isFetchCompleted);
    this.programsIsLoading$ = this.store.select(ProgramState.isLoading);

    /** Shift */
    this.shifts$ = this.store.select(ShiftState.entities);
    this.shiftsFetchCompleted$ = this.store.select(ShiftState.isFetchCompleted);
    this.shiftsIsLoading$ = this.store.select(ShiftState.isLoading);

    /** Academic Department */
    this.academicDepartments$ = this.store.select(AcademicDepartmentState.entities);
    this.academicDepartmentsFetchCompleted$ = this.store.select(AcademicDepartmentState.isFetchCompleted);
    this.academicDepartmentsIsLoading$ = this.store.select(AcademicDepartmentState.isLoading);

    /** Fee Item */
    this.feeItems$ = this.store.select(FeeItemState.entities);
    this.feeItemsFetchCompleted$ = this.store.select(FeeItemState.isFetchCompleted);
    this.feeItemsIsLoading$ = this.store.select(FeeItemState.isLoading);

    /** City */
    this.cities$ = this.store.select(CityState.entities);
    this.citiesFetchCompleted$ = this.store.select(CityState.isFetchCompleted);
    this.citiesIsLoading$ = this.store.select(CityState.isLoading);

    /** State */
    this.countryStates$ = this.store.select(CountryStateState.entities);
    this.countryStateFetchCompleted$ = this.store.select(CountryStateState.isFetchCompleted);
    this.countryStateIsLoading$ = this.store.select(CountryStateState.isLoading);

    /** Country */
    this.countries$ = this.store.select(CountryState.entities);
    this.countriesFetchCompleted$ = this.store.select(CountryState.isFetchCompleted);
    this.countryIsLoading$ = this.store.select(CountryState.isLoading);

    /** Semester */
    this.semesters$ = this.store.select(SemesterState.entities);
    this.semesterFetchCompleted$ = this.store.select(SemesterState.isFetchCompleted);
    this.semesterIsLoading$ = this.store.select(SemesterState.isLoading);

    /** Course */
    this.courses$ = this.store.select(CourseState.entities);
    this.courseFetchCompleted$ = this.store.select(CourseState.isFetchCompleted);
    this.courseIsLoading$ = this.store.select(CourseState.isLoading);

    /** Business Partner */
    this.businessPartners$ = this.store.select(BusinessPartnerState.entities);
    this.businessPartnerFetchCompleted$ = this.store.select(BusinessPartnerState.isFetchCompleted);
    this.businessPartnerIsLoading$ = this.store.select(BusinessPartnerState.isLoading);

    /** Fixed Asset */
    this.assets$ = this.store.select(AssetState.entities);
    this.assetsFetchCompleted$ = this.store.select(AssetState.isFetchCompleted);
    this.assetsIsLoading$ = this.store.select(AssetState.isLoading);

    /** Faculty */
    this.faculty$ = this.store.select(FacultyState.entities);
    this.facultyFetchCompleted$ = this.store.select(FacultyState.isFetchCompleted);
    this.facultyIsLoading$ = this.store.select(FacultyState.isLoading);

    /** Domicile */
    this.domicile$ = this.store.select(DomicileState.entities);
    this.domicileFetchCompleted$ = this.store.select(DomicileState.isFetchCompleted);
    this.domicileIsLoading$ = this.store.select(DomicileState.isLoading);

    /** District */
    this.district$ = this.store.select(DistrictState.entities);
    this.districtFetchCompleted$ = this.store.select(DistrictState.isFetchCompleted);
    this.districtIsLoading$ = this.store.select(DistrictState.isLoading);

    /** Degree */
    this.degree$ = this.store.select(DegreeState.entities);
    this.degreeFetchCompleted$ = this.store.select(DegreeState.isFetchCompleted);
    this.degreeIsLoading$ = this.store.select(DegreeState.isLoading);

    /** Qualification */
    this.qualification$ = this.store.select(QualificationState.entities);
    this.qualificationFetchCompleted$ = this.store.select(QualificationState.isFetchCompleted);
    this.qualificationIsLoading$ = this.store.select(QualificationState.isLoading);

    /** All Business Partner with Employees */
    this.allBusinessPartners$ = this.store.select(AllBusinessPartnerState.entities);
    this.allBusinessPartnerFetchCompleted$ = this.store.select(AllBusinessPartnerState.isFetchCompleted);
    this.allBusinessPartnerIsLoading$ = this.store.select(AllBusinessPartnerState.isLoading);

    /** Campus */
    this.campuses$ = this.store.select(CampusState.entities);
    this.campusFetchCompleted$ = this.store.select(CampusState.isFetchCompleted);
    this.campusIsLoading$ = this.store.select(CampusState.isLoading);

    /** Level 4 Accounts */
    this.accountsLevel4$ = this.store.select(AccountLevel4State.entities);
    this.accountLevel4FetchCompleted$ = this.store.select(AccountLevel4State.isFetchCompleted);
    this.accountLevel4IsLoading$ = this.store.select(AccountLevel4State.isLoading);

    /** Account Payable */
    this.accountsPayable$ = this.store.select(AccountPayableState.entities);
    this.accountPayableFetchCompleted$ = this.store.select(AccountPayableState.isFetchCompleted);
    this.accountPayableIsLoading$ = this.store.select(AccountPayableState.isLoading);

    /** Account Receivable */
    this.accountsReceivable$ = this.store.select(AccountReceivableState.entities);
    this.accountReceivableFetchCompleted$ = this.store.select(AccountReceivableState.isFetchCompleted);
    this.accountReceivableIsLoading$ = this.store.select(AccountReceivableState.isLoading);

    /** Fixed Asset Account */
    this.assetAccount$ = this.store.select(AssetAccountState.entities);
    this.assetAccountFetchCompleted$ = this.store.select(AssetAccountState.isFetchCompleted);
    this.assetAccountIsLoading$ = this.store.select(AssetAccountState.isLoading);

    /** Fixed Asset Account */
    this.disposalDropdown$ = this.store.select(DisposalDropdownState.entities);
    this.disposalDropdownFetchCompleted$ = this.store.select(DisposalDropdownState.isFetchCompleted);
    this.disposalDropdownIsLoading$ = this.store.select(DisposalDropdownState.isLoading);

    /** Other Accounts */
    this.otherAccounts$ = this.store.select(OtherAccountState.entities);
    this.otherAccountsFetchCompleted$ = this.store.select(OtherAccountState.isFetchCompleted);
    this.otherAccountsIsLoading$ = this.store.select(OtherAccountState.isLoading);

    /** Budget Accounts */
    this.budgetAccount$ = this.store.select(BudgetAccountState.entities);
    this.budgetAccountFetchCompleted$ = this.store.select(BudgetAccountState.isFetchCompleted);
    this.budgetAccountIsLoading$ = this.store.select(BudgetAccountState.isLoading);

    /** Expense Accounts */
    this.expenseAccount$ = this.store.select(ExpenseAccountState.entities);
    this.expenseAccountFetchCompleted$ = this.store.select(ExpenseAccountState.isFetchCompleted);
    this.expenseAccountIsLoading$ = this.store.select(ExpenseAccountState.isLoading);

    /** Liability Accounts */
    this.getLiabilityAccounts$ = this.store.select(GetLiabilityAccountsState.entities);
    this.getLiabilityAccountsFetchCompleted$ = this.store.select(GetLiabilityAccountsState.isFetchCompleted);
    this.getLiabilityAccountsIsLoading$ = this.store.select(GetLiabilityAccountsState.isLoading);

    /** Category */
    this.categories$ = this.store.select(CategoryState.entities);
    this.categoryFetchCompleted$ = this.store.select(CategoryState.isFetchCompleted);
    this.categoryIsLoading$ = this.store.select(CategoryState.isLoading);

    /** Category Asset */
    this.categoriesAsset$ = this.store.select(CategoryAssetState.entities);
    this.categoriesAssetFetchCompleted$ = this.store.select(CategoryAssetState.isFetchCompleted);
    this.categoriesAssetIsLoading$ = this.store.select(CategoryAssetState.isLoading);

    /** Product */
    this.products$ = this.store.select(ProductState.entities);
    this.productFetchCompleted$ = this.store.select(ProductState.isFetchCompleted);
    this.productIsLoading$ = this.store.select(ProductState.isLoading);

    /** Budget */
    this.budgets$ = this.store.select(BudgetState.entities);
    this.budgetFetchCompleted$ = this.store.select(BudgetState.isFetchCompleted);
    this.budgetIsLoading$ = this.store.select(BudgetState.isLoading);

    /** Warehouse */
    this.warehouses$ = this.store.select(WarehouseState.entities);
    this.warehouseFetchCompleted$ = this.store.select(WarehouseState.isFetchCompleted);
    this.warehouseIsLoading$ = this.store.select(WarehouseState.isLoading);

    /** Bank Account */
    this.bankAccounts$ = this.store.select(BankAccountState.entities);
    this.bankAccountFetchCompleted$ = this.store.select(BankAccountState.isFetchCompleted);
    this.bankAccountIsLoading$ = this.store.select(BankAccountState.isLoading);


    /** Default Account */
    this.defaultAccounts$ = this.store.select(DefaultAccountState.entities);
    this.defaultAccountFetchCompleted$ = this.store.select(DefaultAccountState.isFetchCompleted);
    this.defaultAccountIsLoading$ = this.store.select(DefaultAccountState.isLoading);

    /** Cash Account */
    this.cashAccounts$ = this.store.select(CashAccountState.entities);
    this.cashAccountFetchCompleted$ = this.store.select(CashAccountState.isFetchCompleted);
    this.cashAccountIsLoading$ = this.store.select(CashAccountState.isLoading);

    /** Department */
    this.departments$ = this.store.select(DepartmentState.entities);
    this.departmentFetchCompleted$ = this.store.select(DepartmentState.isFetchCompleted);
    this.departmentIsLoading$ = this.store.select(DepartmentState.isLoading);

    /** Designation */
    this.designations$ = this.store.select(DesignationState.entities);
    this.designationFetchCompleted$ = this.store.select(DesignationState.isFetchCompleted);
    this.designationIsLoading$ = this.store.select(DesignationState.isLoading);

    /** Employee */
    this.employees$ = this.store.select(EmployeeState.entities);
    this.employeeFetchCompleted$ = this.store.select(EmployeeState.isFetchCompleted);
    this.employeeIsLoading$ = this.store.select(EmployeeState.isLoading);

    /** Employee Payments */
    this.employeePayments$ = this.store.select(EmployeePaymentState.entities);
    this.employeePaymentsFetchCompleted$ = this.store.select(EmployeePaymentState.isFetchCompleted);
    this.employeePaymentsIsLoading$ = this.store.select(EmployeePaymentState.isLoading);

    /** Status */
    this.statuses$ = this.store.select(StatusState.entities);
    this.statusFetchCompleted$ = this.store.select(StatusState.isFetchCompleted);
    this.statusIsLoading$ = this.store.select(StatusState.isLoading);

    /** Payroll Items */
    this.payrollItems$ = this.store.select(PayrollItemState.entities);
    this.payrollItemsFetchCompleted$ = this.store.select(PayrollItemState.isFetchCompleted);
    this.payrollItemsIsLoading$ = this.store.select(PayrollItemState.isLoading);

    /** Basic Payroll Items */
    this.basicPayrollItems$ = this.store.select(BasicPayState.entities);
    this.basicPayrollItemsFetchCompleted$ = this.store.select(BasicPayState.isFetchCompleted);
    this.basicPayrollItemsIsLoading$ = this.store.select(BasicPayState.isLoading);

    /** Increments Payroll Items */
    this.incrementPayrollItems$ = this.store.select(IncrementState.entities);
    this.incrementPayrollItemsFetchCompleted$ = this.store.select(IncrementState.isFetchCompleted);
    this.incrementPayrollItemsIsLoading$ = this.store.select(IncrementState.isLoading);

    /** Deduction Payroll Items */
    this.deductionPayrollItems$ = this.store.select(DeductionState.entities);
    this.deductionPayrollItemsFetchCompleted$ = this.store.select(DeductionState.isFetchCompleted);
    this.deductionPayrollItemsIsLoading$ = this.store.select(DeductionState.isLoading);

    /** Roles */
    this.roles$ = this.store.select(RoleState.entities);
    this.rolesFetchCompleted$ = this.store.select(RoleState.isFetchCompleted);
    this.rolesIsLoading$ = this.store.select(RoleState.isLoading);

    /** Unit of Measurement */
    this.units$ = this.store.select(UnitOfMeasurementState.entities);
    this.unitsFetchCompleted$ = this.store.select(UnitOfMeasurementState.isFetchCompleted);
    this.unitsIsLoading$ = this.store.select(UnitOfMeasurementState.isLoading);

    /** Depreciation Model */
    this.depreciationModels$ = this.store.select(DepreciationModelState.entities);
    this.depreciationModelsFetchCompleted$ = this.store.select(DepreciationModelState.isFetchCompleted);
    this.depreciationModelsIsLoading$ = this.store.select(DepreciationModelState.isLoading);

    /** Requisition */
    this.requisitions$ = this.store.select(RequisitionState.entities);
    this.requisitionsFetchCompleted$ = this.store.select(RequisitionState.isFetchCompleted);
    this.requisitionsIsLoading$ = this.store.select(RequisitionState.isLoading); 
  }


  // Get Business Partner From Store if available else fetch from the server and cache.
  getBusinessPartnerFromState() {
    this.businessPartnerFetchCompleted$.subscribe((res) => {
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
      if (!res) {
        this.store.dispatch(new GetList(RoleState, {
          serviceClass: this.accessManagementService,
          methodName: 'getRolesDropdown',
          context: this
        }))
      }
    })
  }

  // Get Bank Account State From Store if available else fetch from the server and cache.
  getBankAccountFromState() {
    this.bankAccountFetchCompleted$.subscribe((res) => {
      if (!res) {
        this.store.dispatch(new GetList(BankAccountState, {
          serviceClass: this.bankAccountService,
          methodName: 'getBankAccountsDropdown',
          context: this
        }))
      }
    })
  }

  geAccountFromState() {
    this.bankAccountFetchCompleted$.subscribe((res) => {
      if (!res) {
        this.store.dispatch(new GetList(BankAccountState, {
          serviceClass: this.bankAccountService,
          methodName: 'getDefaultAccountsDropdown',
          context: this
        }))
      }
    })
  }

  // Get Bank Account State From Store if available else fetch from the server and cache.
  getAssetsFromState() {
    this.assetsFetchCompleted$.subscribe((res) => {
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
      if (!res) {
        this.store.dispatch(new GetList(SubjectState, {
          serviceClass: this.subjectService,
          methodName: 'getForDropdown',
          context: this
        }))
      }
    })
  }
}
