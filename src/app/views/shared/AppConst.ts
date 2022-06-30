import {DocType} from './AppEnum';

export class AppConst {
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
  static paymentType = {
    1: 'Inflow',
    2: 'Outflow'
  }
  static PermissionsDisplayName = {

    // Business Partner
    'Permissions.BusinessPartnerClaims.Create': 'Business Partner Create',
    'Permissions.BusinessPartnerClaims.View': 'Business Partner View',
    'Permissions.BusinessPartnerClaims.Edit': 'Business Partner Update',
    'Permissions.BusinessPartnerClaims.Delete': 'Business Partner Delete',

    // Invoice
    'Permissions.InvoiceClaims.Create': 'Invoice Create',
    'Permissions.InvoiceClaims.View': 'Invoice View',
    'Permissions.InvoiceClaims.Edit': 'Invoice Update',
    'Permissions.InvoiceClaims.Delete': 'Invoice Delete',
    'Permissions.InvoiceClaims.Review': 'Invoice Review',
    'Permissions.InvoiceClaims.Approve': 'Invoice Approve',

    // Bank Account
    'Permissions.BankAccountClaims.View': 'Bank Account View',
    'Permissions.BankAccountClaims.Create': 'Bank Account Create',
    'Permissions.BankAccountClaims.Edit': 'Bank Account Update',
    'Permissions.BankAccountClaims.Delete': 'Bank Account Delete',

    // Bank Statement
    'Permissions.BankStatementClaims.View': 'Bank Statement View',
    'Permissions.BankStatementClaims.Create': 'Bank Statement Create',
    'Permissions.BankStatementClaims.Edit': 'Bank Statement Update',
    'Permissions.BankStatementClaims.Delete': 'Bank Statement Delete',

    // Business Partner Entities
    'Permissions.BusinessPartnerEntitiesClaims.View': 'Business Partner Entities View',
    'Permissions.BusinessPartnerEntitiesClaims.Create': 'Business Partner Entities Create',
    'Permissions.BusinessPartnerEntitiesClaims.Edit': 'Business Partner Entities Update',
    'Permissions.BusinessPartnerEntitiesClaims.Delete': 'Business Partner Entities Delete',

    // Business Partner type
    'Permissions.BusinessPartnerTypesClaims.View': 'Business Partner Type View',
    'Permissions.BusinessPartnerTypesClaims.Create': 'Business Partner Type Create',
    'Permissions.BusinessPartnerTypesClaims.Edit': 'Business Partner Type Update',
    'Permissions.BusinessPartnerTypesClaims.Delete': 'Business Partner Type Delete',

    // Campus
    'Permissions.CampusClaims.View': 'Campus View',
    'Permissions.CampusClaims.Create': 'Campus Create',
    'Permissions.CampusClaims.Edit': 'Campus Update',
    'Permissions.CampusClaims.Delete': 'Campus Delete',

    // Cash Account
    'Permissions.CashAccountClaims.View': 'Cash Account View',
    'Permissions.CashAccountClaims.Create': 'Cash Account Create',
    'Permissions.CashAccountClaims.Edit': 'Cash Account Update',
    'Permissions.CashAccountClaims.Delete': 'Cash Account Delete',

    // Category
    'Permissions.CategoriesClaims.View': 'Category View',
    'Permissions.CategoriesClaims.Create': 'Category Create',
    'Permissions.CategoriesClaims.Edit': 'Category Update',
    'Permissions.CategoriesClaims.Delete': 'Category Delete',

    // Chart of Account
    'Permissions.ChartOfAccountClaims.View': 'Chart of Account View',

    // Country
    'Permissions.CountryClaims.View': 'Country View',
    'Permissions.CountryClaims.Create': 'Country Create',
    'Permissions.CountryClaims.Edit': 'Country Update',
    'Permissions.CountryClaims.Delete': 'Country Delete',

    // State
    'Permissions.StateClaims.View': 'State View',
    'Permissions.StateClaims.Create': 'State Create',
    'Permissions.StateClaims.Edit': 'State Update',
    'Permissions.StateClaims.Delete': 'State Delete',

    // City
    'Permissions.CityClaims.View': 'City View',
    'Permissions.CityClaims.Create': 'City Create',
    'Permissions.CityClaims.Edit': 'City Update',
    'Permissions.CityClaims.Delete': 'City Delete',

    // Department
    'Permissions.DepartmentClaims.View': 'Department View',
    'Permissions.DepartmentClaims.Create': 'Department Create',
    'Permissions.DepartmentClaims.Edit': 'Department Update',
    'Permissions.DepartmentClaims.Delete': 'Department Delete',

    // Designation
    'Permissions.DesignationClaims.View': 'Designation View',
    'Permissions.DesignationClaims.Create': 'Designation Create',
    'Permissions.DesignationClaims.Edit': 'Designation Update',
    'Permissions.DesignationClaims.Delete': 'Designation Delete',

    // Employee
    'Permissions.EmployeeClaims.View': 'Employee View',
    'Permissions.EmployeeClaims.Create': 'Employee Create',
    'Permissions.EmployeeClaims.Edit': 'Employee Update',
    'Permissions.EmployeeClaims.Delete': 'Employee Delete',

    // Organization
    'Permissions.OrganizationClaims.View': 'Organization View',
    'Permissions.OrganizationClaims.Create': 'Organization Create',
    'Permissions.OrganizationClaims.Edit': 'Organization Update',
    'Permissions.OrganizationClaims.Delete': 'Organization Delete',

    // Payroll Item
    'Permissions.PayrollItemClaims.View': 'Payroll Item View',
    'Permissions.PayrollItemClaims.Create': 'Payroll Item Create',
    'Permissions.PayrollItemClaims.Edit': 'Payroll Item Update',
    'Permissions.PayrollItemClaims.Delete': 'Payroll Item Delete',

    // Payroll Transaction
    'Permissions.PayrollTransactionClaims.View': 'Payroll Transaction View',
    'Permissions.PayrollTransactionClaims.Create': 'Payroll Transaction Create',
    'Permissions.PayrollTransactionClaims.Edit': 'Payroll Transaction Update',
    'Permissions.PayrollTransactionClaims.Delete': 'Payroll Transaction Delete',
    'Permissions.PayrollTransactionClaims.Review': 'Payroll Transaction Review',
    'Permissions.PayrollTransactionClaims.Approve': 'Payroll Transaction Approve',

    // Allowance
    'Permissions.AllowanceReportClaims.View': 'Allowance Report View',

    // Product
    'Permissions.ProductsClaims.View': 'Product View',
    'Permissions.ProductsClaims.Create': 'Product Create',
    'Permissions.ProductsClaims.Edit': 'Product Update',
    'Permissions.ProductsClaims.Delete': 'Product Delete',

    // Tax
    'Permissions.TaxesClaims.View': 'Tax View',
    'Permissions.TaxesClaims.Create': 'Tax Create',
    'Permissions.TaxesClaims.Edit': 'Tax Update',
    'Permissions.TaxesClaims.Delete': 'Tax Delete',

    // Unit Of Measurement
    'Permissions.UnitOfMeasurementClaims.View': 'Unit Of Measurement View',
    'Permissions.UnitOfMeasurementClaims.Create': 'Unit Of Measurement Create',
    'Permissions.UnitOfMeasurementClaims.Edit': 'Unit Of Measurement Update',
    'Permissions.UnitOfMeasurementClaims.Delete': 'Unit Of Measurement Delete',

    // Vehicle
    'Permissions.VehicleClaims.View': 'Vehicle View',
    'Permissions.VehicleClaims.Create': 'Vehicle Create',
    'Permissions.VehicleClaims.Edit': 'Vehicle Update',
    'Permissions.VehicleClaims.Delete': 'Vehicle Delete',

    // Level 3
    'Permissions.Level3Claims.View': 'Chart of Account Level 3 View',
    'Permissions.Level3Claims.Create': 'Chart of Account Level 3 Create',
    'Permissions.Level3Claims.Edit': 'Chart of Account Level 3 Update',
    'Permissions.Level3Claims.Delete': 'Chart of Account Level 3 Delete',

    // Level 4
    'Permissions.Level4Claims.View': 'Chart of Account Level 4 View',
    'Permissions.Level4Claims.Create': 'Chart of Account Level 4 Create',
    'Permissions.Level4Claims.Edit': 'Chart of Account Level 4 Update',
    'Permissions.Level4Claims.Delete': 'Chart of Account Level 4 Delete',

    // Balance Sheet
    'Permissions.BalanceSheetClaims.View': 'Balance Sheet',

    // General Ledger
    'Permissions.GeneralLedgerClaims.View': 'General Ledger',

    // Income Expenditure
    'Permissions.ProfitLossClaims.View': 'Profit and Loss Statement',

    // Trial Balance
    'Permissions.TrialBalanceClaims.View': 'Trial Balance',

    // Bill
    'Permissions.BillClaims.View': 'Bill View',
    'Permissions.BillClaims.Create': 'Bill Create',
    'Permissions.BillClaims.Edit': 'Bill Update',
    'Permissions.BillClaims.Delete': 'Bill Delete',
    'Permissions.BillClaims.Review': 'Bill Review',
    'Permissions.BillClaims.Approve': 'Bill Approve',

    // Payment
    'Permissions.PaymentClaims.View': 'Payment View',
    'Permissions.PaymentClaims.Create': 'Payment Create',
    'Permissions.PaymentClaims.Edit': 'Payment Update',
    'Permissions.PaymentClaims.Delete': 'Payment Delete',
    'Permissions.PaymentClaims.Review': 'Payment Review',
    'Permissions.PaymentClaims.Approve': 'Payment Approve',

    // Internal Receipt
    'Permissions.ReceiptClaims.View': 'Receipt View',
    'Permissions.ReceiptClaims.Create': 'Receipt Create',
    'Permissions.ReceiptClaims.Edit': 'Receipt Update',
    'Permissions.ReceiptClaims.Delete': 'Receipt Delete',
    'Permissions.ReceiptClaims.Review': 'Receipt Review',
    'Permissions.ReceiptClaims.Approve': 'Receipt Approve',

    // Payroll Payment
    'Permissions.PayrollPaymentClaims.View': 'Payroll Payment View',
    'Permissions.PayrollPaymentClaims.Create': 'Payroll Payment Create',
    'Permissions.PayrollPaymentClaims.Edit': 'Payroll Payment Update',
    'Permissions.PayrollPaymentClaims.Delete': 'Payroll Payment Delete',

    // Credit Note
    'Permissions.CreditNoteClaims.View': 'Credit Note View',
    'Permissions.CreditNoteClaims.Create': 'Credit Note Create',
    'Permissions.CreditNoteClaims.Edit': 'Credit Note Update',
    'Permissions.CreditNoteClaims.Delete': 'Credit Note Delete',
    'Permissions.CreditNoteClaims.Review': 'Credit Note Review',
    'Permissions.CreditNoteClaims.Approve': 'Credit Note Approve',

    // Debit Note
    'Permissions.DebitNoteClaims.View': 'Debit Note View',
    'Permissions.DebitNoteClaims.Create': 'Debit Note Create',
    'Permissions.DebitNoteClaims.Edit': 'Debit Note Update',
    'Permissions.DebitNoteClaims.Delete': 'Debit Note Delete',
    'Permissions.DebitNoteClaims.Review': 'Debit Note Review',
    'Permissions.DebitNoteClaims.Approve': 'Debit Note Approve',

    // Journal Voucher
    'Permissions.JournalEntryClaims.View': 'Journal Voucher View',
    'Permissions.JournalEntryClaims.Create': 'Journal Voucher Create',
    'Permissions.JournalEntryClaims.Edit': 'Journal Voucher Update',
    'Permissions.JournalEntryClaims.Delete': 'Journal Voucher Delete',
    'Permissions.JournalEntryClaims.Review': 'Journal Voucher Review',
    'Permissions.JournalEntryClaims.Approve': 'Journal Voucher Approve',

    // Access Management
    'Permissions.AuthClaims.Create': 'Access Management Create',
    'Permissions.AuthClaims.View': 'Access Management View',
    'Permissions.AuthClaims.Edit': 'Access Management Update',
    'Permissions.AuthClaims.Delete': 'Access Management Delete',

    // Workflow
    'Permissions.WorkflowClaims.Create': 'Workflow Create',
    'Permissions.WorkflowClaims.View': 'Workflow View',
    'Permissions.WorkflowClaims.Edit': 'Workflow Update',
    'Permissions.WorkflowClaims.Delete': 'Workflow Delete',

    // Status
    'Permissions.WorkflowStatusClaims.Create': 'Status Create',
    'Permissions.WorkflowStatusClaims.View': 'Status View',
    'Permissions.WorkflowStatusClaims.Edit': 'Status Update',
    'Permissions.WorkflowStatusClaims.Delete': 'Status Delete',

    // Bank Reconciliation
    'Permissions.BankReconClaims.Create': 'Bank Reconciliation Create',
    'Permissions.BankReconClaims.View': 'Bank Reconciliation View',
    'Permissions.BankReconClaims.Edit': 'Bank Reconciliation Update',
    'Permissions.BankReconClaims.Delete': 'Bank Reconciliation Delete',

    //Budget
    'Permissions.BudgetClaims.View': 'Budget View',
    'Permissions.BudgetClaims.Create': 'Budget Create',
    'Permissions.BudgetClaims.Edit': 'Budget Update',
    'Permissions.BudgetClaims.Delete': 'Budget Delete',
    'Permissions.BudgetReportClaims.View': 'Budget Report View',

    'Permissions.EstimatedBudgetClaims.View': 'Estimated Budget View',
    'Permissions.EstimatedBudgetClaims.Create': 'Estimated Budget Create',
    'Permissions.EstimatedBudgetClaims.Edit': 'Estimated Budget Update',
    'Permissions.EstimatedBudgetClaims.Delete': 'Estimated Budget Delete',
    'Permissions.EstimatedBudgetReportClaims.View': 'Estimated Budget Report View',

    // Location
    'Permissions.LocationClaims.View': 'Location View',
    'Permissions.LocationClaims.Create': 'Location Create',
    'Permissions.LocationClaims.Edit': 'Location Update',
    'Permissions.LocationClaims.Delete': 'Location Delete',

    //  Warehouse
    'Permissions.WarehouseClaims.View': 'Store View',
    'Permissions.WarehouseClaims.Create': 'Store Create',
    'Permissions.WarehouseClaims.Edit': 'Store Update',
    'Permissions.WarehouseClaims.Delete': 'Store Delete',

    // sales Order
    'Permissions.SalesOrderClaims.View': 'Sales Order View',
    'Permissions.SalesOrderClaims.Create': 'Sales Order Create',
    'Permissions.SalesOrderClaims.Edit': 'Sales Order Update',
    'Permissions.SalesOrderClaims.Delete': 'Sales Order Delete',

    //  purchase Order
    'Permissions.PurchaseOrderClaims.View': 'Purchase Order View',
    'Permissions.PurchaseOrderClaims.Create': 'Purchase Order Create',
    'Permissions.PurchaseOrderClaims.Edit': 'Purchase Order Update',
    'Permissions.PurchaseOrderClaims.Delete': 'Purchase Order Delete',

    // Requisition
    'Permissions.RequisitionClaims.View': 'Requisition View',
    'Permissions.RequisitionClaims.Create': 'Requisition Create',
    'Permissions.RequisitionClaims.Edit': 'Requisition Update',
    'Permissions.RequisitionClaims.Delete': 'Requisition Delete',

    // GRN
    'Permissions.GRNClaims.View': 'Good Receive Note View',
    'Permissions.GRNClaims.Create': 'Good Receive Note Create',
    'Permissions.GRNClaims.Edit': 'Good Receive Note Update',
    'Permissions.GRNClaims.Delete': 'Good Receive Note Delete',

    //  GDN
    'Permissions.GDNClaims.View': 'Good Dispatch Note View',
    'Permissions.GDNClaims.Create': 'Good Dispatch Note Create',
    'Permissions.GDNClaims.Edit': 'Good Dispatch Note Update',
    'Permissions.GDNClaims.Delete': 'Good Dispatch Note Delete',

    // Goods Return Note
    'Permissions.GoodsReturnNoteClaims.View': 'Good Return Note View',
    'Permissions.GoodsReturnNoteClaims.Create': 'Good Return Note Create',
    'Permissions.GoodsReturnNoteClaims.Edit': 'Good Return Note Update',
    'Permissions.GoodsReturnNoteClaims.Delete': 'Good Return Note Delete',

    //ISSUANCE
    'Permissions.IssuanceClaims.View': 'Issuance View',
    'Permissions.IssuanceClaims.Create': 'Issuance Create',
    'Permissions.IssuanceClaims.Edit': 'Issuance Update',
    'Permissions.IssuanceClaims.Delete': 'Issuance Delete',

    // Transaction Recon
    'Permissions.TransactionReconClaims.View': 'Transaction Reconcile View',
    'Permissions.TransactionReconClaims.Create': 'Transaction Reconcile Create',
    'Permissions.TransactionReconClaims.Edit': 'Transaction Reconcile Update',
    'Permissions.TransactionReconClaims.Delete': 'Transaction Reconcile Delete',
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
    //{value: 'sales Order', id: DocType.SalesOrder},
    //{value: 'Goods Receiving Note', id: DocType.GRN},
    //{ value: 'Goods Dispatch Note', id: DocType.GDN },
    //{ value: 'Inventory Adjustment', id: DocType.InventoryAdjustment }
  ]

  static taxType = [
    {id: 0 , type: 'Sales Tax Asset'},
    {id: 1 , type: 'Sales Tax Liability'},
    {id: 2 , type: 'Income Tax Asset'},
    {id: 3 , type: 'Income Tax Liability'},
    {id: 4 , type: 'SRBTaxAsset'},
    {id: 5 , type: 'SRBTaxLiability'}
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
    { value: 'Partial', id: 3 },
    { value: 'Paid', id: 4 },
    { value: 'Submitted', id: 5 },
    { value: 'Reviewed', id: 6 },
  ];

}
