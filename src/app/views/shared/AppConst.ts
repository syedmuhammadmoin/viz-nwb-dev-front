import {DocType} from './AppEnum';

export class AppConst {

  static appBaseUrl: string;
  static remoteServiceBaseUrl: string;
  static appBaseHref: string;
  static apiKey: string;

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
    { id: 1, name: 'Permanent'},
    { id: 2, name: 'Contractual'},
    { id: 3, name: 'Daily wages'},
    { id: 4, name: 'Adhoc'}
  ];
  static status = {
    0: 'Pending',
    1: 'Partial',
    2: 'Paid'
  }
  
  static depreciationMethod = [
    { id: 0, name: 'Straight Line'},
    { id: 1, name: 'Declining Rate'},
   
  ]

  static paymentType = {
    1: 'Inflow',
    2: 'Outflow'
  }
  static PermissionsDisplayName = {

    // Business Partner
    'Permissions.Profiling.BusinessPartnerClaims.Create': 'Business Partner Create',
    'Permissions.Profiling.BusinessPartnerClaims.View': 'Business Partner View',
    'Permissions.Profiling.BusinessPartnerClaims.Edit': 'Business Partner Update',
    'Permissions.Profiling.BusinessPartnerClaims.Delete': 'Business Partner Delete',

    // Invoice
    'Permissions.Finance.InvoiceClaims.Create': 'Invoice Create',
    'Permissions.Finance.InvoiceClaims.View': 'Invoice View',
    'Permissions.Finance.InvoiceClaims.Edit': 'Invoice Update',
    'Permissions.Finance.InvoiceClaims.Delete': 'Invoice Delete',
    'Permissions.Finance.InvoiceClaims.Review': 'Invoice Review',
    'Permissions.Finance.InvoiceClaims.Approve': 'Invoice Approve',

    // Bank Account
    'Permissions.Finance.BankAccountClaims.View': 'Bank Account View',
    'Permissions.Finance.BankAccountClaims.Create': 'Bank Account Create',
    'Permissions.Finance.BankAccountClaims.Edit': 'Bank Account Update',
    'Permissions.Finance.BankAccountClaims.Delete': 'Bank Account Delete',

    // Bank Statement
    'Permissions.Finance.BankStatementClaims.View': 'Bank Statement View',
    'Permissions.Finance.BankStatementClaims.Create': 'Bank Statement Create',
    'Permissions.Finance.BankStatementClaims.Edit': 'Bank Statement Update',
    'Permissions.Finance.BankStatementClaims.Delete': 'Bank Statement Delete',

    // Business Partner Entities
    'Permissions.Profiling.BusinessPartnerEntitiesClaims.View': 'Business Partner Entities View',
    'Permissions.Profiling.BusinessPartnerEntitiesClaims.Create': 'Business Partner Entities Create',
    'Permissions.Profiling.BusinessPartnerEntitiesClaims.Edit': 'Business Partner Entities Update',
    'Permissions.Profiling.BusinessPartnerEntitiesClaims.Delete': 'Business Partner Entities Delete',

    // Business Partner type
    'Permissions.Profiling.BusinessPartnerTypesClaims.View': 'Business Partner Type View',
    'Permissions.Profiling.BusinessPartnerTypesClaims.Create': 'Business Partner Type Create',
    'Permissions.Profiling.BusinessPartnerTypesClaims.Edit': 'Business Partner Type Update',
    'Permissions.Profiling.BusinessPartnerTypesClaims.Delete': 'Business Partner Type Delete',

    // Campus
    'Permissions.Profiling.CampusClaims.View': 'Campus View',
    'Permissions.Profiling.CampusClaims.Create': 'Campus Create',
    'Permissions.Profiling.CampusClaims.Edit': 'Campus Update',
    'Permissions.Profiling.CampusClaims.Delete': 'Campus Delete',

    // Cash Account
    'Permissions.Finance.CashAccountClaims.View': 'Cash Account View',
    'Permissions.Finance.CashAccountClaims.Create': 'Cash Account Create',
    'Permissions.Finance.CashAccountClaims.Edit': 'Cash Account Update',
    'Permissions.Finance.CashAccountClaims.Delete': 'Cash Account Delete',

    // Category
    'Permissions.Profiling.CategoriesClaims.View': 'Category View',
    'Permissions.Profiling.CategoriesClaims.Create': 'Category Create',
    'Permissions.Profiling.CategoriesClaims.Edit': 'Category Update',
    'Permissions.Profiling.CategoriesClaims.Delete': 'Category Delete',

    // Chart of Account
    'Permissions.Finance.ChartOfAccountClaims.View': 'Chart of Account View',

    // Country
    'Permissions.Profiling.CountryClaims.View': 'Country View',
    'Permissions.Profiling.CountryClaims.Create': 'Country Create',
    'Permissions.Profiling.CountryClaims.Edit': 'Country Update',
    'Permissions.Profiling.CountryClaims.Delete': 'Country Delete',

    // State
    'Permissions.Profiling.StateClaims.View': 'State View',
    'Permissions.Profiling.StateClaims.Create': 'State Create',
    'Permissions.Profiling.StateClaims.Edit': 'State Update',
    'Permissions.Profiling.StateClaims.Delete': 'State Delete',

    // City
    'Permissions.Profiling.CityClaims.View': 'City View',
    'Permissions.Profiling.CityClaims.Create': 'City Create',
    'Permissions.Profiling.CityClaims.Edit': 'City Update',
    'Permissions.Profiling.CityClaims.Delete': 'City Delete',

    // Department
    'Permissions.Payroll.DepartmentClaims.View': 'Department View',
    'Permissions.Payroll.DepartmentClaims.Create': 'Department Create',
    'Permissions.Payroll.DepartmentClaims.Edit': 'Department Update',
    'Permissions.Payroll.DepartmentClaims.Delete': 'Department Delete',

    // Designation
    'Permissions.Payroll.DesignationClaims.View': 'Designation View',
    'Permissions.Payroll.DesignationClaims.Create': 'Designation Create',
    'Permissions.Payroll.DesignationClaims.Edit': 'Designation Update',
    'Permissions.Payroll.DesignationClaims.Delete': 'Designation Delete',

    // Employee
    'Permissions.Payroll.EmployeeClaims.View': 'Employee View',
    'Permissions.Payroll.EmployeeClaims.Create': 'Employee Create',
    'Permissions.Payroll.EmployeeClaims.Edit': 'Employee Update',
    'Permissions.Payroll.EmployeeClaims.Delete': 'Employee Delete',

    // Organization
    'Permissions.Profiling.OrganizationClaims.View': 'Organization View',
    'Permissions.Profiling.OrganizationClaims.Create': 'Organization Create',
    'Permissions.Profiling.OrganizationClaims.Edit': 'Organization Update',
    'Permissions.Profiling.OrganizationClaims.Delete': 'Organization Delete',

    // Payroll Item
    'Permissions.Payroll.PayrollItemClaims.View': 'Payroll Item View',
    'Permissions.Payroll.PayrollItemClaims.Create': 'Payroll Item Create',
    'Permissions.Payroll.PayrollItemClaims.Edit': 'Payroll Item Update',
    'Permissions.Payroll.PayrollItemClaims.Delete': 'Payroll Item Delete',

    // Payroll Transaction
    'Permissions.Payroll.PayrollTransactionClaims.View': 'Payroll Transaction View',
    'Permissions.Payroll.PayrollTransactionClaims.Create': 'Payroll Transaction Create',
    'Permissions.Payroll.PayrollTransactionClaims.Edit': 'Payroll Transaction Update',
    'Permissions.Payroll.PayrollTransactionClaims.Delete': 'Payroll Transaction Delete',
    'Permissions.Payroll.PayrollTransactionClaims.Review': 'Payroll Transaction Review',
    'Permissions.Payroll.PayrollTransactionClaims.Approve': 'Payroll Transaction Approve',

    // Allowance
    'Permissions.Payroll.AllowanceReportClaims.View': 'Allowance Report View',

    // Product
    'Permissions.Profiling.ProductsClaims.View': 'Product View',
    'Permissions.Profiling.ProductsClaims.Create': 'Product Create',
    'Permissions.Profiling.ProductsClaims.Edit': 'Product Update',
    'Permissions.Profiling.ProductsClaims.Delete': 'Product Delete',

    // Tax
    'Permissions.Profiling.TaxesClaims.View': 'Tax View',
    'Permissions.Profiling.TaxesClaims.Create': 'Tax Create',
    'Permissions.Profiling.TaxesClaims.Edit': 'Tax Update',
    'Permissions.Profiling.TaxesClaims.Delete': 'Tax Delete',

    // Unit Of Measurement
    'Permissions.Profiling.UnitOfMeasurementClaims.View': 'Unit Of Measurement View',
    'Permissions.Profiling.UnitOfMeasurementClaims.Create': 'Unit Of Measurement Create',
    'Permissions.Profiling.UnitOfMeasurementClaims.Edit': 'Unit Of Measurement Update',
    'Permissions.Profiling.UnitOfMeasurementClaims.Delete': 'Unit Of Measurement Delete',

    // Vehicle
    'Permissions.VehicleClaims.View': 'Vehicle View',
    'Permissions.VehicleClaims.Create': 'Vehicle Create',
    'Permissions.VehicleClaims.Edit': 'Vehicle Update',
    'Permissions.VehicleClaims.Delete': 'Vehicle Delete',

    // Level 3
    'Permissions.Finance.Level3Claims.View': 'Chart of Account Level 3 View',
    'Permissions.Finance.Level3Claims.Create': 'Chart of Account Level 3 Create',
    'Permissions.Finance.Level3Claims.Edit': 'Chart of Account Level 3 Update',
    'Permissions.Finance.Level3Claims.Delete': 'Chart of Account Level 3 Delete',

    // Level 4
    'Permissions.Finance.Level4Claims.View': 'Chart of Account Level 4 View',
    'Permissions.Finance.Level4Claims.Create': 'Chart of Account Level 4 Create',
    'Permissions.Finance.Level4Claims.Edit': 'Chart of Account Level 4 Update',
    'Permissions.Finance.Level4Claims.Delete': 'Chart of Account Level 4 Delete',

    // Balance Sheet
    'Permissions.Report.BalanceSheetClaims.View': 'Balance Sheet',

    // General Ledger
    'Permissions.Report.GeneralLedgerClaims.View': 'General Ledger',

    // Income Expenditure
    'Permissions.Report.ProfitLossClaims.View': 'Profit and Loss Statement',

    // Trial Balance
    'Permissions.Report.TrialBalanceClaims.View': 'Trial Balance',

    // Bill
    'Permissions.Finance.BillClaims.View': 'Bill View',
    'Permissions.Finance.BillClaims.Create': 'Bill Create',
    'Permissions.Finance.BillClaims.Edit': 'Bill Update',
    'Permissions.Finance.BillClaims.Delete': 'Bill Delete',
    'Permissions.Finance.BillClaims.Review': 'Bill Review',
    'Permissions.Finance.BillClaims.Approve': 'Bill Approve',

    // Payment
    'Permissions.Finance.PaymentClaims.View': 'Payment View',
    'Permissions.Finance.PaymentClaims.Create': 'Payment Create',
    'Permissions.Finance.PaymentClaims.Edit': 'Payment Update',
    'Permissions.Finance.PaymentClaims.Delete': 'Payment Delete',
    'Permissions.Finance.PaymentClaims.Review': 'Payment Review',
    'Permissions.Finance.PaymentClaims.Approve': 'Payment Approve',

    // Internal Receipt
    'Permissions.Finance.ReceiptClaims.View': 'Receipt View',
    'Permissions.Finance.ReceiptClaims.Create': 'Receipt Create',
    'Permissions.Finance.ReceiptClaims.Edit': 'Receipt Update',
    'Permissions.Finance.ReceiptClaims.Delete': 'Receipt Delete',
    'Permissions.Finance.ReceiptClaims.Review': 'Receipt Review',
    'Permissions.Finance.ReceiptClaims.Approve': 'Receipt Approve',

    // Payroll Payment
    'Permissions.Payroll.PayrollPaymentClaims.View': 'Payroll Payment View',
    'Permissions.Payroll.PayrollPaymentClaims.Create': 'Payroll Payment Create',
    'Permissions.Payroll.PayrollPaymentClaims.Edit': 'Payroll Payment Update',
    'Permissions.Payroll.PayrollPaymentClaims.Delete': 'Payroll Payment Delete',

    // Credit Note
    'Permissions.Finance.CreditNoteClaims.View': 'Credit Note View',
    'Permissions.Finance.CreditNoteClaims.Create': 'Credit Note Create',
    'Permissions.Finance.CreditNoteClaims.Edit': 'Credit Note Update',
    'Permissions.Finance.CreditNoteClaims.Delete': 'Credit Note Delete',
    'Permissions.Finance.CreditNoteClaims.Review': 'Credit Note Review',
    'Permissions.Finance.CreditNoteClaims.Approve': 'Credit Note Approve',

    // Debit Note
    'Permissions.Finance.DebitNoteClaims.View': 'Debit Note View',
    'Permissions.Finance.DebitNoteClaims.Create': 'Debit Note Create',
    'Permissions.Finance.DebitNoteClaims.Edit': 'Debit Note Update',
    'Permissions.Finance.DebitNoteClaims.Delete': 'Debit Note Delete',
    'Permissions.Finance.DebitNoteClaims.Review': 'Debit Note Review',
    'Permissions.Finance.DebitNoteClaims.Approve': 'Debit Note Approve',

    // Journal Voucher
    'Permissions.Finance.JournalEntryClaims.View': 'Journal Voucher View',
    'Permissions.Finance.JournalEntryClaims.Create': 'Journal Voucher Create',
    'Permissions.Finance.JournalEntryClaims.Edit': 'Journal Voucher Update',
    'Permissions.Finance.JournalEntryClaims.Delete': 'Journal Voucher Delete',
    'Permissions.Finance.JournalEntryClaims.Review': 'Journal Voucher Review',
    'Permissions.Finance.JournalEntryClaims.Approve': 'Journal Voucher Approve',

    // Access Management
    'Permissions.AccessManagement.AuthClaims.Create': 'Access Management Create',
    'Permissions.AccessManagement.AuthClaims.View': 'Access Management View',
    'Permissions.AccessManagement.AuthClaims.Edit': 'Access Management Update',
    'Permissions.AccessManagement.AuthClaims.Delete': 'Access Management Delete',

    // Workflow
    'Permissions.Workflow.WorkflowClaims.Create': 'Workflow Create',
    'Permissions.Workflow.WorkflowClaims.View': 'Workflow View',
    'Permissions.Workflow.WorkflowClaims.Edit': 'Workflow Update',
    'Permissions.Workflow.WorkflowClaims.Delete': 'Workflow Delete',

    // Status
    'Permissions.Workflow.WorkflowStatusClaims.Create': 'Status Create',
    'Permissions.Workflow.WorkflowStatusClaims.View': 'Status View',
    'Permissions.Workflow.WorkflowStatusClaims.Edit': 'Status Update',
    'Permissions.Workflow.WorkflowStatusClaims.Delete': 'Status Delete',

    // Bank Reconciliation
    'Permissions.Finance.BankReconClaims.Create': 'Bank Reconciliation Create',
    'Permissions.Finance.BankReconClaims.View': 'Bank Reconciliation View',
    'Permissions.Finance.BankReconClaims.Edit': 'Bank Reconciliation Update',
    'Permissions.Finance.BankReconClaims.Delete': 'Bank Reconciliation Delete',

    //Budget
    'Permissions.Budget.BudgetClaims.View': 'Estimated Budget View',
    'Permissions.Budget.BudgetClaims.Create': 'Estimated Budget Create',
    'Permissions.Budget.BudgetClaims.Edit': 'Estimated Budget Update',
    'Permissions.Budget.BudgetClaims.Delete': 'Estimated Budget Delete',
    'Permissions.Budget.BudgetReportClaims.View': 'Estimated Budget Report View',

    'Permissions.Budget.EstimatedBudgetClaims.View': 'Anticipated Budget View',
    'Permissions.Budget.EstimatedBudgetClaims.Create': 'Anticipated Budget Create',
    'Permissions.Budget.EstimatedBudgetClaims.Edit': 'Anticipated Budget Update',
    'Permissions.Budget.EstimatedBudgetClaims.Delete': 'Anticipated Budget Delete',
    'Permissions.Budget.EstimatedBudgetReportClaims.View': 'Anticipated Budget Report View',

    // Location
    'Permissions.Profiling.LocationClaims.View': 'Location View',
    'Permissions.Profiling.LocationClaims.Create': 'Location Create',
    'Permissions.Profiling.LocationClaims.Edit': 'Location Update',
    'Permissions.Profiling.LocationClaims.Delete': 'Location Delete',

    //  Warehouse
    'Permissions.Profiling.WarehouseClaims.View': 'Store View',
    'Permissions.Profiling.WarehouseClaims.Create': 'Store Create',
    'Permissions.Profiling.WarehouseClaims.Edit': 'Store Update',
    'Permissions.Profiling.WarehouseClaims.Delete': 'Store Delete',

    // sales Order
    'Permissions.SalesOrderClaims.View': 'Sales Order View',
    'Permissions.SalesOrderClaims.Create': 'Sales Order Create',
    'Permissions.SalesOrderClaims.Edit': 'Sales Order Update',
    'Permissions.SalesOrderClaims.Delete': 'Sales Order Delete',

    //  purchase Order
    'Permissions.Procurement.PurchaseOrderClaims.View': 'Purchase Order View',
    'Permissions.Procurement.PurchaseOrderClaims.Create': 'Purchase Order Create',
    'Permissions.Procurement.PurchaseOrderClaims.Edit': 'Purchase Order Update',
    'Permissions.Procurement.PurchaseOrderClaims.Delete': 'Purchase Order Delete',

    // Requisition
    'Permissions.Procurement.RequisitionClaims.View': 'Requisition View',
    'Permissions.Procurement.RequisitionClaims.Create': 'Requisition Create',
    'Permissions.Procurement.RequisitionClaims.Edit': 'Requisition Update',
    'Permissions.Procurement.RequisitionClaims.Delete': 'Requisition Delete',

    // Quatation
    'Permissions.Procurement.Quotation.View': 'Quotation View',
    'Permissions.Procurement.Quotation.Create': 'Quotation Create',
    'Permissions.Procurement.Quotation.Edit': 'Quotation Update',
    'Permissions.Procurement.Quotation.Delete': 'Quotation Delete',
    
    // Call Quatation
    'Permissions.Procurement.CallQuotation.View': 'Call Quotation View',
    'Permissions.Procurement.CallQuotation.Create': 'Call Quotation Create',
    'Permissions.Procurement.CallQuotation.Edit': 'Call Quotation Update',
    'Permissions.Procurement.CallQuotation.Delete': 'Call Quotation Delete',

    // Request Requisition
    'Permissions.Procurement.RequestClaims.View': 'Request Requisition View',
    'Permissions.Procurement.RequestClaims.Create': 'Request Requisition Create',
    'Permissions.Procurement.RequestClaims.Edit': 'Request Requisition Update',
    'Permissions.Procurement.RequestClaims.Delete': 'Request Requisition Delete',

    // Bid Evaluation
    'Permissions.Procurement.BidEvaluationClaims.View': 'Bid Evaluation View',
    'Permissions.Procurement.BidEvaluationClaims.Create': 'Bid Evaluation Create',
    'Permissions.Procurement.BidEvaluationClaims.Edit': 'Bid Evaluation Update',
    'Permissions.Procurement.BidEvaluationClaims.Delete': 'Bid Evaluation Delete',

    // GRN
    'Permissions.Procurement.GRNClaims.View': 'Goods Receive Note View',
    'Permissions.Procurement.GRNClaims.Create': 'Goods Receive Note Create',
    'Permissions.Procurement.GRNClaims.Edit': 'Goods Receive Note Update',
    'Permissions.Procurement.GRNClaims.Delete': 'Goods Receive Note Delete',

    //  GDN
    'Permissions.Procurement.GDNClaims.View': 'Good Dispatch Note View',
    'Permissions.Procurement.GDNClaims.Create': 'Good Dispatch Note Create',
    'Permissions.Procurement.GDNClaims.Edit': 'Good Dispatch Note Update',
    'Permissions.Procurement.GDNClaims.Delete': 'Good Dispatch Note Delete',

    // Goods Return Note
    'Permissions.Procurement.GoodsReturnNoteClaims.View': 'Goods Return Note View',
    'Permissions.Procurement.GoodsReturnNoteClaims.Create': 'Goods Return Note Create',
    'Permissions.Procurement.GoodsReturnNoteClaims.Edit': 'Goods Return Note Update',
    'Permissions.Procurement.GoodsReturnNoteClaims.Delete': 'Goods Return Note Delete',

    //ISSUANCE
    'Permissions.Procurement.IssuanceClaims.View': 'Issuance View',
    'Permissions.Procurement.IssuanceClaims.Create': 'Issuance Create',
    'Permissions.Procurement.IssuanceClaims.Edit': 'Issuance Update',
    'Permissions.Procurement.IssuanceClaims.Delete': 'Issuance Delete',

    //ISSUANCE RETURN
    'Permissions.Procurement.IssuanceReturnClaims.View': 'Issuance Return View',
    'Permissions.Procurement.IssuanceReturnClaims.Create': 'Issuance Return Create',
    'Permissions.Procurement.IssuanceReturnClaims.Edit': 'Issuance Return Update',
    'Permissions.Procurement.IssuanceReturnClaims.Delete': 'Issuance Return Delete',

    // Stock
    'Permissions.Procurement.StockClaims.View': 'Inventory View',

    // Transaction Recon
    'Permissions.Finance.TransactionReconClaims.View': 'Transaction Reconcile View',
    'Permissions.Finance.TransactionReconClaims.Create': 'Transaction Reconcile Create',
    'Permissions.Finance.TransactionReconClaims.Edit': 'Transaction Reconcile Update',
    'Permissions.Finance.TransactionReconClaims.Delete': 'Transaction Reconcile Delete',

    // Asset Category
    'Permissions.AssetCategoryClaims.View': 'Asset Category View',
    'Permissions.AssetCategoryClaims.Create': 'Asset Category Create',
    'Permissions.AssetCategoryClaims.Edit': 'Asset Category Update',
    'Permissions.AssetCategoryClaims.Delete': 'Asset Category Delete',

    // Depreciation Model
    'Permissions.DepreciationModelClaims.View': 'Depreciation Model View',
    'Permissions.DepreciationModelClaims.Create': 'Depreciation Model Create',
    'Permissions.DepreciationModelClaims.Edit': 'Depreciation Model Update',
    'Permissions.DepreciationModelClaims.Delete': 'Depreciation Model Delete',

    // Asset
    'Permissions.AssetClaims.View': 'Asset View',
    'Permissions.AssetClaims.Create': 'Asset Create',
    'Permissions.AssetClaims.Edit': 'Asset Update',
    'Permissions.AssetClaims.Delete': 'Asset Delete'
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
    // {viewValue: 'Draft',  value: 'Draft', id: 0 },
    // { value: 'Cancelled', id: 1 },
    {viewValue: 'Approved', value: 'Unpaid', id: 2},
    // { value: 'Partial', id: 3 },
    // { value: 'Paid', id: 4 },
    //{viewValue: 'Submitted', value: 'Submitted', id: 5},
    {viewValue: 'Reviewed', value: 'Reviewed', id: 6},
  ]

  static Documents = [
    {value: 'Payment', id: DocType.Payment, route: 'voucher'},
    {value: 'Credit Note', id: DocType.CreditNote},
    {value: 'Debit Note', id: DocType.DebitNote},
    {value: 'Invoice', id: DocType.Invoice},
    {value: 'Bill', id: DocType.Bill},
    {value: 'Journal Voucher', id: DocType.JournalEntry},
    {value: 'Receipt' , id: DocType.Receipt, route: 'receipt'},
    {value: 'Purchase Order' , id: DocType.PurchaseOrder},
    {value: 'Requisition' , id: DocType.Requisition},
    {value: 'Goods Received Note' , id: DocType.GRN},
    {value: 'Payroll Transaction', id: DocType.PayrollTransaction},
    {value: 'Payroll Payment' , id: DocType.PayrollPayment, route: 'payroll-payment'},
    {value: 'Issuance' , id: DocType.Issuance},
    {value: 'Goods Return Note' , id: DocType.GoodsReturnNote},
    {value: 'Issuance Return' , id: DocType.IssuanceReturn},
    {value: 'Request Requisition' , id: DocType.Request}
    //{value: 'sales Order', id: DocType.SalesOrder},
    //{value: 'Goods Receiving Note', id: DocType.GRN},
    //{ value: 'Goods Dispatch Note', id: DocType.GDN },
    //{ value: 'Inventory Adjustment', id: DocType.InventoryAdjustment }
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

  static taxType = [
    {id: 0 , type: 'Sales Tax Asset'},
    {id: 1 , type: 'Sales Tax Liability'},
    {id: 2 , type: 'Income Tax Asset'},
    {id: 3 , type: 'Income Tax Liability'},
    {id: 4 , type: 'SRBTaxAsset'},
    {id: 5 , type: 'SRBTaxLiability'}
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
    { name: 'Jan', value: 1 },
    { name: 'Feb', value: 2 },
    { name: 'Mar', value: 3 },
    { name: 'Apr', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'Aug', value: 8 },
    { name: 'Sep', value: 9 },
    { name: 'Oct', value: 10 },
    { name: 'Nov', value: 11 },
    { name: 'Dec', value: 12 },
  ];

  static filterStatus = [
    { value: 'Draft', id: 0 },
    { value: 'Rejected', id: 1 },
    { value: 'Unpaid', id: 2 },
    { value: 'Approved', id: 2 },
    { value: 'Partial', id: 3 },
    { value: 'Paid', id: 4 },
    { value: 'Open', id: 2 },
    { value: 'Closed', id: 4 },
    { value: 'Submitted', id: 5 },
    { value: 'Reviewed', id: 6 },
  ];
}
