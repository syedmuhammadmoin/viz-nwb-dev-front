export class Permissions {

  // Business Partner
  static BUSINESSPARTNER_CREATE = 'Profiling.BusinessPartner.CR'
  static BUSINESSPARTNER_VIEW = 'Profiling.BusinessPartner.VW'
  static BUSINESSPARTNER_EDIT = 'Profiling.BusinessPartner.ED'
  static BUSINESSPARTNER_DELETE = 'Profiling.BusinessPartner.DL'

  // Campus
  static CAMPUS_CREATE = 'Profiling.Campus.CR'
  static CAMPUS_VIEW = 'Profiling.Campus.VW'
  static CAMPUS_EDIT = 'Profiling.Campus.ED'
  static CAMPUS_DELETE = 'Profiling.Campus.DL'

  // Bank Account
  static BANKACCOUNT_VIEW = 'Finance.BankAccount.VW';
  static BANKACCOUNT_CREATE = 'Finance.BankAccount.CR';
  static BANKACCOUNT_EDIT = 'Finance.BankAccount.ED';
  static BANKACCOUNT_DELETE = 'Finance.BankAccount.DL';

  // Bank Statement
  static BANKSTATEMENT_VIEW = 'Finance.BankStatement.VW';
  static BANKSTATEMENT_CREATE = 'Finance.BankStatement.CR';
  static BANKSTATEMENT_EDIT = 'Finance.BankStatement.ED';
  static BANKSTATEMENT_DELETE = 'Finance.BankStatement.DL';

  // Warehouse
  static WAREHOUSE_VIEW = 'Profiling.Warehouse.VW';
  static WAREHOUSE_CREATE = 'Profiling.Warehouse.CR';
  static WAREHOUSE_EDIT = 'Profiling.Warehouse.ED';
  static WAREHOUSE_DELETE = 'Profiling.Warehouse.DL';

  // Location
  static LOCATION_VIEW = 'Profiling.Location.VW';
  static LOCATION_CREATE = 'Profiling.Location.CR';
  static LOCATION_EDIT = 'Profiling.Location.ED';
  static LOCATION_DELETE = 'Profiling.Location.DL';

  // Cash Account
  static CASHACCOUNT_VIEW = 'Finance.CashAccount.VW';
  static CASHACCOUNT_CREATE = 'Finance.CashAccount.CR';
  static CASHACCOUNT_EDIT = 'Finance.CashAccount.ED';
  static CASHACCOUNT_DELETE = 'Finance.CashAccount.DL';

  // Category
  static CATEGORIES_VIEW = 'Profiling.Categories.VW';
  static CATEGORIES_CREATE = 'Profiling.Categories.CR';
  static CATEGORIES_EDIT = 'Profiling.Categories.ED';
  static CATEGORIES_DELETE = 'Profiling.Categories.DL';

  // Chart of Account
  static CHARTOFACCOUNT_VIEW = 'Finance.ChartOfAccount.VW';

  // Department
  static DEPARTMENTS_VIEW = 'Payroll.Department.VW';
  static DEPARTMENTS_CREATE = 'Payroll.Department.CR';
  static DEPARTMENTS_EDIT = 'Payroll.Department.ED';
  static DEPARTMENTS_DELETE = 'Payroll.Department.DL';

  // tax
  static TAXES_VIEW = 'Profiling.Taxes.VW';
  static TAXES_CREATE = 'Profiling.Taxes.CR';
  static TAXES_EDIT = 'Profiling.Taxes.ED';
  static TAXES_DELETE = 'Profiling.Taxes.DL';

  // unit of measurement
  static UNIT_OF_MEASUREMENT_VIEW = 'Profiling.UnitOfMeasurement.VW';
  static UNIT_OF_MEASUREMENT_CREATE = 'Profiling.UnitOfMeasurement.CR';
  static UNIT_OF_MEASUREMENT_EDIT = 'Profiling.UnitOfMeasurement.ED';
  static UNIT_OF_MEASUREMENT_DELETE = 'Profiling.UnitOfMeasurement.DL';

  // Designation
  static DESIGNATIONS_VIEW = 'Payroll.Designation.VW';
  static DESIGNATIONS_CREATE = 'Payroll.Designation.CR';
  static DESIGNATIONS_EDIT = 'Payroll.Designation.ED';
  static DESIGNATIONS_DELETE = 'Payroll.Designations.DL';

  // Employee
  static EMPLOYEE_VIEW = 'Payroll.Employee.VW';
  static EMPLOYEE_CREATE = 'Payroll.Employee.CR';
  static EMPLOYEE_EDIT = 'Payroll.Employee.ED';
  static EMPLOYEE_DELETE = 'Payroll.Employee.DL';

  // Organization
  static ORGANIZATION_VIEW = 'Profiling.Organization.VW';
  static ORGANIZATION_CREATE = 'Profiling.Organization.CR';
  static ORGANIZATION_EDIT = 'Profiling.Organization.ED';
  static ORGANIZATION_DELETE = 'Profiling.Organization.DL';

  // Product
  static PRODUCT_VIEW = 'Profiling.Products.VW';
  static PRODUCT_CREATE = 'Profiling.Products.CR';
  static PRODUCT_EDIT = 'Profiling.Products.ED';
  static PRODUCT_DELETE = 'Profiling.Products.DL';

  // Budget
  static BUDGET_VIEW = 'Budget.Budget.VW';
  static BUDGET_CREATE = 'Budget.Budget.CR';
  static BUDGET_EDIT = 'Budget.Budget.ED';
  static BUDGET_DELETE = 'Budget.Budget.DL';
  static BUDGET_REPORT_VIEW = 'Budget.BudgetReport.VW';
  static BUDGET_COMPARISON_REPORT_VIEW = 'Budget.BudgetComparisonReport.VW';

  static ESTIMATED_BUDGET_VIEW = 'Budget.EstimatedBudget.VW';
  static ESTIMATED_BUDGET_CREATE = 'Budget.EstimatedBudget.CR';
  static ESTIMATED_BUDGET_EDIT = 'Budget.EstimatedBudget.ED';
  static ESTIMATED_BUDGET_DELETE = 'Budget.EstimatedBudget.DL';

  static BUDGET_REAPPROPIATION_VIEW = 'Budget.BudgetReappropiation.VW';
  static BUDGET_REAPPROPIATION_CREATE= 'Budget.BudgetReappropiation.CR';
  static BUDGET_REAPPROPIATION_EDIT = 'Budget.BudgetReappropiation.ED';




  // Level 3
  static LEVEL3_VIEW = 'Finance.Level3.VW';
  static LEVEL3_CREATE = 'Finance.Level3.CR';
  static LEVEL3_EDIT = 'Finance.Level3.ED';
  static LEVEL3_DELETE = 'Finance.Level3.DL';

  // Level 4
  static LEVEL4_VIEW = 'Finance.Level4.VW';
  static LEVEL4_CREATE = 'Finance.Level4.CR';
  static LEVEL4_EDIT = 'Finance.Level4.ED';
  static LEVEL4_DELETE = 'Finance.Level4.DL';

  // Report
  static BALANCESHEET_VIEW = 'Report.BalanceSheet.VW';
  static GENERALLEDGER_VIEW = 'Report.GeneralLedger.VW';
  static PROFITLOSS_VIEW = 'Report.ProfitLoss.VW';
  static TRIALBALANCE_VIEW = 'Report.TrialBalance.VW';

  // Invoice
  static INVOICE_VIEW = 'Finance.Invoice.VW';
  static INVOICE_CREATE = 'Finance.Invoice.CR';
  static INVOICE_EDIT = 'Finance.Invoice.ED';
  static INVOICE_DELETE = 'Finance.Invoice.DL';
  static INVOICE_REVIEW = 'Finance.Invoice.Review';
  static INVOICE_APPROVE = 'Finance.Invoice.Approve';

  // Bill
  static BILL_VIEW = 'Finance.Bill.VW';
  static BILL_CREATE = 'Finance.Bill.CR';
  static BILL_EDIT = 'Finance.Bill.ED';
  static BILL_DELETE = 'Finance.Bill.DL';
  static BILL_REVIEW = 'Finance.Bill.Review';
  static BILL_APPROVE = 'Finance.Bill.Approve';

  // purchase Order
  static PURCHASEORDER_VIEW = 'Procurement.PurchaseOrder.VW';
  static PURCHASEORDER_CREATE = 'Procurement.PurchaseOrder.CR';
  static PURCHASEORDER_EDIT = 'Procurement.PurchaseOrder.ED';
  static PURCHASEORDER_DELETE = 'Procurement.PurchaseOrder.DL';
  static PURCHASEORDER_REVIEW = 'Procurement.PurchaseOrder.Review';
  static PURCHASEORDER_APPROVE = 'Procurement.PurchaseOrder.Approve';

  // Requisition
  static REQUISITION_VIEW = 'Procurement.Requisition.VW';
  static REQUISITION_CREATE = 'Procurement.Requisition.CR';
  static REQUISITION_EDIT = 'Procurement.Requisition.ED';
  static REQUISITION_DELETE = 'Procurement.Requisition.DL';
  static REQUISITION_REVIEW = 'Procurement.Requisition.Review';
  static REQUISITION_APPROVE = 'Procurement.Requisition.Approve';

  // Quotation
  static QUOTATION_VIEW = 'Procurement.Quotation.VW'
  static QUOTATION_CREATE = 'Procurement.Quotation.CR';
  static QUOTATION_EDIT = 'Procurement.Quotation.ED';
  static QUOTATION_DELETE = 'Procurement.Quotation.DL';
  static QUOTATION_REVIEW = 'Procurement.Quotation.Review';
  static QUOTATION_APPROVE = 'Procurement.Quotation.Approve';

  // Quotation Comparative
  static QUOTATION_COMPARATIVE_VIEW = 'Procurement.QuotationComparative.VW'
  static QUOTATION_COMPARATIVE_CREATE = 'Procurement.QuotationComparative.CR';
  static QUOTATION_COMPARATIVE_EDIT = 'Procurement.QuotationComparative.ED';
  static QUOTATION_COMPARATIVE_DELETE = 'Procurement.QuotationComparative.DL';

  // Call Quotation
  static CALL_QUOTATION_VIEW = 'Procurement.CallForQuotation.VW'
  static CALL_QUOTATION_CREATE = 'Procurement.CallForQuotation.CR';
  static CALL_QUOTATION_EDIT = 'Procurement.CallForQuotation.ED';
  static CALL_QUOTATION_DELETE = 'Procurement.CallForQuotation.DL';

  // Request Requisition
  static REQUEST_VIEW = 'Procurement.Request.VW';
  static REQUEST_CREATE = 'Procurement.Request.CR';
  static REQUEST_EDIT = 'Procurement.Request.ED';
  static REQUEST_DELETE = 'Procurement.Request.DL';
  static REQUEST_REVIEW = 'Procurement.Request.Review';
  static REQUEST_APPROVE = 'Procurement.Request.Approve';

  // Bid Evaluation
  static BIDEVALUATION_VIEW = 'Procurement.BidEvaluation.VW';
  static BIDEVALUATION_CREATE = 'Procurement.BidEvaluation.CR';
  static BIDEVALUATION_EDIT = 'Procurement.BidEvaluation.ED';
  static BIDEVALUATION_DELETE = 'Procurement.BidEvaluation.DL';

  // Payment
  static PAYMENT_VIEW = 'Finance.Payment.VW';
  static PAYMENT_CREATE = 'Finance.Payment.CR';
  static PAYMENT_EDIT = 'Finance.Payment.ED';
  static PAYMENT_DELETE = 'Finance.Payment.DL';
  static PAYMENT_REVIEW = 'Finance.Payment.Review';
  static PAYMENT_APPROVE = 'Finance.Payment.Approve';

  // Internal Recipt
  static RECEIPT_VIEW = 'Finance.Receipt.VW';
  static RECEIPT_CREATE = 'Finance.Receipt.CR';
  static RECEIPT_EDIT = 'Finance.Receipt.ED';
  static RECEIPT_DELETE = 'Finance.Receipt.DL';
  static RECEIPT_REVIEW = 'Finance.Receipt.Review';
  static RECEIPT_APPROVE = 'Finance.Receipt.Approve';

  static PAYROLL_PAYMENT_VIEW = 'Payroll.PayrollPayment.VW';
  static PAYROLL_PAYMENT_CREATE = 'Payroll.PayrollPayment.CR';
  static PAYROLL_PAYMENT_EDIT = 'Payroll.PayrollPayment.ED';
  static PAYROLL_PAYMENT_DELETE = 'Payroll.PayrollPayment.DL';

  // Credit Note
  static CREDITNOTE_VIEW = 'Finance.CreditNote.VW';
  static CREDITNOTE_CREATE = 'Finance.CreditNote.CR';
  static CREDITNOTE_EDIT = 'Finance.CreditNote.ED';
  static CREDITNOTE_DELETE = 'Finance.CreditNote.DL';
  static CREDITNOTE_REVIEW = 'Finance.CreditNote.Review';
  static CREDITNOTE_APPROVE = 'Finance.CreditNote.Approve';

  // Debit Note
  static DEBITNOTE_VIEW = 'Finance.DebitNote.VW';
  static DEBITNOTE_CREATE = 'Finance.DebitNote.CR';
  static DEBITNOTE_EDIT = 'Finance.DebitNote.ED';
  static DEBITNOTE_DELETE = 'Finance.DebitNote.DL';
  static DEBITNOTE_REVIEW = 'Finance.DebitNote.Review';
  static DEBITNOTE_APPROVE = 'Finance.DebitNote.Approve';

  // Journal Entry Permissions
  static JOURNALENTRY_VIEW = 'Finance.JournalEntry.VW';
  static JOURNALENTRY_CREATE = 'Finance.JournalEntry.CR';
  static JOURNALENTRY_EDIT = 'Finance.JournalEntry.ED';
  static JOURNALENTRY_DELETE = 'Finance.JournalEntry.DL';
  static JOURNALENTRY_REVIEW = 'Finance.JournalEntry.Review';
  static JOURNALENTRY_APPROVE = 'Finance.JournalEntry.Approve';

  // Auth Permissions
  static AUTH_VIEW = 'AccessManagement.Auth.VW';
  static AUTH_CREATE = 'AccessManagement.Auth.CR';
  static AUTH_EDIT = 'AccessManagement.Auth.ED';
  static AUTH_DELETE = 'AccessManagement.Auth.DL';

  // WORKFLOW Permissions
  static WORKFLOW_VIEW = 'Workflow.Workflow.VW';
  static WORKFLOW_CREATE = 'Workflow.Workflow.CR';
  static WORKFLOW_EDIT = 'Workflow.Workflow.ED';
  static WORKFLOW_DELETE = 'Workflow.Workflow.DL';

  // STATUS Permissions
  static STATUS_VIEW = 'Workflow.WorkflowStatus.VW';
  static STATUS_CREATE = 'Workflow.WorkflowStatus.CR';
  static STATUS_EDIT = 'Workflow.WorkflowStatus.ED';
  static STATUS_DELETE = 'Workflow.WorkflowStatus.DL';

  // Transaction Recon
  static TRANSACTION_RECON_VIEW = 'Finance.TransactionRecon.VW';
  static TRANSACTION_RECON_CREATE = 'Finance.TransactionRecon.CR';
  static TRANSACTION_RECON_EDIT = 'Finance.TransactionRecon.ED';
  static TRANSACTION_RECON_DELETE = 'Finance.TransactionRecon.DL';

  // Bank Recon
  static BANK_RECON_VIEW = 'Finance.BankRecon.VW';
  static BANK_RECON_CREATE = 'Finance.BankRecon.CR';
  static BANK_RECON_EDIT = 'Finance.BankRecon.ED';
  static BANK_RECON_DELETE = 'Finance.BankRecon.DL';

  // GRN
  static GRN_VIEW = 'Procurement.GRN.VW';
  static GRN_CREATE = 'Procurement.GRN.CR';
  static GRN_EDIT = 'Procurement.GRN.ED';
  static GRN_DELETE = 'Procurement.GRN.DL';

  // GRN
  static GOODS_RETURN_NOTE_VIEW = 'Procurement.GoodsReturnNote.VW';
  static GOODS_RETURN_NOTE_CREATE = 'Procurement.GoodsReturnNote.CR';
  static GOODS_RETURN_NOTE_EDIT = 'Procurement.GoodsReturnNote.ED';
  static GOODS_RETURN_NOTE_DELETE = 'Procurement.GoodsReturnNote.DL';

  // Issuance
  static ISSUANCE_VIEW = 'Procurement.Issuance.VW';
  static ISSUANCE_CREATE = 'Procurement.Issuance.CR';
  static ISSUANCE_EDIT = 'Procurement.Issuance.ED';
  static ISSUANCE_DELETE = 'Procurement.Issuance.DL'

  // Issuance Return
  static ISSUANCE_RETURN_VIEW = 'Procurement.IssuanceReturn.VW';
  static ISSUANCE_RETURN_CREATE = 'Procurement.IssuanceReturn.CR';
  static ISSUANCE_RETURN_EDIT = 'Procurement.IssuanceReturn.ED';
  static ISSUANCE_RETURN_DELETE = 'Procurement.IssuanceReturn.DL'

  // Inventory Adjustment
  static INVENTORYADJUSTMENT_VIEW = 'Procurement.InventoryAdjustment.VW';
  static INVENTORYADJUSTMENT_CREATE = 'Procurement.InventoryAdjustment.CR';
  static INVENTORYADJUSTMENT_EDIT = 'Procurement.InventoryAdjustment.ED';
  static INVENTORYADJUSTMENT_DELETE = 'Procurement.InventoryAdjustment.DL';

  // Payroll Item
  static PAYROLL_ITEM_VIEW = 'Payroll.PayrollItem.VW';
  static PAYROLL_ITEM_CREATE = 'Payroll.PayrollItem.CR';
  static PAYROLL_ITEM_EDIT = 'Payroll.PayrollItem.ED';
  static PAYROLL_ITEM_DELETE = 'Payroll.PayrollItem.DL';

  // Payroll Transaction
  static PAYROLL_TRANSACTION_VIEW = 'Payroll.PayrollTransaction.VW';
  static PAYROLL_TRANSACTION_CREATE = 'Payroll.PayrollTransaction.CR';
  static PAYROLL_TRANSACTION_EDIT = 'Payroll.PayrollTransaction.ED';
  static PAYROLL_TRANSACTION_DELETE = 'Payroll.PayrollTransaction.DL';
  static PAYROLL_TRANSACTION_REVIEW = 'Payroll.PayrollTransaction.Review';
  static PAYROLL_TRANSACTION_APPROVE = 'Payroll.PayrollTransaction.Approve';


  // Asset Category
  static ASSET_CATEGORY_VIEW = 'AssetCategory.VW';
  static ASSET_CATEGORY_CREATE = 'AssetCategory.CR';
  static ASSET_CATEGORY_EDIT = 'AssetCategory.ED';
  static ASSET_CATEGORY_DELETE = 'AssetCategory.DL';

  // Depreciation Model
  static DEPRECIATION_MODEL_VIEW = 'FixedAsset.DepreciationModel.VW';
  static DEPRECIATION_MODEL_CREATE = 'FixedAsset.DepreciationModel.CR';
  static DEPRECIATION_MODEL_EDIT = 'FixedAsset.DepreciationModel.ED';
  static DEPRECIATION_MODEL_DELETE = 'FixedAsset.DepreciationModel.DL';

  // Depreciation Adjustment
  static DEPRECIATION_ADJUSTMENT_VIEW = 'FixedAsset.DepreciationAdjustment.VW';
  static DEPRECIATION_ADJUSTMENT_CREATE = 'FixedAsset.DepreciationAdjustment.CR';
  static DEPRECIATION_ADJUSTMENT_EDIT = 'FixedAsset.DepreciationAdjustment.ED';
  static DEPRECIATION_ADJUSTMENT_DELETE = 'FixedAsset.DepreciationAdjustment.DL';

  // Asset
  static ASSET_VIEW = 'FixedAsset.FixedAsset.VW';
  static ASSET_CREATE = 'FixedAsset.FixedAsset.CR';
  static ASSET_EDIT = 'FixedAsset.FixedAsset.ED';
  static ASSET_DELETE = 'FixedAsset.FixedAsset.DL';

  // Cwip
  static CWIP_VIEW = 'FixedAsset.CWIP.VW';
  static CWIP_CREATE = 'FixedAsset.CWIP.CR';
  static CWIP_EDIT = 'FixedAsset.CWIP.ED';
  static CWIP_DELETE = 'FixedAsset.CWIP.DL';

  // Disposal
  static DISPOSAL_VIEW = 'FixedAsset.Disposal.VW';
  static DISPOSAL_CREATE = 'FixedAsset.Disposal.CR';
  static DISPOSAL_EDIT = 'FixedAsset.Disposal.ED';
  static DISPOSAL_DELETE = 'FixedAsset.Disposal.DL';

  // asset report
  static ASSET_REPORT_VIEW = 'FixedAsset.FixedAssetReport.VW';
  static ASSET_REPORT_CREATE = 'FixedAsset.FixedAssetReport.CR';
  static ASSET_REPORT_EDIT = 'FixedAsset.FixedAssetReport.ED';
  static ASSET_REPORT_DELETE = 'FixedAsset.FixedAssetReport.DL';

  // allowance
  static ALLOWANCE_VIEW = 'AllowanceReport.VW';

  // Stock
  static STOCK_VIEW = 'Procurement.Stock.VW';


  // ADMISSION

  // Shift
  static ADMISSION_SHIFT_VIEW = 'Admission.Shift.VW';
  static ADMISSION_SHIFT_CREATE = 'Admission.Shift.CR';
  static ADMISSION_SHIFT_EDIT = 'Admission.Shift.ED';
  static ADMISSION_SHIFT_DELETE = 'Admission.Shift.DL';

  // Batch
  static ADMISSION_BATCH_VIEW = 'Admission.Batch.VW';
  static ADMISSION_BATCH_CREATE = 'Admission.Batch.CR';
  static ADMISSION_BATCH_EDIT = 'Admission.Batch.ED';
  static ADMISSION_BATCH_DELETE = 'Admission.Batch.DL';

  // Domicile
  static ADMISSION_DOMICILE_VIEW = 'Admission.Domicile.VW';
  static ADMISSION_DOMICILE_CREATE = 'Admission.Domicile.CR';
  static ADMISSION_DOMICILE_EDIT = 'Admission.Domicile.ED';
  static ADMISSION_DOMICILE_DELETE = 'Admission.Domicile.DL';

  // District
  static ADMISSION_DISTRICT_VIEW = 'Admission.District.VW';
  static ADMISSION_DISTRICT_CREATE = 'Admission.District.CR';
  static ADMISSION_DISTRICT_EDIT = 'Admission.District.ED';
  static ADMISSION_DISTRICT_DELETE = 'Admission.District.DL';

  // City
  static ADMISSION_CITY_VIEW = 'Admission.City.VW';
  static ADMISSION_CITY_CREATE = 'Admission.City.CR';
  static ADMISSION_CITY_EDIT = 'Admission.City.ED';
  static ADMISSION_CITY_DELETE = 'Admission.City.DL';

  // State
  static ADMISSION_STATE_VIEW = 'Admission.State.VW';
  static ADMISSION_STATE_CREATE = 'Admission.State.CR';
  static ADMISSION_STATE_EDIT = 'Admission.State.ED';
  static ADMISSION_STATE_DELETE = 'Admission.State.DL';

  // Country
  static ADMISSION_COUNTRY_VIEW = 'Admission.Country.VW';
  static ADMISSION_COUNTRY_CREATE = 'Admission.Country.CR';
  static ADMISSION_COUNTRY_EDIT = 'Admission.Country.ED';
  static ADMISSION_COUNTRY_DELETE = 'Admission.Country.DL';

  // FeeItem
  static ADMISSION_FEEITEM_VIEW = 'Admission.FeeItem.VW';
  static ADMISSION_FEEITEM_CREATE = 'Admission.FeeItem.CR';
  static ADMISSION_FEEITEM_EDIT = 'Admission.FeeItem.ED';
  static ADMISSION_FEEITEM_DELETE = 'Admission.FeeItem.DL';

  // Subject
  static ADMISSION_SUBJECT_VIEW = 'Admission.Subject.VW';
  static ADMISSION_SUBJECT_CREATE = 'Admission.Subject.CR';
  static ADMISSION_SUBJECT_EDIT = 'Admission.Subject.ED';
  static ADMISSION_SUBJECT_DELETE = 'Admission.Subject.DL';

  // Qualification
  static ADMISSION_QUALIFICATION_VIEW = 'Admission.Qualification.VW';
  static ADMISSION_QUALIFICATION_CREATE = 'Admission.Qualification.CR';
  static ADMISSION_QUALIFICATION_EDIT = 'Admission.Qualification.ED';
  static ADMISSION_QUALIFICATION_DELETE = 'Admission.Qualification.DL';

  // Course
  static ADMISSION_COURSE_VIEW = 'Admission.Course.VW';
  static ADMISSION_COURSE_CREATE = 'Admission.Course.CR';
  static ADMISSION_COURSE_EDIT = 'Admission.Course.ED';
  static ADMISSION_COURSE_DELETE = 'Admission.Course.DL';

  // Semester
  static ADMISSION_SEMESTER_VIEW = 'Admission.Semester.VW';
  static ADMISSION_SEMESTER_CREATE = 'Admission.Semester.CR';
  static ADMISSION_SEMESTER_EDIT = 'Admission.Semester.ED';
  static ADMISSION_SEMESTER_DELETE = 'Admission.Semester.DL';

  // Degree
  static ADMISSION_DEGREE_VIEW = 'Admission.Degree.VW';
  static ADMISSION_DEGREE_CREATE = 'Admission.Degree.CR';
  static ADMISSION_DEGREE_EDIT = 'Admission.Degree.ED';
  static ADMISSION_DEGREE_DELETE = 'Admission.Degree.DL';

  // Program
  static ADMISSION_PROGRAM_VIEW = 'Admission.Program.VW';
  static ADMISSION_PROGRAM_CREATE = 'Admission.Program.CR';
  static ADMISSION_PROGRAM_EDIT = 'Admission.Program.ED';
  static ADMISSION_PROGRAM_DELETE = 'Admission.Program.DL';

  // Faculty
  static ADMISSION_FACULTY_VIEW = 'Admission.Faculty.VW';
  static ADMISSION_FACULTY_CREATE = 'Admission.Faculty.CR';
  static ADMISSION_FACULTY_EDIT = 'Admission.Faculty.ED';
  static ADMISSION_FACULTY_DELETE = 'Admission.Faculty.DL';

  // Applicant
  static ADMISSION_APPLICANT_VIEW = 'Admission.Applicant.VW';
  static ADMISSION_APPLICANT_CREATE = 'Admission.Applicant.CR';
  static ADMISSION_APPLICANT_EDIT = 'Admission.Applicant.ED';
  static ADMISSION_APPLICANT_DELETE = 'Admission.Applicant.DL';

  // Academic Department
  static ADMISSION_ACADEMIC_DEPARTMENT_VIEW = 'Admission.AcademicDepartment.VW';
  static ADMISSION_ACADEMIC_DEPARTMENT_CREATE = 'Admission.AcademicDepartment.CR';
  static ADMISSION_ACADEMIC_DEPARTMENT_EDIT = 'Admission.AcademicDepartment.ED';
  static ADMISSION_ACADEMIC_DEPARTMENT_DELETE = 'Admission.AcademicDepartment.DL';

  // Admission Criteria
  static ADMISSION_CRITERIA_VIEW = 'Admission.AdmissionCriteria.VW';
  static ADMISSION_CRITERIA_CREATE = 'Admission.AdmissionCriteria.CR';
  static ADMISSION_CRITERIA_EDIT = 'Admission.AdmissionCriteria.ED';
  static ADMISSION_CRITERIA_DELETE = 'Admission.AdmissionCriteria.DL';

}

