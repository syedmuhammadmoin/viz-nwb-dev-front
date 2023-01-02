export class Permissions {

  // Business Partner
  static BUSINESSPARTNER_CREATE = 'Permissions.Profiling.BusinessPartnerClaims.Create'
  static BUSINESSPARTNER_VIEW = 'Permissions.Profiling.BusinessPartnerClaims.View'
  static BUSINESSPARTNER_EDIT = 'Permissions.Profiling.BusinessPartnerClaims.Edit'
  static BUSINESSPARTNER_DELETE = 'Permissions.Profiling.BusinessPartnerClaims.Delete'

  // Campus
  static CAMPUS_CREATE = 'Permissions.Profiling.CampusClaims.Create'
  static CAMPUS_VIEW = 'Permissions.Profiling.CampusClaims.View'
  static CAMPUS_EDIT = 'Permissions.Profiling.CampusClaims.Edit'
  static CAMPUS_DELETE = 'Permissions.Profiling.CampusClaims.Delete'

  // Bank Account
  static BANKACCOUNT_VIEW = 'Permissions.Finance.BankAccountClaims.View';
  static BANKACCOUNT_CREATE = 'Permissions.Finance.BankAccountClaims.Create';
  static BANKACCOUNT_EDIT = 'Permissions.Finance.BankAccountClaims.Edit';
  static BANKACCOUNT_DELETE = 'Permissions.Finance.BankAccountClaims.Delete';

  // Bank Statement
  static BANKSTATEMENT_VIEW = 'Permissions.Finance.BankStatementClaims.View';
  static BANKSTATEMENT_CREATE = 'Permissions.Finance.BankStatementClaims.Create';
  static BANKSTATEMENT_EDIT = 'Permissions.Finance.BankStatementClaims.Edit';
  static BANKSTATEMENT_DELETE = 'Permissions.Finance.BankStatementClaims.Delete';

  // Address
  // static ADDRESS_VIEW = 'Permissions.AddressClaims.View';
  // static ADDRESS_CREATE = 'Permissions.AddressClaims.Create';
  // static ADDRESS_EDIT = 'Permissions.AddressClaims.Edit';
  // static ADDRESS_DELETE = 'Permissions.AddressClaims.Delete';

  // Warehouse
  static WAREHOUSE_VIEW = 'Permissions.Profiling.WarehouseClaims.View';
  static WAREHOUSE_CREATE = 'Permissions.Profiling.WarehouseClaims.Create';
  static WAREHOUSE_EDIT = 'Permissions.Profiling.WarehouseClaims.Edit';
  static WAREHOUSE_DELETE = 'Permissions.Profiling.WarehouseClaims.Delete';

  // Location
  static LOCATION_VIEW = 'Permissions.Profiling.LocationClaims.View';
  static LOCATION_CREATE = 'Permissions.Profiling.LocationClaims.Create';
  static LOCATION_EDIT = 'Permissions.Profiling.LocationClaims.Edit';
  static LOCATION_DELETE = 'Permissions.Profiling.LocationClaims.Delete';

  // Cash Account
  static CASHACCOUNT_VIEW = 'Permissions.Finance.CashAccountClaims.View';
  static CASHACCOUNT_CREATE = 'Permissions.Finance.CashAccountClaims.Create';
  static CASHACCOUNT_EDIT = 'Permissions.Finance.CashAccountClaims.Edit';
  static CASHACCOUNT_DELETE = 'Permissions.Finance.CashAccountClaims.Delete';

  // Category
  static CATEGORIES_VIEW = 'Permissions.Profiling.CategoriesClaims.View';
  static CATEGORIES_CREATE = 'Permissions.Profiling.CategoriesClaims.Create';
  static CATEGORIES_EDIT = 'Permissions.Profiling.CategoriesClaims.Edit';
  static CATEGORIES_DELETE = 'Permissions.Profiling.CategoriesClaims.Delete';

  //Chart of Account
  static CHARTOFACCOUNT_VIEW = 'Permissions.Finance.ChartOfAccountClaims.View';

  // Department
  static DEPARTMENTS_VIEW = 'Permissions.Payroll.DepartmentClaims.View';
  static DEPARTMENTS_CREATE = 'Permissions.Payroll.DepartmentClaims.Create';
  static DEPARTMENTS_EDIT = 'Permissions.Payroll.DepartmentClaims.Edit';
  static DEPARTMENTS_DELETE = 'Permissions.Payroll.DepartmentClaims.Delete';

  // tax
  static TAXES_VIEW = 'Permissions.Profiling.TaxesClaims.View';
  static TAXES_CREATE = 'Permissions.Profiling.TaxesClaims.Create';
  static TAXES_EDIT = 'Permissions.Profiling.TaxesClaims.Edit';
  static TAXES_DELETE = 'Permissions.Profiling.TaxesClaims.Delete';

  // unit of measurement
  static UNIT_OF_MEASUREMENT_VIEW = 'Permissions.Profiling.UnitOfMeasurementClaims.View';
  static UNIT_OF_MEASUREMENT_CREATE = 'Permissions.Profiling.UnitOfMeasurementClaims.Create';
  static UNIT_OF_MEASUREMENT_EDIT = 'Permissions.Profiling.UnitOfMeasurementClaims.Edit';
  static UNIT_OF_MEASUREMENT_DELETE = 'Permissions.Profiling.UnitOfMeasurementClaims.Delete';

  //Designation
  static DESIGNATIONS_VIEW = 'Permissions.Payroll.DesignationClaims.View';
  static DESIGNATIONS_CREATE = 'Permissions.Payroll.DesignationClaims.Create';
  static DESIGNATIONS_EDIT = 'Permissions.Payroll.DesignationClaims.Edit';
  static DESIGNATIONS_DELETE = 'Permissions.Payroll.DesignationsClaims.Delete';

  // Employee
  static EMPLOYEE_VIEW = "Permissions.Payroll.EmployeeClaims.View";
  static EMPLOYEE_CREATE = "Permissions.Payroll.EmployeeClaims.Create";
  static EMPLOYEE_EDIT = "Permissions.Payroll.EmployeeClaims.Edit";
  static EMPLOYEE_DELETE = "Permissions.Payroll.EmployeeClaims.Delete";

  // Organization
  static ORGANIZATION_VIEW = 'Permissions.Profiling.OrganizationClaims.View';
  static ORGANIZATION_CREATE = 'Permissions.Profiling.OrganizationClaims.Create';
  static ORGANIZATION_EDIT = 'Permissions.Profiling.OrganizationClaims.Edit';
  static ORGANIZATION_DELETE = 'Permissions.Profiling.OrganizationClaims.Delete';

  // Product
  static PRODUCT_VIEW = 'Permissions.Profiling.ProductsClaims.View';
  static PRODUCT_CREATE = 'Permissions.Profiling.ProductsClaims.Create';
  static PRODUCT_EDIT = 'Permissions.Profiling.ProductsClaims.Edit';
  static PRODUCT_DELETE = 'Permissions.Profiling.ProductsClaims.Delete';

  // Budget
  static BUDGET_VIEW = 'Permissions.Budget.BudgetClaims.View';
  static BUDGET_CREATE = 'Permissions.Budget.BudgetClaims.Create';
  static BUDGET_EDIT = 'Permissions.Budget.BudgetClaims.Edit';
  static BUDGET_DELETE = 'Permissions.Budget.BudgetClaims.Delete';
  static BUDGET_REPORT_VIEW = 'Permissions.Budget.BudgetReportClaims.View';
  static BUDGET_COMPARISON_REPORT_VIEW = 'Permissions.Budget.BudgetComparisonReportClaims.View';

  static ESTIMATED_BUDGET_VIEW = 'Permissions.Budget.EstimatedBudgetClaims.View';
  static ESTIMATED_BUDGET_CREATE = 'Permissions.Budget.EstimatedBudgetClaims.Create';
  static ESTIMATED_BUDGET_EDIT = 'Permissions.Budget.EstimatedBudgetClaims.Edit';
  static ESTIMATED_BUDGET_DELETE = 'Permissions.Budget.EstimatedBudgetClaims.Delete';

  // Level 3
  static LEVEL3_VIEW = 'Permissions.Finance.Level3Claims.View';
  static LEVEL3_CREATE = 'Permissions.Finance.Level3Claims.Create';
  static LEVEL3_EDIT = 'Permissions.Finance.Level3Claims.Edit';
  static LEVEL3_DELETE = 'Permissions.Finance.Level3Claims.Delete';

  // Level 4
  static LEVEL4_VIEW = 'Permissions.Finance.Level4Claims.View';
  static LEVEL4_CREATE = 'Permissions.Finance.Level4Claims.Create';
  static LEVEL4_EDIT = 'Permissions.Finance.Level4Claims.Edit';
  static LEVEL4_DELETE = 'Permissions.Finance.Level4Claims.Delete';

  // Report
  static BALANCESHEET_VIEW = 'Permissions.Report.BalanceSheetClaims.View';
  static GENERALLEDGER_VIEW = 'Permissions.Report.GeneralLedgerClaims.View';
  static PROFITLOSS_VIEW = 'Permissions.Report.ProfitLossClaims.View';
  static TRIALBALANCE_VIEW = 'Permissions.Report.TrialBalanceClaims.View';

  // Invoice
  static INVOICE_VIEW = 'Permissions.Finance.InvoiceClaims.View';
  static INVOICE_CREATE = 'Permissions.Finance.InvoiceClaims.Create';
  static INVOICE_EDIT = 'Permissions.Finance.InvoiceClaims.Edit';
  static INVOICE_DELETE = 'Permissions.Finance.InvoiceClaims.Delete';
  static INVOICE_REVIEW = 'Permissions.Finance.InvoiceClaims.Review';
  static INVOICE_APPROVE = 'Permissions.Finance.InvoiceClaims.Approve';

  // sales Order
  static SALESORDER_VIEW = 'Permissions.Finance.SalesOrderClaims.View';
  static SALESORDER_CREATE = 'Permissions.Finance.SalesOrderClaims.Create';
  static SALESORDER_EDIT = 'Permissions.Finance.SalesOrderClaims.Edit';
  static SALESORDER_DELETE = 'Permissions.Finance.SalesOrderClaims.Delete';
  static SALESORDER_REVIEW = 'Permissions.Finance.SalesOrderClaims.Review';
  static SALESORDER_APPROVE = 'Permissions.Finance.SalesOrderClaims.Approve';

  // Bill
  static BILL_VIEW = 'Permissions.Finance.BillClaims.View';
  static BILL_CREATE = 'Permissions.Finance.BillClaims.Create';
  static BILL_EDIT = 'Permissions.Finance.BillClaims.Edit';
  static BILL_DELETE = 'Permissions.Finance.BillClaims.Delete';
  static BILL_REVIEW = 'Permissions.Finance.BillClaims.Review';
  static BILL_APPROVE = 'Permissions.Finance.BillClaims.Approve';

  // purchase Order
  static PURCHASEORDER_VIEW = 'Permissions.Procurement.PurchaseOrderClaims.View';
  static PURCHASEORDER_CREATE = 'Permissions.Procurement.PurchaseOrderClaims.Create';
  static PURCHASEORDER_EDIT = 'Permissions.Procurement.PurchaseOrderClaims.Edit';
  static PURCHASEORDER_DELETE = 'Permissions.Procurement.PurchaseOrderClaims.Delete';
  static PURCHASEORDER_REVIEW = 'Permissions.Procurement.PurchaseOrderClaims.Review';
  static PURCHASEORDER_APPROVE = 'Permissions.Procurement.PurchaseOrderClaims.Approve';

  // Requisition
  static REQUISITION_VIEW = 'Permissions.Procurement.RequisitionClaims.View';
  static REQUISITION_CREATE = 'Permissions.Procurement.RequisitionClaims.Create';
  static REQUISITION_EDIT = 'Permissions.Procurement.RequisitionClaims.Edit';
  static REQUISITION_DELETE = 'Permissions.Procurement.RequisitionClaims.Delete';
  static REQUISITION_REVIEW = 'Permissions.Procurement.RequisitionClaims.Review';
  static REQUISITION_APPROVE = 'Permissions.Procurement.RequisitionClaims.Approve';

  //Quotation
  static QUOTATION_VIEW = 'Permissions.Procurement.QuotationClaims.View'
  static QUOTATION_CREATE = 'Permissions.Procurement.QuotationClaims.Create';
  static QUOTATION_EDIT = 'Permissions.Procurement.QuotationClaims.Edit';
  static QUOTATION_DELETE = 'Permissions.Procurement.QuotationClaims.Delete';
  static QUOTATION_REVIEW = 'Permissions.Procurement.QuotationClaims.Review';
  static QUOTATION_APPROVE = 'Permissions.Procurement.QuotationClaims.Approve';

  //Quotation Comparative
  static QUOTATION_COMPARATIVE_VIEW = 'Permissions.Procurement.QuotationComparativeClaims.View'
  static QUOTATION_COMPARATIVE_CREATE = 'Permissions.Procurement.QuotationComparativeClaims.Create';
  static QUOTATION_COMPARATIVE_EDIT = 'Permissions.Procurement.QuotationComparativeClaims.Edit';
  static QUOTATION_COMPARATIVE_DELETE = 'Permissions.Procurement.QuotationComparativeClaims.Delete';
 
  //Call Quotation
  static CALL_QUOTATION_VIEW = 'Permissions.Procurement.CallForQuotationClaims.View'
  static CALL_QUOTATION_CREATE = 'Permissions.Procurement.CallForQuotationClaims.Create';
  static CALL_QUOTATION_EDIT = 'Permissions.Procurement.CallForQuotationClaims.Edit';
  static CALL_QUOTATION_DELETE = 'Permissions.Procurement.CallForQuotationClaims.Delete';

  // Request Requisition
  static REQUEST_VIEW = 'Permissions.Procurement.RequestClaims.View';
  static REQUEST_CREATE = 'Permissions.Procurement.RequestClaims.Create';
  static REQUEST_EDIT = 'Permissions.Procurement.RequestClaims.Edit';
  static REQUEST_DELETE = 'Permissions.Procurement.RequestClaims.Delete';
  static REQUEST_REVIEW = 'Permissions.Procurement.RequestClaims.Review';
  static REQUEST_APPROVE = 'Permissions.Procurement.RequestClaims.Approve';

  // Bid Evaluation
  static BIDEVALUATION_VIEW = 'Permissions.Procurement.BidEvaluationClaims.View';
  static BIDEVALUATION_CREATE = 'Permissions.Procurement.BidEvaluationClaims.Create';
  static BIDEVALUATION_EDIT = 'Permissions.Procurement.BidEvaluationClaims.Edit';
  static BIDEVALUATION_DELETE = 'Permissions.Procurement.BidEvaluationClaims.Delete';

  // Payment
  static PAYMENT_VIEW = 'Permissions.Finance.PaymentClaims.View';
  static PAYMENT_CREATE = 'Permissions.Finance.PaymentClaims.Create';
  static PAYMENT_EDIT = 'Permissions.Finance.PaymentClaims.Edit';
  static PAYMENT_DELETE = 'Permissions.Finance.PaymentClaims.Delete';
  static PAYMENT_REVIEW = 'Permissions.Finance.PaymentClaims.Review';
  static PAYMENT_APPROVE = 'Permissions.Finance.PaymentClaims.Approve';

  // Internal Recipt
  static RECEIPT_VIEW = 'Permissions.Finance.ReceiptClaims.View';
  static RECEIPT_CREATE = 'Permissions.Finance.ReceiptClaims.Create';
  static RECEIPT_EDIT = 'Permissions.Finance.ReceiptClaims.Edit';
  static RECEIPT_DELETE = 'Permissions.Finance.ReceiptClaims.Delete';
  static RECEIPT_REVIEW = 'Permissions.Finance.ReceiptClaims.Review';
  static RECEIPT_APPROVE = 'Permissions.Finance.ReceiptClaims.Approve';

  static PAYROLL_PAYMENT_VIEW = 'Permissions.Payroll.PayrollPaymentClaims.View';
  static PAYROLL_PAYMENT_CREATE = 'Permissions.Payroll.PayrollPaymentClaims.Create';
  static PAYROLL_PAYMENT_EDIT = 'Permissions.Payroll.PayrollPaymentClaims.Edit';
  static PAYROLL_PAYMENT_DELETE = 'Permissions.Payroll.PayrollPaymentClaims.Delete';

  // Credit Note
  static CREDITNOTE_VIEW = 'Permissions.Finance.CreditNoteClaims.View';
  static CREDITNOTE_CREATE = 'Permissions.Finance.CreditNoteClaims.Create';
  static CREDITNOTE_EDIT = 'Permissions.Finance.CreditNoteClaims.Edit';
  static CREDITNOTE_DELETE = 'Permissions.Finance.CreditNoteClaims.Delete';
  static CREDITNOTE_REVIEW = 'Permissions.Finance.CreditNoteClaims.Review';
  static CREDITNOTE_APPROVE = 'Permissions.Finance.CreditNoteClaims.Approve';

  // Debit Note
  static DEBITNOTE_VIEW = 'Permissions.Finance.DebitNoteClaims.View';
  static DEBITNOTE_CREATE = 'Permissions.Finance.DebitNoteClaims.Create';
  static DEBITNOTE_EDIT = 'Permissions.Finance.DebitNoteClaims.Edit';
  static DEBITNOTE_DELETE = 'Permissions.Finance.DebitNoteClaims.Delete';
  static DEBITNOTE_REVIEW = 'Permissions.Finance.DebitNoteClaims.Review';
  static DEBITNOTE_APPROVE = 'Permissions.Finance.DebitNoteClaims.Approve';

  // Journal Entry Permissions
  static JOURNALENTRY_VIEW = 'Permissions.Finance.JournalEntryClaims.View';
  static JOURNALENTRY_CREATE = 'Permissions.Finance.JournalEntryClaims.Create';
  static JOURNALENTRY_EDIT = 'Permissions.Finance.JournalEntryClaims.Edit';
  static JOURNALENTRY_DELETE = 'Permissions.Finance.JournalEntryClaims.Delete';
  static JOURNALENTRY_REVIEW = 'Permissions.Finance.JournalEntryClaims.Review';
  static JOURNALENTRY_APPROVE = 'Permissions.Finance.JournalEntryClaims.Approve';

  // Auth Permissions
  static AUTH_VIEW = 'Permissions.AccessManagement.AuthClaims.View';
  static AUTH_CREATE = 'Permissions.AccessManagement.AuthClaims.Create';
  static AUTH_EDIT = 'Permissions.AccessManagement.AuthClaims.Edit';
  static AUTH_DELETE = 'Permissions.AccessManagement.AuthClaims.Delete';

  // WORKFLOW Permissions
  static WORKFLOW_VIEW = 'Permissions.Workflow.WorkflowClaims.View';
  static WORKFLOW_CREATE = 'Permissions.Workflow.WorkflowClaims.Create';
  static WORKFLOW_EDIT = 'Permissions.Workflow.WorkflowClaims.Edit';
  static WORKFLOW_DELETE = 'Permissions.Workflow.WorkflowClaims.Delete';

  // STATUS Permissions
  static STATUS_VIEW = 'Permissions.Workflow.WorkflowStatusClaims.View';
  static STATUS_CREATE = 'Permissions.Workflow.WorkflowStatusClaims.Create';
  static STATUS_EDIT = 'Permissions.Workflow.WorkflowStatusClaims.Edit';
  static STATUS_DELETE = 'Permissions.Workflow.WorkflowStatusClaims.Delete';

  // Transaction Recon
  static TRANSACTION_RECON_VIEW = 'Permissions.Finance.TransactionReconClaims.View';
  static TRANSACTION_RECON_CREATE = 'Permissions.Finance.TransactionReconClaims.Create';
  static TRANSACTION_RECON_EDIT = 'Permissions.Finance.TransactionReconClaims.Edit';
  static TRANSACTION_RECON_DELETE = 'Permissions.Finance.TransactionReconClaims.Delete';

  // Bank Recon
  static BANK_RECON_VIEW = 'Permissions.Finance.BankReconClaims.View';
  static BANK_RECON_CREATE = 'Permissions.Finance.BankReconClaims.Create';
  static BANK_RECON_EDIT = 'Permissions.Finance.BankReconClaims.Edit';
  static BANK_RECON_DELETE = 'Permissions.Finance.BankReconClaims.Delete';

  // GRN
  static GRN_VIEW = 'Permissions.Procurement.GRNClaims.View';
  static GRN_CREATE = 'Permissions.Procurement.GRNClaims.Create';
  static GRN_EDIT = 'Permissions.Procurement.GRNClaims.Edit';
  static GRN_DELETE = 'Permissions.Procurement.GRNClaims.Delete';

  // GRN
  static GOODS_RETURN_NOTE_VIEW = 'Permissions.Procurement.GoodsReturnNoteClaims.View';
  static GOODS_RETURN_NOTE_CREATE = 'Permissions.Procurement.GoodsReturnNoteClaims.Create';
  static GOODS_RETURN_NOTE_EDIT = 'Permissions.Procurement.GoodsReturnNoteClaims.Edit';
  static GOODS_RETURN_NOTE_DELETE = 'Permissions.Procurement.GoodsReturnNoteClaims.Delete';

  // GDN
  static GDN_VIEW = 'Permissions.Procurement.GDNClaims.View';
  static GDN_CREATE = 'Permissions.Procurement.GDNClaims.Create';
  static GDN_EDIT = 'Permissions.Procurement.GDNClaims.Edit';
  static GDN_DELETE = 'Permissions.Procurement.GDNClaims.Delete';

  // Issuance
  static ISSUANCE_VIEW = 'Permissions.Procurement.IssuanceClaims.View';
  static ISSUANCE_CREATE = 'Permissions.Procurement.IssuanceClaims.Create';
  static ISSUANCE_EDIT = 'Permissions.Procurement.IssuanceClaims.Edit';
  static ISSUANCE_DELETE = 'Permissions.Procurement.IssuanceClaims.Delete'

  // Issuance Return
  static ISSUANCE_RETURN_VIEW = 'Permissions.Procurement.IssuanceReturnClaims.View';
  static ISSUANCE_RETURN_CREATE = 'Permissions.Procurement.IssuanceReturnClaims.Create';
  static ISSUANCE_RETURN_EDIT = 'Permissions.Procurement.IssuanceReturnClaims.Edit';
  static ISSUANCE_RETURN_DELETE = 'Permissions.Procurement.IssuanceReturnClaims.Delete'

  // Inventory Adjustment
  static INVENTORYADJUSTMENT_VIEW = 'Permissions.Procurement.InventoryAdjustmentClaims.View';
  static INVENTORYADJUSTMENT_CREATE = 'Permissions.Procurement.InventoryAdjustmentClaims.Create';
  static INVENTORYADJUSTMENT_EDIT = 'Permissions.Procurement.InventoryAdjustmentClaims.Edit';
  static INVENTORYADJUSTMENT_DELETE = 'Permissions.Procurement.InventoryAdjustmentClaims.Delete';

  //Payroll Item
  static PAYROLL_ITEM_VIEW = 'Permissions.Payroll.PayrollItemClaims.View';
  static PAYROLL_ITEM_CREATE = 'Permissions.Payroll.PayrollItemClaims.Create';
  static PAYROLL_ITEM_EDIT = 'Permissions.Payroll.PayrollItemClaims.Edit';
  static PAYROLL_ITEM_DELETE = 'Permissions.Payroll.PayrollItemClaims.Delete';

  // Payroll Transaction
  static PAYROLL_TRANSACTION_VIEW = 'Permissions.Payroll.PayrollTransactionClaims.View';
  static PAYROLL_TRANSACTION_CREATE = 'Permissions.Payroll.PayrollTransactionClaims.Create';
  static PAYROLL_TRANSACTION_EDIT = 'Permissions.Payroll.PayrollTransactionClaims.Edit';
  static PAYROLL_TRANSACTION_DELETE = 'Permissions.Payroll.PayrollTransactionClaims.Delete';
  static PAYROLL_TRANSACTION_REVIEW = 'Permissions.Payroll.PayrollTransactionClaims.Review';
  static PAYROLL_TRANSACTION_APPROVE = 'Permissions.Payroll.PayrollTransactionClaims.Approve';


  //Asset Category
  static ASSET_CATEGORY_VIEW = "Permissions.AssetCategoryClaims.View";
  static ASSET_CATEGORY_CREATE = "Permissions.AssetCategoryClaims.Create";
  static ASSET_CATEGORY_EDIT = "Permissions.AssetCategoryClaims.Edit";
  static ASSET_CATEGORY_DELETE = "Permissions.AssetCategoryClaims.Delete";

  //Depreciation Model
  static DEPRECIATION_MODEL_VIEW = "Permissions.DepreciationModelClaims.View";
  static DEPRECIATION_MODEL_CREATE = "Permissions.DepreciationModelClaims.Create";
  static DEPRECIATION_MODEL_EDIT = "Permissions.DepreciationModelClaims.Edit";
  static DEPRECIATION_MODEL_DELETE = "Permissions.DepreciationModelClaims.Delete";

  //Asset
  static ASSET_VIEW = "Permissions.AssetClaims.View";
  static ASSET_CREATE = "Permissions.AssetClaims.Create";
  static ASSET_EDIT = "Permissions.AssetClaims.Edit";
  static ASSET_DELETE = "Permissions.AssetClaims.Delete";

  // allowance
  static ALLOWANCE_VIEW = 'Permissions.AllowanceReportClaims.View';

  // Stock
  static STOCK_VIEW = 'Permissions.Procurement.StockClaims.View';

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
  BankAccount ,
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
  CallForQuotaion
}

// export enum DocStatus {
//   Draft, // +1
//   Rejected, // +1
//   Unpaid, // +1
//   Partial, // +1
//   Paid, // +1
//   Submitted,
//   Reviewed
// }

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


// Draft - Yellow,  Cancelled - Gray, Upaid - Red, Partial - Yellow,  Paid - Green, Submitted - Yellow, Reviewed - Green
