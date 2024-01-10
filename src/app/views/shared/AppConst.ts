import {Criteria, DocType, Nature} from './AppEnum';



interface Config {
  readonly title: string;
  readonly isCampus: boolean
  readonly descriptionMessage: string
  readonly logo: string
  readonly bgImage: string
  readonly bg_gradient_color_one: string
  readonly bg_gradient_color_two: string
  readonly bg_white: string
  readonly primary_color: string
  readonly secondary_color: string
  readonly input_filed_primary_color: string
  readonly input_filed_background_color: string
  readonly input_filed_border_color: string
  readonly form_border_color: string
  readonly test_shadow_color: string
  readonly button_background_color: string
  readonly light_gray_color: string
  readonly toggler_arrow_color: string
  readonly home_logo_bg: string
  readonly db_dd_t_c: string
  readonly login_title: string
  readonly login_cover_image: string
  readonly site_logo: string
  readonly dashboard_hight: string
  readonly dashboard_logo_width: string
  readonly dashboard_logo_hight: string
  readonly chart_color: string[]
  readonly site_title: string
  readonly fav_icon: string
  readonly edinfini_true: boolean
  readonly nawabshah_true: boolean
  readonly vizalys_true: boolean
  readonly print_logo : string
} 
 
interface Client {
  readonly clientId: number;
  readonly config: Config;
}

export class AppConst {

  static appBaseUrl: string;
  static remoteServiceBaseUrl: string;
  static appBaseHref: string;
  static apiKey: string;
  static clientId: number;
  static ClientConfig: Client;

  static ProductType = {
    0: 'Consumable',
    1: 'Service',
    2: 'Fixed Asset'
  }
  static ConsumableOrService = {
    1: 'Consumable',
    2: 'Service'
  }
  static docType = {
    0: 'Payment',
    1: 'CreditNote',
    2: 'DebitNote'
  };
  static ConsileOrReconcile = {
    0: 'Unconciled',
    1: 'Partial',
    2: 'Reconciled'
  }
  static EmployeeType = [
    {id: 1, name: 'Permanent'},
    {id: 2, name: 'Contractual'},
    {id: 3, name: 'Daily wages'},
    {id: 4, name: 'Adhoc'}
  ];
  static status = {
    0: 'Pending',
    1: 'Partial',
    2: 'Paid'
  }

  static depreciationMethod = [
    {id: 0, name: 'Straight Line'},
    {id: 1, name: 'Declining Rate'},

  ]

