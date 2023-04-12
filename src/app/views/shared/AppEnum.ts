export class Permissions {

  // Business Partner
  static BUSINESSPARTNER_CREATE = 'Profiling.BusinessPartner.Create'
  static BUSINESSPARTNER_VIEW = 'Profiling.BusinessPartner.View'
  static BUSINESSPARTNER_EDIT = 'Profiling.BusinessPartner.Edit'
  static BUSINESSPARTNER_DELETE = 'Profiling.BusinessPartner.Delete'

  // Campus
  static CAMPUS_CREATE = 'Profiling.Campus.Create'
  static CAMPUS_VIEW = 'Profiling.Campus.View'
  static CAMPUS_EDIT = 'Profiling.Campus.Edit'
  static CAMPUS_DELETE = 'Profiling.Campus.Delete'

  // Bank Account
  static BANKACCOUNT_VIEW = 'Finance.BankAccount.View';
  static BANKACCOUNT_CREATE = 'Finance.BankAccount.Create';
  static BANKACCOUNT_EDIT = 'Finance.BankAccount.Edit';
  static BANKACCOUNT_DELETE = 'Finance.BankAccount.Delete';

  // Bank Statement
  static BANKSTATEMENT_VIEW = 'Finance.BankStatement.View';
  static BANKSTATEMENT_CREATE = 'Finance.BankStatement.Create';
  static BANKSTATEMENT_EDIT = 'Finance.BankStatement.Edit';
  static BANKSTATEMENT_DELETE = 'Finance.BankStatement.Delete';

  // Warehouse
  static WAREHOUSE_VIEW = 'Profiling.Warehouse.View';
  static WAREHOUSE_CREATE = 'Profiling.Warehouse.Create';
  static WAREHOUSE_EDIT = 'Profiling.Warehouse.Edit';
  static WAREHOUSE_DELETE = 'Profiling.Warehouse.Delete';

  // Location
  static LOCATION_VIEW = 'Profiling.Location.View';
  static LOCATION_CREATE = 'Profiling.Location.Create';
  static LOCATION_EDIT = 'Profiling.Location.Edit';
  static LOCATION_DELETE = 'Profiling.Location.Delete';

  // Cash Account
  static CASHACCOUNT_VIEW = 'Finance.CashAccount.View';
  static CASHACCOUNT_CREATE = 'Finance.CashAccount.Create';
  static CASHACCOUNT_EDIT = 'Finance.CashAccount.Edit';
  static CASHACCOUNT_DELETE = 'Finance.CashAccount.Delete';

  // Category
  static CATEGORIES_VIEW = 'Profiling.Categories.View';
  static CATEGORIES_CREATE = 'Profiling.Categories.Create';
  static CATEGORIES_EDIT = 'Profiling.Categories.Edit';
  static CATEGORIES_DELETE = 'Profiling.Categories.Delete';

  // Chart of Account
  static CHARTOFACCOUNT_VIEW = 'Finance.ChartOfAccount.View';

  // Department
  static DEPARTMENTS_VIEW = 'Payroll.Department.View';
  static DEPARTMENTS_CREATE = 'Payroll.Department.Create';
  static DEPARTMENTS_EDIT = 'Payroll.Department.Edit';
  static DEPARTMENTS_DELETE = 'Payroll.Department.Delete';

  // tax
  static TAXES_VIEW = 'Profiling.Taxes.View';
  static TAXES_CREATE = 'Profiling.Taxes.Create';
  static TAXES_EDIT = 'Profiling.Taxes.Edit';
  static TAXES_DELETE = 'Profiling.Taxes.Delete';

  // unit of measurement
  static UNIT_OF_MEASUREMENT_VIEW = 'Profiling.UnitOfMeasurement.View';
  static UNIT_OF_MEASUREMENT_CREATE = 'Profiling.UnitOfMeasurement.Create';
  static UNIT_OF_MEASUREMENT_EDIT = 'Profiling.UnitOfMeasurement.Edit';
  static UNIT_OF_MEASUREMENT_DELETE = 'Profiling.UnitOfMeasurement.Delete';

  // Designation
  static DESIGNATIONS_VIEW = 'Payroll.Designation.View';
  static DESIGNATIONS_CREATE = 'Payroll.Designation.Create';
  static DESIGNATIONS_EDIT = 'Payroll.Designation.Edit';
  static DESIGNATIONS_DELETE = 'Payroll.Designations.Delete';

  // Employee
  static EMPLOYEE_VIEW = 'Payroll.Employee.View';
  static EMPLOYEE_CREATE = 'Payroll.Employee.Create';
  static EMPLOYEE_EDIT = 'Payroll.Employee.Edit';
  static EMPLOYEE_DELETE = 'Payroll.Employee.Delete';

  // Organization
  static ORGANIZATION_VIEW = 'Profiling.Organization.View';
  static ORGANIZATION_CREATE = 'Profiling.Organization.Create';
  static ORGANIZATION_EDIT = 'Profiling.Organization.Edit';
  static ORGANIZATION_DELETE = 'Profiling.Organization.Delete';

  // Product
  static PRODUCT_VIEW = 'Profiling.Products.View';
  static PRODUCT_CREATE = 'Profiling.Products.Create';
  static PRODUCT_EDIT = 'Profiling.Products.Edit';
  static PRODUCT_DELETE = 'Profiling.Products.Delete';

  // Budget
  static BUDGET_VIEW = 'Budget.Budget.View';
  static BUDGET_CREATE = 'Budget.Budget.Create';
  static BUDGET_EDIT = 'Budget.Budget.Edit';
  static BUDGET_DELETE = 'Budget.Budget.Delete';
  static BUDGET_REPORT_VIEW = 'Budget.BudgetReport.View';
  static BUDGET_COMPARISON_REPORT_VIEW = 'Budget.BudgetComparisonReport.View';

  static ESTIMATED_BUDGET_VIEW = 'Budget.EstimatedBudget.View';
  static ESTIMATED_BUDGET_CREATE = 'Budget.EstimatedBudget.Create';
  static ESTIMATED_BUDGET_EDIT = 'Budget.EstimatedBudget.Edit';
  static ESTIMATED_BUDGET_DELETE = 'Budget.EstimatedBudget.Delete';

  static BUDGET_REAPPROPIATION_VIEW = 'Budget.BudgetReappropiation.View';
  static BUDGET_REAPPROPIATION_CREATE= 'Budget.BudgetReappropiation.Create';
  static BUDGET_REAPPROPIATION_EDIT = 'Budget.BudgetReappropiation.Edit';




  // Level 3
  static LEVEL3_VIEW = 'Finance.Level3.View';
  static LEVEL3_CREATE = 'Finance.Level3.Create';
  static LEVEL3_EDIT = 'Finance.Level3.Edit';
  static LEVEL3_DELETE = 'Finance.Level3.Delete';

  // Level 4
  static LEVEL4_VIEW = 'Finance.Level4.View';
  static LEVEL4_CREATE = 'Finance.Level4.Create';
  static LEVEL4_EDIT = 'Finance.Level4.Edit';
  static LEVEL4_DELETE = 'Finance.Level4.Delete';

  // Report
  static BALANCESHEET_VIEW = 'Report.BalanceSheet.View';
  static GENERALLEDGER_VIEW = 'Report.GeneralLedger.View';
  static PROFITLOSS_VIEW = 'Report.ProfitLoss.View';
  static TRIALBALANCE_VIEW = 'Report.TrialBalance.View';

  // Invoice
  static INVOICE_VIEW = 'Finance.Invoice.View';
  static INVOICE_CREATE = 'Finance.Invoice.Create';
  static INVOICE_EDIT = 'Finance.Invoice.Edit';
  static INVOICE_DELETE = 'Finance.Invoice.Delete';
  static INVOICE_REVIEW = 'Finance.Invoice.Review';
  static INVOICE_APPROVE = 'Finance.Invoice.Approve';

  // Bill
  static BILL_VIEW = 'Finance.Bill.View';
  static BILL_CREATE = 'Finance.Bill.Create';
  static BILL_EDIT = 'Finance.Bill.Edit';
  static BILL_DELETE = 'Finance.Bill.Delete';
  static BILL_REVIEW = 'Finance.Bill.Review';
  static BILL_APPROVE = 'Finance.Bill.Approve';

  // purchase Order
  static PURCHASEORDER_VIEW = 'Procurement.PurchaseOrder.View';
  static PURCHASEORDER_CREATE = 'Procurement.PurchaseOrder.Create';
  static PURCHASEORDER_EDIT = 'Procurement.PurchaseOrder.Edit';
  static PURCHASEORDER_DELETE = 'Procurement.PurchaseOrder.Delete';
  static PURCHASEORDER_REVIEW = 'Procurement.PurchaseOrder.Review';
  static PURCHASEORDER_APPROVE = 'Procurement.PurchaseOrder.Approve';

  // Requisition
  static REQUISITION_VIEW = 'Procurement.Requisition.View';
  static REQUISITION_CREATE = 'Procurement.Requisition.Create';
  static REQUISITION_EDIT = 'Procurement.Requisition.Edit';
  static REQUISITION_DELETE = 'Procurement.Requisition.Delete';
  static REQUISITION_REVIEW = 'Procurement.Requisition.Review';
  static REQUISITION_APPROVE = 'Procurement.Requisition.Approve';

  // Quotation
  static QUOTATION_VIEW = 'Procurement.Quotation.View'
  static QUOTATION_CREATE = 'Procurement.Quotation.Create';
  static QUOTATION_EDIT = 'Procurement.Quotation.Edit';
  static QUOTATION_DELETE = 'Procurement.Quotation.Delete';
  static QUOTATION_REVIEW = 'Procurement.Quotation.Review';
  static QUOTATION_APPROVE = 'Procurement.Quotation.Approve';

  // Quotation Comparative
  static QUOTATION_COMPARATIVE_VIEW = 'Procurement.QuotationComparative.View'
  static QUOTATION_COMPARATIVE_CREATE = 'Procurement.QuotationComparative.Create';
  static QUOTATION_COMPARATIVE_EDIT = 'Procurement.QuotationComparative.Edit';
  static QUOTATION_COMPARATIVE_DELETE = 'Procurement.QuotationComparative.Delete';

  // Call Quotation
  static CALL_QUOTATION_VIEW = 'Procurement.CallForQuotation.View'
  static CALL_QUOTATION_CREATE = 'Procurement.CallForQuotation.Create';
  static CALL_QUOTATION_EDIT = 'Procurement.CallForQuotation.Edit';
  static CALL_QUOTATION_DELETE = 'Procurement.CallForQuotation.Delete';

  // Request Requisition
  static REQUEST_VIEW = 'Procurement.Request.View';
  static REQUEST_CREATE = 'Procurement.Request.Create';
  static REQUEST_EDIT = 'Procurement.Request.Edit';
  static REQUEST_DELETE = 'Procurement.Request.Delete';
  static REQUEST_REVIEW = 'Procurement.Request.Review';
  static REQUEST_APPROVE = 'Procurement.Request.Approve';

  // Bid Evaluation
  static BIDEVALUATION_VIEW = 'Procurement.BidEvaluation.View';
  static BIDEVALUATION_CREATE = 'Procurement.BidEvaluation.Create';
  static BIDEVALUATION_EDIT = 'Procurement.BidEvaluation.Edit';
  static BIDEVALUATION_DELETE = 'Procurement.BidEvaluation.Delete';

  // Payment
  static PAYMENT_VIEW = 'Finance.Payment.View';
  static PAYMENT_CREATE = 'Finance.Payment.Create';
  static PAYMENT_EDIT = 'Finance.Payment.Edit';
  static PAYMENT_DELETE = 'Finance.Payment.Delete';
  static PAYMENT_REVIEW = 'Finance.Payment.Review';
  static PAYMENT_APPROVE = 'Finance.Payment.Approve';

  // Internal Recipt
  static RECEIPT_VIEW = 'Finance.Receipt.View';
  static RECEIPT_CREATE = 'Finance.Receipt.Create';
  static RECEIPT_EDIT = 'Finance.Receipt.Edit';
  static RECEIPT_DELETE = 'Finance.Receipt.Delete';
  static RECEIPT_REVIEW = 'Finance.Receipt.Review';
  static RECEIPT_APPROVE = 'Finance.Receipt.Approve';

  static PAYROLL_PAYMENT_VIEW = 'Payroll.PayrollPayment.View';
  static PAYROLL_PAYMENT_CREATE = 'Payroll.PayrollPayment.Create';
  static PAYROLL_PAYMENT_EDIT = 'Payroll.PayrollPayment.Edit';
  static PAYROLL_PAYMENT_DELETE = 'Payroll.PayrollPayment.Delete';

  // Credit Note
  static CREDITNOTE_VIEW = 'Finance.CreditNote.View';
  static CREDITNOTE_CREATE = 'Finance.CreditNote.Create';
  static CREDITNOTE_EDIT = 'Finance.CreditNote.Edit';
  static CREDITNOTE_DELETE = 'Finance.CreditNote.Delete';
  static CREDITNOTE_REVIEW = 'Finance.CreditNote.Review';
  static CREDITNOTE_APPROVE = 'Finance.CreditNote.Approve';

  // Debit Note
  static DEBITNOTE_VIEW = 'Finance.DebitNote.View';
  static DEBITNOTE_CREATE = 'Finance.DebitNote.Create';
  static DEBITNOTE_EDIT = 'Finance.DebitNote.Edit';
  static DEBITNOTE_DELETE = 'Finance.DebitNote.Delete';
  static DEBITNOTE_REVIEW = 'Finance.DebitNote.Review';
  static DEBITNOTE_APPROVE = 'Finance.DebitNote.Approve';

  // Journal Entry Permissions
  static JOURNALENTRY_VIEW = 'Finance.JournalEntry.View';
  static JOURNALENTRY_CREATE = 'Finance.JournalEntry.Create';
  static JOURNALENTRY_EDIT = 'Finance.JournalEntry.Edit';
  static JOURNALENTRY_DELETE = 'Finance.JournalEntry.Delete';
  static JOURNALENTRY_REVIEW = 'Finance.JournalEntry.Review';
  static JOURNALENTRY_APPROVE = 'Finance.JournalEntry.Approve';

  // Auth Permissions
  static AUTH_VIEW = 'AccessManagement.Auth.View';
  static AUTH_CREATE = 'AccessManagement.Auth.Create';
  static AUTH_EDIT = 'AccessManagement.Auth.Edit';
  static AUTH_DELETE = 'AccessManagement.Auth.Delete';

  // WORKFLOW Permissions
  static WORKFLOW_VIEW = 'Workflow.Workflow.View';
  static WORKFLOW_CREATE = 'Workflow.Workflow.Create';
  static WORKFLOW_EDIT = 'Workflow.Workflow.Edit';
  static WORKFLOW_DELETE = 'Workflow.Workflow.Delete';

  // STATUS Permissions
  static STATUS_VIEW = 'Workflow.WorkflowStatus.View';
  static STATUS_CREATE = 'Workflow.WorkflowStatus.Create';
  static STATUS_EDIT = 'Workflow.WorkflowStatus.Edit';
  static STATUS_DELETE = 'Workflow.WorkflowStatus.Delete';

  // Transaction Recon
  static TRANSACTION_RECON_VIEW = 'Finance.TransactionRecon.View';
  static TRANSACTION_RECON_CREATE = 'Finance.TransactionRecon.Create';
  static TRANSACTION_RECON_EDIT = 'Finance.TransactionRecon.Edit';
  static TRANSACTION_RECON_DELETE = 'Finance.TransactionRecon.Delete';

  // Bank Recon
  static BANK_RECON_VIEW = 'Finance.BankRecon.View';
  static BANK_RECON_CREATE = 'Finance.BankRecon.Create';
  static BANK_RECON_EDIT = 'Finance.BankRecon.Edit';
  static BANK_RECON_DELETE = 'Finance.BankRecon.Delete';

  // GRN
  static GRN_VIEW = 'Procurement.GRN.View';
  static GRN_CREATE = 'Procurement.GRN.Create';
  static GRN_EDIT = 'Procurement.GRN.Edit';
  static GRN_DELETE = 'Procurement.GRN.Delete';

  // GRN
  static GOODS_RETURN_NOTE_VIEW = 'Procurement.GoodsReturnNote.View';
  static GOODS_RETURN_NOTE_CREATE = 'Procurement.GoodsReturnNote.Create';
  static GOODS_RETURN_NOTE_EDIT = 'Procurement.GoodsReturnNote.Edit';
  static GOODS_RETURN_NOTE_DELETE = 'Procurement.GoodsReturnNote.Delete';

  // Issuance
  static ISSUANCE_VIEW = 'Procurement.Issuance.View';
  static ISSUANCE_CREATE = 'Procurement.Issuance.Create';
  static ISSUANCE_EDIT = 'Procurement.Issuance.Edit';
  static ISSUANCE_DELETE = 'Procurement.Issuance.Delete'

  // Issuance Return
  static ISSUANCE_RETURN_VIEW = 'Procurement.IssuanceReturn.View';
  static ISSUANCE_RETURN_CREATE = 'Procurement.IssuanceReturn.Create';
  static ISSUANCE_RETURN_EDIT = 'Procurement.IssuanceReturn.Edit';
  static ISSUANCE_RETURN_DELETE = 'Procurement.IssuanceReturn.Delete'

  // Inventory Adjustment
  static INVENTORYADJUSTMENT_VIEW = 'Procurement.InventoryAdjustment.View';
  static INVENTORYADJUSTMENT_CREATE = 'Procurement.InventoryAdjustment.Create';
  static INVENTORYADJUSTMENT_EDIT = 'Procurement.InventoryAdjustment.Edit';
  static INVENTORYADJUSTMENT_DELETE = 'Procurement.InventoryAdjustment.Delete';

  // Payroll Item
  static PAYROLL_ITEM_VIEW = 'Payroll.PayrollItem.View';
  static PAYROLL_ITEM_CREATE = 'Payroll.PayrollItem.Create';
  static PAYROLL_ITEM_EDIT = 'Payroll.PayrollItem.Edit';
  static PAYROLL_ITEM_DELETE = 'Payroll.PayrollItem.Delete';

  // Payroll Transaction
  static PAYROLL_TRANSACTION_VIEW = 'Payroll.PayrollTransaction.View';
  static PAYROLL_TRANSACTION_CREATE = 'Payroll.PayrollTransaction.Create';
  static PAYROLL_TRANSACTION_EDIT = 'Payroll.PayrollTransaction.Edit';
  static PAYROLL_TRANSACTION_DELETE = 'Payroll.PayrollTransaction.Delete';
  static PAYROLL_TRANSACTION_REVIEW = 'Payroll.PayrollTransaction.Review';
  static PAYROLL_TRANSACTION_APPROVE = 'Payroll.PayrollTransaction.Approve';


  // Asset Category
  static ASSET_CATEGORY_VIEW = 'AssetCategory.View';
  static ASSET_CATEGORY_CREATE = 'AssetCategory.Create';
  static ASSET_CATEGORY_EDIT = 'AssetCategory.Edit';
  static ASSET_CATEGORY_DELETE = 'AssetCategory.Delete';

  // Depreciation Model
  static DEPRECIATION_MODEL_VIEW = 'FixedAsset.DepreciationModel.View';
  static DEPRECIATION_MODEL_CREATE = 'FixedAsset.DepreciationModel.Create';
  static DEPRECIATION_MODEL_EDIT = 'FixedAsset.DepreciationModel.Edit';
  static DEPRECIATION_MODEL_DELETE = 'FixedAsset.DepreciationModel.Delete';

  // Depreciation Adjustment
  static DEPRECIATION_ADJUSTMENT_VIEW = 'FixedAsset.DepreciationAdjustment.View';
  static DEPRECIATION_ADJUSTMENT_CREATE = 'FixedAsset.DepreciationAdjustment.Create';
  static DEPRECIATION_ADJUSTMENT_EDIT = 'FixedAsset.DepreciationAdjustment.Edit';
  static DEPRECIATION_ADJUSTMENT_DELETE = 'FixedAsset.DepreciationAdjustment.Delete';

  // Asset
  static ASSET_VIEW = 'FixedAsset.FixedAsset.View';
  static ASSET_CREATE = 'FixedAsset.FixedAsset.Create';
  static ASSET_EDIT = 'FixedAsset.FixedAsset.Edit';
  static ASSET_DELETE = 'FixedAsset.FixedAsset.Delete';

  // Cwip
  static CWIP_VIEW = 'FixedAsset.CWIP.View';
  static CWIP_CREATE = 'FixedAsset.CWIP.Create';
  static CWIP_EDIT = 'FixedAsset.CWIP.Edit';
  static CWIP_DELETE = 'FixedAsset.CWIP.Delete';

  // Disposal
  static DISPOSAL_VIEW = 'FixedAsset.Disposal.View';
  static DISPOSAL_CREATE = 'FixedAsset.Disposal.Create';
  static DISPOSAL_EDIT = 'FixedAsset.Disposal.Edit';
  static DISPOSAL_DELETE = 'FixedAsset.Disposal.Delete';

  // asset report
  static ASSET_REPORT_VIEW = 'FixedAsset.FixedAssetReport.View';
  static ASSET_REPORT_CREATE = 'FixedAsset.FixedAssetReport.Create';
  static ASSET_REPORT_EDIT = 'FixedAsset.FixedAssetReport.Edit';
  static ASSET_REPORT_DELETE = 'FixedAsset.FixedAssetReport.DELETE';

  // allowance
  static ALLOWANCE_VIEW = 'AllowanceReport.View';

  // Stock
  static STOCK_VIEW = 'Procurement.Stock.View';


  // ADMISSION

  // Shift
  static ADMISSION_SHIFT_VIEW = 'Admission.Shift.View';
  static ADMISSION_SHIFT_CREATE = 'Admission.Shift.Create';
  static ADMISSION_SHIFT_EDIT = 'Admission.Shift.Edit';
  static ADMISSION_SHIFT_DELETE = 'Admission.Shift.Delete';

  // Batch
  static ADMISSION_BATCH_VIEW = 'Admission.Batch.View';
  static ADMISSION_BATCH_CREATE = 'Admission.Batch.Create';
  static ADMISSION_BATCH_EDIT = 'Admission.Batch.Edit';
  static ADMISSION_BATCH_DELETE = 'Admission.Batch.Delete';

  // Domicile
  static ADMISSION_DOMICILE_VIEW = 'Admission.Domicile.View';
  static ADMISSION_DOMICILE_CREATE = 'Admission.Domicile.Create';
  static ADMISSION_DOMICILE_EDIT = 'Admission.Domicile.Edit';
  static ADMISSION_DOMICILE_DELETE = 'Admission.Domicile.Delete';

  // District
  static ADMISSION_DISTRICT_VIEW = 'Admission.District.View';
  static ADMISSION_DISTRICT_CREATE = 'Admission.District.Create';
  static ADMISSION_DISTRICT_EDIT = 'Admission.District.Edit';
  static ADMISSION_DISTRICT_DELETE = 'Admission.District.Delete';

  // City
  static ADMISSION_CITY_VIEW = 'Admission.City.View';
  static ADMISSION_CITY_CREATE = 'Admission.City.Create';
  static ADMISSION_CITY_EDIT = 'Admission.City.Edit';
  static ADMISSION_CITY_DELETE = 'Admission.City.Delete';

  // State
  static ADMISSION_STATE_VIEW = 'Admission.State.View';
  static ADMISSION_STATE_CREATE = 'Admission.State.Create';
  static ADMISSION_STATE_EDIT = 'Admission.State.Edit';
  static ADMISSION_STATE_DELETE = 'Admission.State.Delete';

  // Country
  static ADMISSION_COUNTRY_VIEW = 'Admission.Country.View';
  static ADMISSION_COUNTRY_CREATE = 'Admission.Country.Create';
  static ADMISSION_COUNTRY_EDIT = 'Admission.Country.Edit';
  static ADMISSION_COUNTRY_DELETE = 'Admission.Country.Delete';

  // FeeItem
  static ADMISSION_FEEITEM_VIEW = 'Admission.FeeItem.View';
  static ADMISSION_FEEITEM_CREATE = 'Admission.FeeItem.Create';
  static ADMISSION_FEEITEM_EDIT = 'Admission.FeeItem.Edit';
  static ADMISSION_FEEITEM_DELETE = 'Admission.FeeItem.Delete';

  // Subject
  static ADMISSION_SUBJECT_VIEW = 'Admission.Subject.View';
  static ADMISSION_SUBJECT_CREATE = 'Admission.Subject.Create';
  static ADMISSION_SUBJECT_EDIT = 'Admission.Subject.Edit';
  static ADMISSION_SUBJECT_DELETE = 'Admission.Subject.Delete';

  // Qualification
  static ADMISSION_QUALIFICATION_VIEW = 'Admission.Qualification.View';
  static ADMISSION_QUALIFICATION_CREATE = 'Admission.Qualification.Create';
  static ADMISSION_QUALIFICATION_EDIT = 'Admission.Qualification.Edit';
  static ADMISSION_QUALIFICATION_DELETE = 'Admission.Qualification.Delete';

  // Course
  static ADMISSION_COURSE_VIEW = 'Admission.Course.View';
  static ADMISSION_COURSE_CREATE = 'Admission.Course.Create';
  static ADMISSION_COURSE_EDIT = 'Admission.Course.Edit';
  static ADMISSION_COURSE_DELETE = 'Admission.Course.Delete';

  // Semester
  static ADMISSION_SEMESTER_VIEW = 'Admission.Semester.View';
  static ADMISSION_SEMESTER_CREATE = 'Admission.Semester.Create';
  static ADMISSION_SEMESTER_EDIT = 'Admission.Semester.Edit';
  static ADMISSION_SEMESTER_DELETE = 'Admission.Semester.Delete';

  // Degree
  static ADMISSION_DEGREE_VIEW = 'Admission.Degree.View';
  static ADMISSION_DEGREE_CREATE = 'Admission.Degree.Create';
  static ADMISSION_DEGREE_EDIT = 'Admission.Degree.Edit';
  static ADMISSION_DEGREE_DELETE = 'Admission.Degree.Delete';

  // Program
  static ADMISSION_PROGRAM_VIEW = 'Admission.Program.View';
  static ADMISSION_PROGRAM_CREATE = 'Admission.Program.Create';
  static ADMISSION_PROGRAM_EDIT = 'Admission.Program.Edit';
  static ADMISSION_PROGRAM_DELETE = 'Admission.Program.Delete';

  // Faculty
  static ADMISSION_FACULTY_VIEW = 'Admission.Faculty.View';
  static ADMISSION_FACULTY_CREATE = 'Admission.Faculty.Create';
  static ADMISSION_FACULTY_EDIT = 'Admission.Faculty.Edit';
  static ADMISSION_FACULTY_DELETE = 'Admission.Faculty.Delete';

  // Applicant
  static ADMISSION_APPLICANT_VIEW = 'Admission.Applicant.View';
  static ADMISSION_APPLICANT_CREATE = 'Admission.Applicant.Create';
  static ADMISSION_APPLICANT_EDIT = 'Admission.Applicant.Edit';
  static ADMISSION_APPLICANT_DELETE = 'Admission.Applicant.Delete';

  // Academic Department
  static ADMISSION_ACADEMIC_DEPARTMENT_VIEW = 'Admission.AcademicDepartment.View';
  static ADMISSION_ACADEMIC_DEPARTMENT_CREATE = 'Admission.AcademicDepartment.Create';
  static ADMISSION_ACADEMIC_DEPARTMENT_EDIT = 'Admission.AcademicDepartment.Edit';
  static ADMISSION_ACADEMIC_DEPARTMENT_DELETE = 'Admission.AcademicDepartment.Delete';

  // Admission Criteria
  static ADMISSION_CRITERIA_VIEW = 'Admission.AdmissionCriteria.View';
  static ADMISSION_CRITERIA_CREATE = 'Admission.AdmissionCriteria.Create';
  static ADMISSION_CRITERIA_EDIT = 'Admission.AdmissionCriteria.Edit';
  static ADMISSION_CRITERIA_DELETE = 'Admission.AdmissionCriteria.Delete';

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
