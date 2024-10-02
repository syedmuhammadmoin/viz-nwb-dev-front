export class Permissions {
 // Access Management
 static ROLE_CREATE: 'Permissions.AuthClaims.CR';
 static ROLE_VIEW: 'Permissions.AuthClaims.VW';
 static ROLE_EDIT: 'Permissions.AuthClaims.ED';
 static ROLE_DELETE: 'Permissions.AuthClaims.DL';
 // Business Partner
 static BUSINESSPARTNER_CREATE = 'Permissions.BusinessPartnerClaims.CR';
 static BUSINESSPARTNER_VIEW = 'Permissions.BusinessPartnerClaims.VW';
 static BUSINESSPARTNER_EDIT = 'Permissions.BusinessPartnerClaims.ED';
 static BUSINESSPARTNER_DELETE = 'Permissions.BusinessPartnerClaims.DL';

 // Customer
 static CUSTOMER_CREATE = 'Permissions.CustomerClaims.CR';
 static CUSTOMER_VIEW = 'Permissions.CustomerClaims.VW';
 static CUSTOMER_EDIT = 'Permissions.CustomerClaims.ED';
 static CUSTOMER_DELETE = 'Permissions.CustomerClaims.DL';

 // Bank Account
 static BANKACCOUNT_VIEW = 'Permissions.BankAccountClaims.VW';
 static BANKACCOUNT_CREATE = 'Permissions.BankAccountClaims.CR';
 static BANKACCOUNT_EDIT = 'Permissions.BankAccountClaims.ED';
 static BANKACCOUNT_DELETE = 'Permissions.BankAccountClaims.DL';

 // Bank Statement
 static BANKSTATEMENT_VIEW = 'Permissions.BankStatementClaims.VW';
 static BANKSTATEMENT_CREATE = 'Permissions.BankStatementClaims.CR';
 static BANKSTATEMENT_EDIT = 'Permissions.BankStatementClaims.ED';
 static BANKSTATEMENT_DELETE = 'Permissions.BankStatementClaims.DL';

 // Address
 // static ADDRESS_VIEW = 'Permissions.AddressClaims.VW';
 // static ADDRESS_CREATE = 'Permissions.AddressClaims.CR';
 // static ADDRESS_EDIT = 'Permissions.AddressClaims.ED';
 // static ADDRESS_DELETE = 'Permissions.AddressClaims.DL';

 // Warehouse
 static WAREHOUSE_VIEW = 'Permissions.WarehouseClaims.VW';
 static WAREHOUSE_CREATE = 'Permissions.WarehouseClaims.CR';
 static WAREHOUSE_EDIT = 'Permissions.WarehouseClaims.ED';
 static WAREHOUSE_DELETE = 'Permissions.WarehouseClaims.DL';

 // Location
 static LOCATION_VIEW = 'Permissions.LocationClaims.VW';
 static LOCATION_CREATE = 'Permissions.LocationClaims.CR';
 static LOCATION_EDIT = 'Permissions.LocationClaims.ED';
 static LOCATION_DELETE = 'Permissions.LocationClaims.DL';

 // Cash Account
 static CASHACCOUNT_VIEW = 'Permissions.CashAccountClaims.VW';
 static CASHACCOUNT_CREATE = 'Permissions.CashAccountClaims.CR';
 static CASHACCOUNT_EDIT = 'Permissions.CashAccountClaims.ED';
 static CASHACCOUNT_DELETE = 'Permissions.CashAccountClaims.DL';

 // Category
 static CATEGORIES_VIEW = 'Permissions.CategoriesClaims.VW';
 static CATEGORIES_CREATE = 'Permissions.CategoriesClaims.CR';
 static CATEGORIES_EDIT = 'Permissions.CategoriesClaims.ED';
 static CATEGORIES_DELETE = 'Permissions.CategoriesClaims.DL';

 // Chart of Account
 static CHARTOFACCOUNT_VIEW = 'Permissions.ChartOfAccountClaims.VW';

 // Department
 static DEPARTMENTS_VIEW = 'Permissions.DepartmentsClaims.VW';
 static DEPARTMENTS_CREATE = 'Permissions.DepartmentsClaims.CR';
 static DEPARTMENTS_EDIT = 'Permissions.DepartmentsClaims.ED';
 static DEPARTMENTS_DELETE = 'Permissions.DepartmentsClaims.DL';

 // Designation
 // static DESIGNATIONS_VIEW = 'Permissions.DesignationsClaims.VW';
 // static DESIGNATIONS_CREATE = 'Permissions.DesignationsClaims.CR';
 // static DESIGNATIONS_EDIT = 'Permissions.DesignationsClaims.ED';
 // static DESIGNATIONS_DELETE = 'Permissions.DesignationsClaims.DL';

 // Organization
 static ORGANIZATION_VIEW = 'Permissions.OrganizationClaims.VW';
 static ORGANIZATION_CREATE = 'Permissions.OrganizationClaims.CR';
 static ORGANIZATION_EDIT = 'Permissions.OrganizationClaims.ED';
 static ORGANIZATION_DELETE = 'Permissions.OrganizationClaims.DL';

 // Product
 static PRODUCT_VIEW = 'Permissions.ProductsClaims.VW';
 static PRODUCT_CREATE = 'Permissions.ProductsClaims.CR';
 static PRODUCT_EDIT = 'Permissions.ProductsClaims.ED';
 static PRODUCT_DELETE = 'Permissions.ProductsClaims.DL';

 // Level 3
 static LEVEL3_VIEW = 'Permissions.Level3Claims.VW';
 static LEVEL3_CREATE = 'Permissions.Level3Claims.CR';
 static LEVEL3_EDIT = 'Permissions.Level3Claims.ED';
 static LEVEL3_DELETE = 'Permissions.Level3Claims.DL';

 // Level 4
 static LEVEL4_VIEW = 'Permissions.Level4Claims.VW';
 static LEVEL4_CREATE = 'Permissions.Level4Claims.CR';
 static LEVEL4_EDIT = 'Permissions.Level4Claims.ED';
 static LEVEL4_DELETE = 'Permissions.Level4Claims.DL';

 // Report
 static BALANCESHEET_VIEW = 'Permissions.BalanceSheetClaims.VW';
 static GENERALLEDGER_VIEW = 'Permissions.GeneralLedgerClaims.VW';
 static PROFITLOSS_VIEW = 'Permissions.ProfitLossClaims.VW';
 static TRIALBALANCE_VIEW = 'Permissions.TrialBalanceClaims.VW';

 // Invoice
 static INVOICE_VIEW = 'Permissions.InvoiceClaims.VW';
 static INVOICE_CREATE = 'Permissions.InvoiceClaims.CR';
 static INVOICE_EDIT = 'Permissions.InvoiceClaims.ED';
 static INVOICE_DELETE = 'Permissions.InvoiceClaims.DL';
 static INVOICE_REVIEW = 'Permissions.InvoiceClaims.Review';
 static INVOICE_APPROVE = 'Permissions.InvoiceClaims.Approve';

 // sales Order
 static SALESORDER_VIEW = 'Permissions.SalesOrderClaims.VW';
 static SALESORDER_CREATE = 'Permissions.SalesOrderClaims.CR';
 static SALESORDER_EDIT = 'Permissions.SalesOrderClaims.ED';
 static SALESORDER_DELETE = 'Permissions.SalesOrderClaims.DL';
 static SALESORDER_REVIEW = 'Permissions.SalesOrderClaims.Review';
 static SALESORDER_APPROVE = 'Permissions.SalesOrderClaims.Approve';

 // Bill
 static BILL_VIEW = 'Permissions.BillClaims.VW';
 static BILL_CREATE = 'Permissions.BillClaims.CR';
 static BILL_EDIT = 'Permissions.BillClaims.ED';
 static BILL_DELETE = 'Permissions.BillClaims.DL';
 static BILL_REVIEW = 'Permissions.BillClaims.Review';
 static BILL_APPROVE = 'Permissions.BillClaims.Approve';

 // purchase Order
 static PURCHASEORDER_VIEW = 'Permissions.PurchaseOrderClaims.VW';
 static PURCHASEORDER_CREATE = 'Permissions.PurchaseOrderClaims.CR';
 static PURCHASEORDER_EDIT = 'Permissions.PurchaseOrderClaims.ED';
 static PURCHASEORDER_DELETE = 'Permissions.PurchaseOrderClaims.DL';
 static PURCHASEORDER_REVIEW = 'Permissions.PurchaseOrderClaims.Review';
 static PURCHASEORDER_APPROVE = 'Permissions.PurchaseOrderClaims.Approve';

 // Payment Voucher
 static PAYMENT_VIEW = 'Permissions.PaymentClaims.VW';
 static PAYMENT_CREATE = 'Permissions.PaymentClaims.CR';
 static PAYMENT_EDIT = 'Permissions.PaymentClaims.ED';
 static PAYMENT_DELETE = 'Permissions.PaymentClaims.DL';
 static PAYMENT_REVIEW = 'Permissions.PaymentClaims.Review';
 static PAYMENT_APPROVE = 'Permissions.PaymentClaims.Approve';

 // Payment Receipt
 static RECEIPT_VIEW = 'Permissions.ReceiptClaims.VW';
 static RECEIPT_CREATE = 'Permissions.ReceiptClaims.CR';
 static RECEIPT_EDIT = 'Permissions.ReceiptClaims.ED';
 static RECEIPT_DELETE = 'Permissions.ReceiptClaims.DL';
 // static RECEIPT_REVIEW = 'Permissions.ReceiptClaims.Review';
 // static RECEIPT_APPROVE = 'Permissions.ReceiptClaims.Approve';

 // Credit Note
 static CREDITNOTE_VIEW = 'Permissions.CreditNoteClaims.VW';
 static CREDITNOTE_CREATE = 'Permissions.CreditNoteClaims.CR';
 static CREDITNOTE_EDIT = 'Permissions.CreditNoteClaims.ED';
 static CREDITNOTE_DELETE = 'Permissions.CreditNoteClaims.DL';
 static CREDITNOTE_REVIEW = 'Permissions.CreditNoteClaims.Review';
 static CREDITNOTE_APPROVE = 'Permissions.CreditNoteClaims.Approve';

 // Debit Note
 static DEBITNOTE_VIEW = 'Permissions.DebitNoteClaims.VW';
 static DEBITNOTE_CREATE = 'Permissions.DebitNoteClaims.CR';
 static DEBITNOTE_EDIT = 'Permissions.DebitNoteClaims.ED';
 static DEBITNOTE_DELETE = 'Permissions.DebitNoteClaims.DL';
 static DEBITNOTE_REVIEW = 'Permissions.DebitNoteClaims.Review';
 static DEBITNOTE_APPROVE = 'Permissions.DebitNoteClaims.Approve';

 // Journal Entry Permissions
 static JOURNALENTRY_VIEW = 'Permissions.JournalEntryClaims.VW';
 static JOURNALENTRY_CREATE = 'Permissions.JournalEntryClaims.CR';
 static JOURNALENTRY_EDIT = 'Permissions.JournalEntryClaims.ED';
 static JOURNALENTRY_DELETE = 'Permissions.JournalEntryClaims.DL';
 static JOURNALENTRY_REVIEW = 'Permissions.JournalEntryClaims.Review';
 static JOURNALENTRY_APPROVE = 'Permissions.JournalEntryClaims.Approve';

  // Journal  Permissions
  static JOURNAL_VIEW = 'Permissions.JournalClaims.VW';
  static JOURNAL_CREATE = 'Permissions.JournalClaims.CR';
  static JOURNAL_EDIT = 'Permissions.JournalClaims.ED';
  static JOURNAL_DELETE = 'Permissions.JournalClaims.DL';
  static JOURNAL_REVIEW = 'Permissions.JournalClaims.Review';
  static JOURNAL_APPROVE = 'Permissions.JournalClaims.Approve';

 // Auth Permissions
 static AUTH_VIEW = 'Permissions.AuthClaims.VW';
 static AUTH_CREATE = 'Permissions.AuthClaims.CR';
 static AUTH_EDIT = 'Permissions.AuthClaims.ED';
 static AUTH_DELETE = 'Permissions.AuthClaims.DL';

 // WORKFLOW Permissions
 static WORKFLOW_VIEW = 'Permissions.WorkflowClaims.VW';
 static WORKFLOW_CREATE = 'Permissions.WorkflowClaims.CR';
 static WORKFLOW_EDIT = 'Permissions.WorkflowClaims.ED';
 static WORKFLOW_DELETE = 'Permissions.WorkflowClaims.DL';

 // STATUS Permissions
 static STATUS_VIEW = 'Permissions.WorkflowStatusClaims.VW';
 static STATUS_CREATE = 'Permissions.WorkflowStatusClaims.CR';
 static STATUS_EDIT = 'Permissions.WorkflowStatusClaims.ED';
 static STATUS_DELETE = 'Permissions.WorkflowStatusClaims.DL';

 // Transaction Recon
 static TRANSACTION_RECON_VIEW = 'Permissions.TransactionReconClaims.VW';
 static TRANSACTION_RECON_CREATE = 'Permissions.TransactionReconClaims.CR';
 static TRANSACTION_RECON_EDIT = 'Permissions.TransactionReconClaims.ED';
 static TRANSACTION_RECON_DELETE = 'Permissions.TransactionReconClaims.DL';

 // Bank Recon
 static BANK_RECON_VIEW = 'Permissions.BankReconClaims.VW';
 static BANK_RECON_CREATE = 'Permissions.BankReconClaims.CR';
 static BANK_RECON_EDIT = 'Permissions.BankReconClaims.ED';
 static BANK_RECON_DELETE = 'Permissions.BankReconClaims.DL';

 // GRN
 static GRN_VIEW = 'Permissions.GoodsReceivingNoteClaims.VW';
 static GRN_CREATE = 'Permissions.GoodsReceivingNoteClaims.CR';
 static GRN_EDIT = 'Permissions.GoodsReceivingNoteClaims.ED';
 static GRN_DELETE = 'Permissions.GoodsReceivingNoteClaims.DL';

 // GDN
 static GDN_VIEW = 'Permissions.GoodsDispatchNoteClaims.VW';
 static GDN_CREATE = 'Permissions.GoodsDispatchNoteClaims.CR';
 static GDN_EDIT = 'Permissions.GoodsDispatchNoteClaims.ED';
 static GDN_DELETE = 'Permissions.GoodsDispatchNoteClaims.DL';

 // Inventory Adjustment
 static INVENTORY_ADJUSTMENT_VIEW =
   'Permissions.InventoryAdjustmentClaims.VW';
 static INVENTORY_ADJUSTMENT_CREATE =
   'Permissions.InventoryAdjustmentClaims.CR';
 static INVENTORY_ADJUSTMENT_EDIT =
   'Permissions.InventoryAdjustmentClaims.ED';
 static INVENTORY_ADJUSTMENT_DELETE =
   'Permissions.InventoryAdjustmentClaims.DL';

 // Stock
 static STOCK_VIEW = 'Permissions.StockClaims.VW';

 // Requisition
 static REQUISITION_VIEW = 'Permissions.RequisitionClaims.VW';
 static REQUISITION_CREATE = 'Permissions.RequisitionClaims.CR';
 static REQUISITION_EDIT = 'Permissions.RequisitionClaims.ED';
 static REQUISITION_DELETE = 'Permissions.RequisitionClaims.DL';


   // tax
   static TAXES_VIEW = 'Permissions.TaxesClaims.VW';
   static TAXES_CREATE = 'Permissions.TaxesClaims.CR';
   static TAXES_EDIT = 'Permissions.TaxesClaims.ED';
   static TAXES_DELETE = 'Permissions.TaxesClaims.DL';



  // Campus
  static CAMPUS_CREATE = 'Profiling.Campus.CR'
  static CAMPUS_VIEW = 'Profiling.Campus.VW'
  static CAMPUS_EDIT = 'Profiling.Campus.ED'
  static CAMPUS_DELETE = 'Profiling.Campus.DL'

 

  

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

  static BUDGET_REAPPROPRIATION_VIEW = 'Budget.BudgetReappropriation.VW';
  static BUDGET_REAPPROPRIATION_CREATE= 'Budget.BudgetReappropriation.CR';
  static BUDGET_REAPPROPRIATION_EDIT = 'Budget.BudgetReappropriation.ED';




 
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

  
  static RECEIPT_REVIEW = 'Finance.Receipt.Review';
  static RECEIPT_APPROVE = 'Finance.Receipt.Approve';

  static PAYROLL_PAYMENT_VIEW = 'Payroll.PayrollPayment.VW';
  static PAYROLL_PAYMENT_CREATE = 'Payroll.PayrollPayment.CR';
  static PAYROLL_PAYMENT_EDIT = 'Payroll.PayrollPayment.ED';
  static PAYROLL_PAYMENT_DELETE = 'Payroll.PayrollPayment.DL';

  



  

    // Petty Cash Entry Permissions
    static PETTYCASH_VIEW = 'Finance.PettyCash.VW';
    static PETTYCASH_CREATE = 'Finance.PettyCash.CR';
    static PETTYCASH_EDIT = 'Finance.PettyCash.ED';
    static PETTYCASH_DELETE = 'Finance.PettyCash.DL';
    static PETTYCASH_REVIEW = 'Finance.PettyCash.Review';
    static PETTYCASH_APPROVE = 'Finance.PettyCash.Approve';
  

 

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

  static DASHBOARD_PROFITLOSSSUMMARY_VIEW = 'Dashboard.ProfitLossSummary.VW';
  static DASHBOARD_BALANCESHEETSUMMARY_VIEW = 'Dashboard.BalanceSheetSummary.VW';
  static DASHBOARD_BANKBALANCESUMMARY_VIEW = 'Dashboard.BankBalance.VW'

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
  DepreciationAdjustment,
  EstimatedBudget,
  Budget,
  PettyCash,
  Journal
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
  Contractor,
  Student,
  ServiceProvider =7,
}

export enum ScopeList{
  Services = 0,
  Goods = 1
}
export enum TaxType {
  SalesTaxAsset,
  SalesTaxLiability,
  IncomeTaxAsset,
  IncomeTaxLiability,
  SRBTaxAsset,
  SRBTaxLiability
}

export enum TaxComputation{
  GroupOfTaxes = 0,
  Fixed = 1,
  Percentage = 2,
  PercentageTaxIncluded = 3,
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
export enum JournalType
{
  Sales=0,
  Purchase=1,
  Bank=2,
  Cash=3,
  Miscellaneous=4
}