  static paymentType = {
    1: 'Inflow',
    2: 'Outflow'
  }
  static PermissionsDisplayName = {

    // Business Partner
    'Profiling.BusinessPartner.CR': 'Business Partner Create',
    'Profiling.BusinessPartner.VW': 'Business Partner View',
    'Profiling.BusinessPartner.ED': 'Business Partner Update',
    'Profiling.BusinessPartner.DL': 'Business Partner Delete',

    // Invoice
    'Finance.Invoice.CR': 'Invoice Create',
    'Finance.Invoice.VW': 'Invoice View',
    'Finance.Invoice.ED': 'Invoice Update',
    'Finance.Invoice.DL': 'Invoice Delete',
    'Finance.Invoice.Review': 'Invoice Review',
    'Finance.Invoice.Approve': 'Invoice Approve',

    // Bank Account
    'Finance.BankAccount.VW': 'Bank Account View',
    'Finance.BankAccount.CR': 'Bank Account Create',
    'Finance.BankAccount.ED': 'Bank Account Update',
    'Finance.BankAccount.DL': 'Bank Account Delete',

    // Bank Statement
    'Finance.BankStatement.VW': 'Bank Statement View',
    'Finance.BankStatement.CR': 'Bank Statement Create',
    'Finance.BankStatement.ED': 'Bank Statement Update',
    'Finance.BankStatement.DL': 'Bank Statement Delete',

    // Business Partner Entities
    'Profiling.BusinessPartnerEntities.VW': 'Business Partner Entities View',
    'Profiling.BusinessPartnerEntities.CR': 'Business Partner Entities Create',
    'Profiling.BusinessPartnerEntities.ED': 'Business Partner Entities Update',
    'Profiling.BusinessPartnerEntities.DL': 'Business Partner Entities Delete',

    // Business Partner type
    'Profiling.BusinessPartnerTypes.VW': 'Business Partner Type View',
    'Profiling.BusinessPartnerTypes.CR': 'Business Partner Type Create',
    'Profiling.BusinessPartnerTypes.ED': 'Business Partner Type Update',
    'Profiling.BusinessPartnerTypes.DL': 'Business Partner Type Delete',

    // Campus
    'Profiling.Campus.VW': 'Campus View',
    'Profiling.Campus.CR': 'Campus Create',
    'Profiling.Campus.ED': 'Campus Update',
    'Profiling.Campus.DL': 'Campus Delete',

    // Cash Account
    'Finance.CashAccount.VW': 'Cash Account View',
    'Finance.CashAccount.CR': 'Cash Account Create',
    'Finance.CashAccount.ED': 'Cash Account Update',
    'Finance.CashAccount.DL': 'Cash Account Delete',

    // Category
    'Profiling.Categories.VW': 'Category View',
    'Profiling.Categories.CR': 'Category Create',
    'Profiling.Categories.ED': 'Category Update',
    'Profiling.Categories.DL': 'Category Delete',

    // Chart of Account
    'Finance.ChartOfAccount.VW': 'Chart of Account View',

    // Country
    'Profiling.Country.VW': 'Country View',
    'Profiling.Country.CR': 'Country Create',
    'Profiling.Country.ED': 'Country Update',
    'Profiling.Country.DL': 'Country Delete',

    // State
    'Profiling.State.VW': 'State View',
    'Profiling.State.CR': 'State Create',
    'Profiling.State.ED': 'State Update',
    'Profiling.State.DL': 'State Delete',

    // City
    'Profiling.City.VW': 'City View',
    'Profiling.City.CR': 'City Create',
    'Profiling.City.ED': 'City Update',
    'Profiling.City.DL': 'City Delete',

    // Department
    'Payroll.Department.VW': 'Department View',
    'Payroll.Department.CR': 'Department Create',
    'Payroll.Department.ED': 'Department Update',
    'Payroll.Department.DL': 'Department Delete',

    // Designation
    'Payroll.Designation.VW': 'Designation View',
    'Payroll.Designation.CR': 'Designation Create',
    'Payroll.Designation.ED': 'Designation Update',
    'Payroll.Designation.DL': 'Designation Delete',

    // Employee
    'Payroll.Employee.VW': 'Employee View',
    'Payroll.Employee.CR': 'Employee Create',
    'Payroll.Employee.ED': 'Employee Update',
    'Payroll.Employee.DL': 'Employee Delete',

    // Organization
    'Profiling.Organization.VW': 'Organization View',
    'Profiling.Organization.CR': 'Organization Create',
    'Profiling.Organization.ED': 'Organization Update',
    'Profiling.Organization.DL': 'Organization Delete',

    // Payroll Item
    'Payroll.PayrollItem.VW': 'Payroll Item View',
    'Payroll.PayrollItem.CR': 'Payroll Item Create',
    'Payroll.PayrollItem.ED': 'Payroll Item Update',
    'Payroll.PayrollItem.DL': 'Payroll Item Delete',

    // Payroll Transaction
    'Payroll.PayrollTransaction.VW': 'Payroll Transaction View',
    'Payroll.PayrollTransaction.CR': 'Payroll Transaction Create',
    'Payroll.PayrollTransaction.ED': 'Payroll Transaction Update',
    'Payroll.PayrollTransaction.DL': 'Payroll Transaction Delete',
    'Payroll.PayrollTransaction.Review': 'Payroll Transaction Review',
    'Payroll.PayrollTransaction.Approve': 'Payroll Transaction Approve',

    // Allowance
    'Payroll.AllowanceReport.VW': 'Allowance Report View',

    // Product
    'Profiling.Products.VW': 'Product View',
    'Profiling.Products.CR': 'Product Create',
    'Profiling.Products.ED': 'Product Update',
    'Profiling.Products.DL': 'Product Delete',

    // Tax
    'Profiling.Taxes.VW': 'Tax View',
    'Profiling.Taxes.CR': 'Tax Create',
    'Profiling.Taxes.ED': 'Tax Update',
    'Profiling.Taxes.DL': 'Tax Delete',

    // Unit Of Measurement
    'Profiling.UnitOfMeasurement.VW': 'Unit Of Measurement View',
    'Profiling.UnitOfMeasurement.CR': 'Unit Of Measurement Create',
    'Profiling.UnitOfMeasurement.ED': 'Unit Of Measurement Update',
    'Profiling.UnitOfMeasurement.DL': 'Unit Of Measurement Delete',

    // Vehicle
    'Vehicle.VW': 'Vehicle View',
    'Vehicle.CR': 'Vehicle Create',
    'Vehicle.ED': 'Vehicle Update',
    'Vehicle.DL': 'Vehicle Delete',

    // Level 3
    'Finance.Level3.VW': 'Chart of Account Level 3 View',
    'Finance.Level3.CR': 'Chart of Account Level 3 Create',
    'Finance.Level3.ED': 'Chart of Account Level 3 Update',
    'Finance.Level3.DL': 'Chart of Account Level 3 Delete',

    // Level 4
    'Finance.Level4.VW': 'Chart of Account Level 4 View',
    'Finance.Level4.CR': 'Chart of Account Level 4 Create',
    'Finance.Level4.ED': 'Chart of Account Level 4 Update',
    'Finance.Level4.DL': 'Chart of Account Level 4 Delete',

    // Balance Sheet
    'Report.BalanceSheet.VW': 'Balance Sheet',

    // General Ledger
    'Report.GeneralLedger.VW': 'General Ledger',

    // Income Expenditure
    'Report.ProfitLoss.VW': 'Income & Expenditure',

    // Trial Balance
    'Report.TrialBalance.VW': 'Trial Balance',

    // Bill
    'Finance.Bill.VW': 'Bill View',
    'Finance.Bill.CR': 'Bill Create',
    'Finance.Bill.ED': 'Bill Update',
    'Finance.Bill.DL': 'Bill Delete',
    'Finance.Bill.Review': 'Bill Review',
    'Finance.Bill.Approve': 'Bill Approve',

    // Payment
    'Finance.Payment.VW': 'Payment View',
    'Finance.Payment.CR': 'Payment Create',
    'Finance.Payment.ED': 'Payment Update',
    'Finance.Payment.DL': 'Payment Delete',
    'Finance.Payment.Review': 'Payment Review',
    'Finance.Payment.Approve': 'Payment Approve',

    // Internal Receipt
    'Finance.Receipt.VW': 'Receipt View',
    'Finance.Receipt.CR': 'Receipt Create',
    'Finance.Receipt.ED': 'Receipt Update',
    'Finance.Receipt.DL': 'Receipt Delete',
    'Finance.Receipt.Review': 'Receipt Review',
    'Finance.Receipt.Approve': 'Receipt Approve',

    // Payroll Payment
    'Payroll.PayrollPayment.VW': 'Payroll Payment View',
    'Payroll.PayrollPayment.CR': 'Payroll Payment Create',
    'Payroll.PayrollPayment.ED': 'Payroll Payment Update',
    'Payroll.PayrollPayment.DL': 'Payroll Payment Delete',

    // Credit Note
    'Finance.CreditNote.VW': 'Credit Note View',
    'Finance.CreditNote.CR': 'Credit Note Create',
    'Finance.CreditNote.ED': 'Credit Note Update',
    'Finance.CreditNote.DL': 'Credit Note Delete',
    'Finance.CreditNote.Review': 'Credit Note Review',
    'Finance.CreditNote.Approve': 'Credit Note Approve',

    // Debit Note
    'Finance.DebitNote.VW': 'Debit Note View',
    'Finance.DebitNote.CR': 'Debit Note Create',
    'Finance.DebitNote.ED': 'Debit Note Update',
    'Finance.DebitNote.DL': 'Debit Note Delete',
    'Finance.DebitNote.Review': 'Debit Note Review',
    'Finance.DebitNote.Approve': 'Debit Note Approve',

    // Journal Voucher
    'Finance.JournalEntry.VW': 'Journal Voucher View',
    'Finance.JournalEntry.CR': 'Journal Voucher Create',
    'Finance.JournalEntry.ED': 'Journal Voucher Update',
    'Finance.JournalEntry.DL': 'Journal Voucher Delete',
    'Finance.JournalEntry.Review': 'Journal Voucher Review',
    'Finance.JournalEntry.Approve': 'Journal Voucher Approve',

    // Journal Voucher
    'Finance.PettyCash.VW': 'Petty Cash View',
    'Finance.PettyCash.CR': 'Petty Cash Create',
    'Finance.PettyCash.ED': 'Petty Cash Update',
    'Finance.PettyCash.DL': 'Petty Cash Delete',
    'Finance.PettyCash.Review': 'Petty Cash Review',
    'Finance.PettyCash.Approve': 'Petty Cash Approve',

    // Access Management
    'AccessManagement.Auth.CR': 'Access Management Create',
    'AccessManagement.Auth.VW': 'Access Management View',
    'AccessManagement.Auth.ED': 'Access Management Update',
    'AccessManagement.Auth.DL': 'Access Management Delete',

    // Workflow
    'Workflow.Workflow.CR': 'Workflow Create',
    'Workflow.Workflow.VW': 'Workflow View',
    'Workflow.Workflow.ED': 'Workflow Update',
    'Workflow.Workflow.DL': 'Workflow Delete',

    // Status
    'Workflow.WorkflowStatus.CR': 'Status Create',
    'Workflow.WorkflowStatus.VW': 'Status View',
    'Workflow.WorkflowStatus.ED': 'Status Update',
    'Workflow.WorkflowStatus.DL': 'Status Delete',

    // Bank Reconciliation
    'Finance.BankRecon.CR': 'Bank Reconciliation Create',
    'Finance.BankRecon.VW': 'Bank Reconciliation View',
    'Finance.BankRecon.ED': 'Bank Reconciliation Update',
    'Finance.BankRecon.DL': 'Bank Reconciliation Delete',

    // Budget
    'Budget.Budget.VW': 'Budget View',
    'Budget.Budget.CR': 'Budget Create',
    'Budget.Budget.ED': 'Budget Update',
    'Budget.Budget.DL': 'Budget Delete',
    'Budget.BudgetReport.VW': 'Budget Report View',

    'Budget.EstimatedBudget.VW': 'Anticipated Budget View',
    'Budget.EstimatedBudget.CR': 'Anticipated Budget Create',
    'Budget.EstimatedBudget.ED': 'Anticipated Budget Update',
    'Budget.EstimatedBudget.DL': 'Anticipated Budget Delete',
    'Budget.EstimatedBudgetReport.VW': 'Anticipated Budget Report View',

    'Budget.BudgetReappropriation.VW': 'Re-Appropriation Budget View',
    'Budget.BudgetReappropriation.CR': 'Re-Appropriation Budget Create',
    'Budget.BudgetReappropriation.ED': 'Re-Appropriation Budget Update',
    'Budget.BudgetReappropriation.DL': 'Re-Appropriation Budget Delete',
    'Budget.BudgetReappropriationReport.VW': 'Re-Appropriation Budget Report View',

    // Location
    'Profiling.Location.VW': 'Location View',
    'Profiling.Location.CR': 'Location Create',
    'Profiling.Location.ED': 'Location Update',
    'Profiling.Location.DL': 'Location Delete',

    //  Warehouse
    'Profiling.Warehouse.VW': 'Store View',
    'Profiling.Warehouse.CR': 'Store Create',
    'Profiling.Warehouse.ED': 'Store Update',
    'Profiling.Warehouse.DL': 'Store Delete',

    //  purchase Order
    'Procurement.PurchaseOrder.VW': 'Purchase Order View',
    'Procurement.PurchaseOrder.CR': 'Purchase Order Create',
    'Procurement.PurchaseOrder.ED': 'Purchase Order Update',
    'Procurement.PurchaseOrder.DL': 'Purchase Order Delete',

    // Requisition
    'Procurement.Requisition.VW': 'Requisition View',
    'Procurement.Requisition.CR': 'Requisition Create',
    'Procurement.Requisition.ED': 'Requisition Update',
    'Procurement.Requisition.DL': 'Requisition Delete',

    // Quatation
    'Procurement.Quotation.VW': 'Quotation View',
    'Procurement.Quotation.CR': 'Quotation Create',
    'Procurement.Quotation.ED': 'Quotation Update',
    'Procurement.Quotation.DL': 'Quotation Delete',

    // Quatation Comparative
    'Procurement.QuotationComparative.VW': 'Quotation Comparative View',
    'Procurement.QuotationComparative.CR': 'Quotation Comparative Create',
    'Procurement.QuotationComparative.ED': 'Quotation Comparative Update',
    'Procurement.QuotationComparative.DL': 'Quotation Comparative Delete',

    // Call Quatation
    'Procurement.CallForQuotation.VW': 'Call Quotation View',
    'Procurement.CallForQuotation.CR': 'Call Quotation Create',
    'Procurement.CallForQuotation.ED': 'Call Quotation Update',
    'Procurement.CallForQuotation.DL': 'Call Quotation Delete',

    // Request Requisition
    'Procurement.Request.VW': 'Request Requisition View',
    'Procurement.Request.CR': 'Request Requisition Create',
    'Procurement.Request.ED': 'Request Requisition Update',
    'Procurement.Request.DL': 'Request Requisition Delete',

    // Bid Evaluation
    'Procurement.BidEvaluation.VW': 'Bid Evaluation View',
    'Procurement.BidEvaluation.CR': 'Bid Evaluation Create',
    'Procurement.BidEvaluation.ED': 'Bid Evaluation Update',
    'Procurement.BidEvaluation.DL': 'Bid Evaluation Delete',

    // GRN
    'Procurement.GRN.VW': 'Goods Receive Note View',
    'Procurement.GRN.CR': 'Goods Receive Note Create',
    'Procurement.GRN.ED': 'Goods Receive Note Update',
    'Procurement.GRN.DL': 'Goods Receive Note Delete',

    // Goods Return Note
    'Procurement.GoodsReturnNote.VW': 'Goods Return Note View',
    'Procurement.GoodsReturnNote.CR': 'Goods Return Note Create',
    'Procurement.GoodsReturnNote.ED': 'Goods Return Note Update',
    'Procurement.GoodsReturnNote.DL': 'Goods Return Note Delete',

    // ISSUANCE
    'Procurement.Issuance.VW': 'Issuance View',
    'Procurement.Issuance.CR': 'Issuance Create',
    'Procurement.Issuance.ED': 'Issuance Update',
    'Procurement.Issuance.DL': 'Issuance Delete',

    // ISSUANCE RETURN
    'Procurement.IssuanceReturn.VW': 'Issuance Return View',
    'Procurement.IssuanceReturn.CR': 'Issuance Return Create',
    'Procurement.IssuanceReturn.ED': 'Issuance Return Update',
    'Procurement.IssuanceReturn.DL': 'Issuance Return Delete',

    // Stock
    'Procurement.Stock.VW': 'Inventory View',

    // Transaction Recon
    'Finance.TransactionRecon.VW': 'Transaction Reconcile View',
    'Finance.TransactionRecon.CR': 'Transaction Reconcile Create',
    'Finance.TransactionRecon.ED': 'Transaction Reconcile Update',
    'Finance.TransactionRecon.DL': 'Transaction Reconcile Delete',

    // Asset Category
    'AssetCategory.VW': 'Asset Category View',
    'AssetCategory.CR': 'Asset Category Create',
    'AssetCategory.ED': 'Asset Category Update',
    'AssetCategory.DL': 'Asset Category Delete',

    // Depreciation Model
    'FixedAsset.DepreciationModel.VW': 'Depreciation Model View',
    'FixedAsset.DepreciationModel.CR': 'Depreciation Model Create',
    'FixedAsset.DepreciationModel.ED': 'Depreciation Model Update',
    'FixedAsset.DepreciationModel.DL': 'Depreciation Model Delete',

    // Asset
    'FixedAsset.FixedAsset.VW': 'Fixed Asset View',
    'FixedAsset.FixedAsset.CR': 'Fixed Asset Create',
    'FixedAsset.FixedAsset.ED': 'Fixed Asset Update',
    'FixedAsset.FixedAsset.DL': 'Fixed Asset Delete',
    'FixedAsset.FixedAssetReport.VW': 'Fixed Asset Report',

    // CWIP
    'FixedAsset.CWIP.VW': 'CWIP View',
    'FixedAsset.CWIP.CR': 'CWIP Create',
    'FixedAsset.CWIP.ED': 'CWIP Update',
    'FixedAsset.CWIP.DL': 'CWIP Delete',


    // Disposal
    'FixedAsset.Disposal.VW': 'Disposal View',
    'FixedAsset.Disposal.CR': 'Disposal Create',
    'FixedAsset.Disposal.ED': 'Disposal Update',
    'FixedAsset.Disposal.DL': 'Disposal Delete',

    // Depreciation Adjustment
    'FixedAsset.DepreciationAdjustment.VW': 'Depreciation Adjustment View',
    'FixedAsset.DepreciationAdjustment.CR': 'Depreciation Adjustment Create',
    'FixedAsset.DepreciationAdjustment.ED': 'Depreciation Adjustment Update',
    'FixedAsset.DepreciationAdjustment.DL': 'Depreciation Adjustment Delete',


    // Program
    'Admission.Program.VW': 'Program View',
    'Admission.Program.CR': 'Program Create',
    'Admission.Program.ED': 'Program Update',
    'Admission.Program.DL': 'Program Delete',

    'Admission.Faculty.VW': 'Faculty View',
    'Admission.Faculty.CR': 'Faculty Create',
    'Admission.Faculty.ED': 'Faculty Edit',
    'Admission.Faculty.DL': 'Faculty Delete',

    'Admission.AcademicDepartment.VW': 'Academic Department View',
    'Admission.AcademicDepartment.CR': 'Academic Department Create',
    'Admission.AcademicDepartment.ED': 'Academic Department Edit',
    'Admission.AcademicDepartment.DL': 'Academic Department Delete',

    'Admission.Degree.VW': 'Degree View',
    'Admission.Degree.CR': 'Degree Create',
    'Admission.Degree.ED': 'Degree Edit',
    'Admission.Degree.DL': 'Degree Delete',

    'Admission.Semester.VW': 'Semester View',
    'Admission.Semester.CR': 'Semester Create',
    'Admission.Semester.ED': 'Semester Edit',
    'Admission.Semester.DL': 'Semester Delete',

    'Admission.Course.VW': 'Course View',
    'Admission.Course.CR': 'Course Create',
    'Admission.Course.ED': 'Course Edit',
    'Admission.Course.DL': 'Course Delete',

    'Admission.Qualification.VW': 'Qualification View',
    'Admission.Qualification.CR': 'Qualification Create',
    'Admission.Qualification.ED': 'Qualification Edit',
    'Admission.Qualification.DL': 'Qualification Delete',

    'Admission.Subject.VW': 'Subject View',
    'Admission.Subject.CR': 'Subject Create',
    'Admission.Subject.ED': 'Subject Edit',
    'Admission.Subject.DL': 'Subject Delete',

    'Admission.FeeItem.VW': 'Fee Item View',
    'Admission.FeeItem.CR': 'Fee Item Create',
    'Admission.FeeItem.ED': 'Fee Item Edit',
    'Admission.FeeItem.DL': 'Fee Item Delete',

    'Admission.Country.VW': 'Country View',
    'Admission.Country.CR': 'Country Create',
    'Admission.Country.ED': 'Country Edit',
    'Admission.Country.DL': 'Country Delete',

    'Admission.State.VW': 'State View',
    'Admission.State.CR': 'State Create',
    'Admission.State.ED': 'State Edit',
    'Admission.State.DL': 'State Delete',

    'Admission.City.VW': 'City View',
    'Admission.City.CR': 'City Create',
    'Admission.City.ED': 'City Edit',
    'Admission.City.DL': 'City Delete',

    'Admission.District.VW': 'District View',
    'Admission.District.CR': 'District Create',
    'Admission.District.ED': 'District Edit',
    'Admission.District.DL': 'District Delete',

    'Admission.Domicile.VW': 'Domicile View',
    'Admission.Domicile.CR': 'Domicile Create',
    'Admission.Domicile.ED': 'Domicile Edit',
    'Admission.Domicile.DL': 'Domicile Delete',

    'Admission.Applicant.CR': 'Applicant View',
    'Admission.Applicant.VW': 'Applicant Create',
    'Admission.Applicant.ED': 'Applicant Edit',
    'Admission.Applicant.DL': 'Applicant Delete',

    'Admission.Shift.CR': 'Shift Create',
    'Admission.Shift.VW': 'Shift View',
    'Admission.Shift.ED': 'Shift Edit',
    'Admission.Shift.DL': 'Shift Delete',

    'Admission.Batch.CR': 'Batch Create',
    'Admission.Batch.VW': 'Batch View',
    'Admission.Batch.ED': 'Batch Edit',
    'Admission.Batch.DL': 'Batch Delete',

    'Admission.AdmissionCriteria.CR': 'Admission Criteria Create',
    'Admission.AdmissionCriteria.VW': 'Admission Criteria View',
    'Admission.AdmissionCriteria.ED': 'Admission Criteria Edit',
    'Admission.AdmissionCriteria.DL': 'Admission Criteria Delete',
  }