export enum ActionButton {
  Approve,
  Reject
}

export enum DocType {
  Payment,
  CreditNote,
  DebitNote,
  Invoice,
  Bill,
  JournalEntry,
  BankAccount,
  CashAccount,
  PurchaseOrder,
  SalesOrder,
  GRN,
  GDN,
  InventoryAdjustment,
  Quotation,
  Requisition,
  Receipt,
  PayrollTransaction,
  PayrollPayment,
  Issuance,
  GoodsReturnNote,
  IssuanceReturn,
  Request,
  BidEvaluation,
  CallForQuotaion,
  QuotationComparative,
  FixedAsset,
  CWIP,
  Disposal,
  BudgetReappropriation,
  DepreciationAdjustment
}

export enum Criteria{
  Absolute,
  Range,
  Comparative,
  LessThan,
  LessThanEqualsTo,
  GreaterThan,
  GreaterThanEqualsTo,
}

export enum Nature{
  text = 'text',
  Number = 'number',
  Date = 'date'
}

export enum DocumentStatus {
    Draft,
    Rejected,
    Unpaid,
    Partial,
    Paid,
    Submitted,
    Reviewed,
    Cancelled,
    Unreconciled,
    Reconciled
}

export enum AccountType {
  SystemDefined,
  UserDefined
}

export enum PayrollType {
  BasicPay,
  Increment,
  Deduction,
  Allowance,
  AssignmentAllowance,
  TaxDeduction
}

export enum PayrollItemType {
  Percentage,
  FixedAmount,
}

export enum DepreciationMethod {
  StraightLine,
  Declining
}

export enum AssetType
{
  Bill,
  WorkInProgress,
  OpeningAssetAddition
}

export enum BusinessPartnerType {
  Customer,
  Vendor,
  Employee,
  Supplier,
  Consultant,
  Contractor
}

export enum TaxType {
  SalesTaxAsset,
  SalesTaxLiability,
  IncomeTaxAsset,
  IncomeTaxLiability,
  SRBTaxAsset,
  SRBTaxLiability
}

 export enum bankAccountType {
    Current,
    Saving
 }

 export enum CalculationType
  {
    Percentage,
    FixedAmount
  }

export enum Season
{
  Fall,
  Spring,
  Summer,
}