  static paymentRegisterType = {
    1: 'Cash Account',
    2: 'Bank Account'
  }

  static DocStatus = {
    0: {value: 'Draft', viewValue: 'Draft'},
    1: {value: 'Rejected', viewValue: 'Rejected'},
    2: {value: 'Unpaid', viewValue: 'Approved'},
    3: {value: 'Partial', viewValue: 'Partial'},
    4: {value: 'Paid', viewValue: 'Paid'},
    5: {value: 'Submitted', viewValue: 'Submitted'},
    6: {value: 'Reviewed', viewValue: 'Reviewed'},
    7: {value: 'Cancelled', viewValue: 'Cancelled'}
  }

  static workflowStates = [
    {viewValue: 'Approved', value: 'Unpaid', id: 2},
    {viewValue: 'Reviewed', value: 'Reviewed', id: 6},
  ]

  static Documents = [
    {value: 'Payment', id: DocType.Payment, route: 'voucher'},
    {value: 'Credit Note', id: DocType.CreditNote},
    {value: 'Debit Note', id: DocType.DebitNote},
    {value: 'Invoice', id: DocType.Invoice},
    {value: 'Bill', id: DocType.Bill},
    {value: 'Journal Entry', id: DocType.JournalEntry},
    {value: 'Bank Account', id: DocType.BankAccount},
    {value: 'Cash Account', id: DocType.CashAccount},
    {value: 'Purchase Order', id: DocType.PurchaseOrder},
    {value: 'Goods Received Note', id: DocType.GRN},
    {value: 'Quotation', id: DocType.Quotation},
    {value: 'Requisition', id: DocType.Requisition},
    {value: 'Receipt', id: DocType.Receipt, route: 'receipt'},
    {value: 'Payroll Transaction', id: DocType.PayrollTransaction},
    {value: 'Payroll Payment', id: DocType.PayrollPayment, route: 'payroll-payment'},
    {value: 'Issuance', id: DocType.Issuance},
    {value: 'Goods Return Note', id: DocType.GoodsReturnNote},
    {value: 'Issuance Return', id: DocType.IssuanceReturn},
    {value: 'Request Requisition', id: DocType.Request},
    {value: 'Bid Evaluation', id: DocType.BidEvaluation},
    {value: 'Call Quotation', id: DocType.CallForQuotaion},
    {value: 'Fixed Asset', id: DocType.FixedAsset},
    {value: 'CWIP ', id: DocType.CWIP},
    {value: 'Disposal', id: DocType.Disposal},
    {value: 'Budget Reappropriation', id: DocType.BudgetReappropriation},
    {value: 'Depreciation Adjustment', id: DocType.DepreciationAdjustment},
    {value: 'Anticipated Budget', id: DocType.EstimatedBudget},
    {value: 'Budget', id: DocType.Budget},
    {value: 'Petty Cash', id:DocType.PettyCash},

    
    // {value: 'sales Order', id: DocType.SalesOrder},
    // { value: 'Goods Dispatch Note', id: DocType.GDN },
    // { value: 'Inventory Adjustment', id: DocType.InventoryAdjustment }
  ]

  static CriteriaField = [
    {value: 'Absolute', id: Criteria.Absolute},
    {value: 'Range', id: Criteria.Range},
    {value: 'Comparative', id: Criteria.Comparative},
    {value: 'Less than', id: Criteria.LessThan},
    {value: 'Less than & equals to', id: Criteria.LessThanEqualsTo},
    {value: 'Greater than', id: Criteria.GreaterThan},
    {value: 'Greater than & equals to', id: Criteria.GreaterThanEqualsTo},
  ]

  static NatureField = [
    {value: 'Text', id: Nature.text},
    {value: 'Number', id: Nature.Number},
    {value: 'Date', id: Nature.Date},
  ]

  static DocTypeValue = {
    0: 'Payment',
    1: 'CreditNote',
    2: 'DebitNote',
    3: 'Invoice',
    4: 'Bill',
    5: 'JournalEntry',
    6: 'BankAccount',
    7: 'CashAccount',
    8: 'PurchaseOrder',
    9: 'SalesOrder',
    10: 'GRN',
    11: 'GDN',
    12: 'InventoryAdjustment',
    13: 'Quotation',
    14: 'Requisition',
    15: 'Receipt',
    16: 'PayrollTransaction',
    17: 'PayrollPayment',
    18: 'Issuance',
    19: 'GoodsReturnNote',
    20: 'IssuanceReturn'
  }

  static Criteria = {
    0: 'Absolute',
    1: 'Range',
    2: 'Comparative',
    3: 'Less than',
    4: 'Less than & equals to',
    5: 'Greater than',
    6: 'Greater than & equals to'
  }

  static Nature = {
    0: 'Text',
    1: 'Number',
    2: 'Date'
  }

  static taxType = [
    {id: 0, type: 'Sales Tax Asset'},
    {id: 1, type: 'Sales Tax Liability'},
    {id: 2, type: 'Income Tax Asset'},
    {id: 3, type: 'Income Tax Liability'},
    {id: 4, type: 'SRBTaxAsset'},
    {id: 5, type: 'SRBTaxLiability'}
  ]

  static PayrollType = [
    {value: 'Basic Pay'},
    {value: 'Increment'},
    {value: 'Deduction'},
    {value: 'Allowance'},
    {value: 'Assignment Allowance'},
    {value: 'Tax Deduction'}
  ]

  static Months = [
    {name: 'Jan', value: 1},
    {name: 'Feb', value: 2},
    {name: 'Mar', value: 3},
    {name: 'Apr', value: 4},
    {name: 'May', value: 5},
    {name: 'June', value: 6},
    {name: 'July', value: 7},
    {name: 'Aug', value: 8},
    {name: 'Sep', value: 9},
    {name: 'Oct', value: 10},
    {name: 'Nov', value: 11},
    {name: 'Dec', value: 12},
  ];

  static filterStatus = [
    {value: 'Draft', id: 0},
    {value: 'Rejected', id: 1},
    {value: 'Unpaid', id: 2},
    {value: 'Approved', id: 2},
    {value: 'Partial', id: 3},
    {value: 'Paid', id: 4},
    {value: 'Open', id: 2},
    {value: 'Closed', id: 4},
    {value: 'Submitted', id: 5},
    {value: 'Reviewed', id: 6},
  ];
  
}
