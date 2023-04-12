import {Criteria, DocType, Nature} from './AppEnum';

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
    'Profiling.BusinessPartner.Create': 'Business Partner Create',
    'Profiling.BusinessPartner.View': 'Business Partner View',
    'Profiling.BusinessPartner.Edit': 'Business Partner Update',
    'Profiling.BusinessPartner.Delete': 'Business Partner Delete',

    // Invoice
    'Finance.Invoice.Create': 'Invoice Create',
    'Finance.Invoice.View': 'Invoice View',
    'Finance.Invoice.Edit': 'Invoice Update',
    'Finance.Invoice.Delete': 'Invoice Delete',
    'Finance.Invoice.Review': 'Invoice Review',
    'Finance.Invoice.Approve': 'Invoice Approve',

    // Bank Account
    'Finance.BankAccount.View': 'Bank Account View',
    'Finance.BankAccount.Create': 'Bank Account Create',
    'Finance.BankAccount.Edit': 'Bank Account Update',
    'Finance.BankAccount.Delete': 'Bank Account Delete',

    // Bank Statement
    'Finance.BankStatement.View': 'Bank Statement View',
    'Finance.BankStatement.Create': 'Bank Statement Create',
    'Finance.BankStatement.Edit': 'Bank Statement Update',
    'Finance.BankStatement.Delete': 'Bank Statement Delete',

    // Business Partner Entities
    'Profiling.BusinessPartnerEntities.View': 'Business Partner Entities View',
    'Profiling.BusinessPartnerEntities.Create': 'Business Partner Entities Create',
    'Profiling.BusinessPartnerEntities.Edit': 'Business Partner Entities Update',
    'Profiling.BusinessPartnerEntities.Delete': 'Business Partner Entities Delete',

    // Business Partner type
    'Profiling.BusinessPartnerTypes.View': 'Business Partner Type View',
    'Profiling.BusinessPartnerTypes.Create': 'Business Partner Type Create',
    'Profiling.BusinessPartnerTypes.Edit': 'Business Partner Type Update',
    'Profiling.BusinessPartnerTypes.Delete': 'Business Partner Type Delete',

    // Campus
    'Profiling.Campus.View': 'Campus View',
    'Profiling.Campus.Create': 'Campus Create',
    'Profiling.Campus.Edit': 'Campus Update',
    'Profiling.Campus.Delete': 'Campus Delete',

    // Cash Account
    'Finance.CashAccount.View': 'Cash Account View',
    'Finance.CashAccount.Create': 'Cash Account Create',
    'Finance.CashAccount.Edit': 'Cash Account Update',
    'Finance.CashAccount.Delete': 'Cash Account Delete',

    // Category
    'Profiling.Categories.View': 'Category View',
    'Profiling.Categories.Create': 'Category Create',
    'Profiling.Categories.Edit': 'Category Update',
    'Profiling.Categories.Delete': 'Category Delete',

    // Chart of Account
    'Finance.ChartOfAccount.View': 'Chart of Account View',

    // Country
    'Profiling.Country.View': 'Country View',
    'Profiling.Country.Create': 'Country Create',
    'Profiling.Country.Edit': 'Country Update',
    'Profiling.Country.Delete': 'Country Delete',

    // State
    'Profiling.State.View': 'State View',
    'Profiling.State.Create': 'State Create',
    'Profiling.State.Edit': 'State Update',
    'Profiling.State.Delete': 'State Delete',

    // City
    'Profiling.City.View': 'City View',
    'Profiling.City.Create': 'City Create',
    'Profiling.City.Edit': 'City Update',
    'Profiling.City.Delete': 'City Delete',

    // Department
    'Payroll.Department.View': 'Department View',
    'Payroll.Department.Create': 'Department Create',
    'Payroll.Department.Edit': 'Department Update',
    'Payroll.Department.Delete': 'Department Delete',

    // Designation
    'Payroll.Designation.View': 'Designation View',
    'Payroll.Designation.Create': 'Designation Create',
    'Payroll.Designation.Edit': 'Designation Update',
    'Payroll.Designation.Delete': 'Designation Delete',

    // Employee
    'Payroll.Employee.View': 'Employee View',
    'Payroll.Employee.Create': 'Employee Create',
    'Payroll.Employee.Edit': 'Employee Update',
    'Payroll.Employee.Delete': 'Employee Delete',

    // Organization
    'Profiling.Organization.View': 'Organization View',
    'Profiling.Organization.Create': 'Organization Create',
    'Profiling.Organization.Edit': 'Organization Update',
    'Profiling.Organization.Delete': 'Organization Delete',

    // Payroll Item
    'Payroll.PayrollItem.View': 'Payroll Item View',
    'Payroll.PayrollItem.Create': 'Payroll Item Create',
    'Payroll.PayrollItem.Edit': 'Payroll Item Update',
    'Payroll.PayrollItem.Delete': 'Payroll Item Delete',

    // Payroll Transaction
    'Payroll.PayrollTransaction.View': 'Payroll Transaction View',
    'Payroll.PayrollTransaction.Create': 'Payroll Transaction Create',
    'Payroll.PayrollTransaction.Edit': 'Payroll Transaction Update',
    'Payroll.PayrollTransaction.Delete': 'Payroll Transaction Delete',
    'Payroll.PayrollTransaction.Review': 'Payroll Transaction Review',
    'Payroll.PayrollTransaction.Approve': 'Payroll Transaction Approve',

    // Allowance
    'Payroll.AllowanceReport.View': 'Allowance Report View',

    // Product
    'Profiling.Products.View': 'Product View',
    'Profiling.Products.Create': 'Product Create',
    'Profiling.Products.Edit': 'Product Update',
    'Profiling.Products.Delete': 'Product Delete',

    // Tax
    'Profiling.Taxes.View': 'Tax View',
    'Profiling.Taxes.Create': 'Tax Create',
    'Profiling.Taxes.Edit': 'Tax Update',
    'Profiling.Taxes.Delete': 'Tax Delete',

    // Unit Of Measurement
    'Profiling.UnitOfMeasurement.View': 'Unit Of Measurement View',
    'Profiling.UnitOfMeasurement.Create': 'Unit Of Measurement Create',
    'Profiling.UnitOfMeasurement.Edit': 'Unit Of Measurement Update',
    'Profiling.UnitOfMeasurement.Delete': 'Unit Of Measurement Delete',

    // Vehicle
    'Vehicle.View': 'Vehicle View',
    'Vehicle.Create': 'Vehicle Create',
    'Vehicle.Edit': 'Vehicle Update',
    'Vehicle.Delete': 'Vehicle Delete',

    // Level 3
    'Finance.Level3.View': 'Chart of Account Level 3 View',
    'Finance.Level3.Create': 'Chart of Account Level 3 Create',
    'Finance.Level3.Edit': 'Chart of Account Level 3 Update',
    'Finance.Level3.Delete': 'Chart of Account Level 3 Delete',

    // Level 4
    'Finance.Level4.View': 'Chart of Account Level 4 View',
    'Finance.Level4.Create': 'Chart of Account Level 4 Create',
    'Finance.Level4.Edit': 'Chart of Account Level 4 Update',
    'Finance.Level4.Delete': 'Chart of Account Level 4 Delete',

    // Balance Sheet
    'Report.BalanceSheet.View': 'Balance Sheet',

    // General Ledger
    'Report.GeneralLedger.View': 'General Ledger',

    // Income Expenditure
    'Report.ProfitLoss.View': 'Income & Expenditure',

    // Trial Balance
    'Report.TrialBalance.View': 'Trial Balance',

    // Bill
    'Finance.Bill.View': 'Bill View',
    'Finance.Bill.Create': 'Bill Create',
    'Finance.Bill.Edit': 'Bill Update',
    'Finance.Bill.Delete': 'Bill Delete',
    'Finance.Bill.Review': 'Bill Review',
    'Finance.Bill.Approve': 'Bill Approve',

    // Payment
    'Finance.Payment.View': 'Payment View',
    'Finance.Payment.Create': 'Payment Create',
    'Finance.Payment.Edit': 'Payment Update',
    'Finance.Payment.Delete': 'Payment Delete',
    'Finance.Payment.Review': 'Payment Review',
    'Finance.Payment.Approve': 'Payment Approve',

    // Internal Receipt
    'Finance.Receipt.View': 'Receipt View',
    'Finance.Receipt.Create': 'Receipt Create',
    'Finance.Receipt.Edit': 'Receipt Update',
    'Finance.Receipt.Delete': 'Receipt Delete',
    'Finance.Receipt.Review': 'Receipt Review',
    'Finance.Receipt.Approve': 'Receipt Approve',

    // Payroll Payment
    'Payroll.PayrollPayment.View': 'Payroll Payment View',
    'Payroll.PayrollPayment.Create': 'Payroll Payment Create',
    'Payroll.PayrollPayment.Edit': 'Payroll Payment Update',
    'Payroll.PayrollPayment.Delete': 'Payroll Payment Delete',

    // Credit Note
    'Finance.CreditNote.View': 'Credit Note View',
    'Finance.CreditNote.Create': 'Credit Note Create',
    'Finance.CreditNote.Edit': 'Credit Note Update',
    'Finance.CreditNote.Delete': 'Credit Note Delete',
    'Finance.CreditNote.Review': 'Credit Note Review',
    'Finance.CreditNote.Approve': 'Credit Note Approve',

    // Debit Note
    'Finance.DebitNote.View': 'Debit Note View',
    'Finance.DebitNote.Create': 'Debit Note Create',
    'Finance.DebitNote.Edit': 'Debit Note Update',
    'Finance.DebitNote.Delete': 'Debit Note Delete',
    'Finance.DebitNote.Review': 'Debit Note Review',
    'Finance.DebitNote.Approve': 'Debit Note Approve',

    // Journal Voucher
    'Finance.JournalEntry.View': 'Journal Voucher View',
    'Finance.JournalEntry.Create': 'Journal Voucher Create',
    'Finance.JournalEntry.Edit': 'Journal Voucher Update',
    'Finance.JournalEntry.Delete': 'Journal Voucher Delete',
    'Finance.JournalEntry.Review': 'Journal Voucher Review',
    'Finance.JournalEntry.Approve': 'Journal Voucher Approve',

    // Access Management
    'AccessManagement.Auth.Create': 'Access Management Create',
    'AccessManagement.Auth.View': 'Access Management View',
    'AccessManagement.Auth.Edit': 'Access Management Update',
    'AccessManagement.Auth.Delete': 'Access Management Delete',

    // Workflow
    'Workflow.Workflow.Create': 'Workflow Create',
    'Workflow.Workflow.View': 'Workflow View',
    'Workflow.Workflow.Edit': 'Workflow Update',
    'Workflow.Workflow.Delete': 'Workflow Delete',

    // Status
    'Workflow.WorkflowStatus.Create': 'Status Create',
    'Workflow.WorkflowStatus.View': 'Status View',
    'Workflow.WorkflowStatus.Edit': 'Status Update',
    'Workflow.WorkflowStatus.Delete': 'Status Delete',

    // Bank Reconciliation
    'Finance.BankRecon.Create': 'Bank Reconciliation Create',
    'Finance.BankRecon.View': 'Bank Reconciliation View',
    'Finance.BankRecon.Edit': 'Bank Reconciliation Update',
    'Finance.BankRecon.Delete': 'Bank Reconciliation Delete',

    // Budget
    'Budget.Budget.View': 'Estimated Budget View',
    'Budget.Budget.Create': 'Estimated Budget Create',
    'Budget.Budget.Edit': 'Estimated Budget Update',
    'Budget.Budget.Delete': 'Estimated Budget Delete',
    'Budget.BudgetReport.View': 'Estimated Budget Report View',

    'Budget.EstimatedBudget.View': 'Anticipated Budget View',
    'Budget.EstimatedBudget.Create': 'Anticipated Budget Create',
    'Budget.EstimatedBudget.Edit': 'Anticipated Budget Update',
    'Budget.EstimatedBudget.Delete': 'Anticipated Budget Delete',
    'Budget.EstimatedBudgetReport.View': 'Anticipated Budget Report View',

    'Budget.BudgetReappropriation.View': 'Re-Appropriation Budget View',
    'Budget.BudgetReappropriation.Create': 'Re-Appropriation Budget Create',
    'Budget.BudgetReappropriation.Edit': 'Re-Appropriation Budget Update',
    'Budget.BudgetReappropriation.Delete': 'Re-Appropriation Budget Delete',
    'Budget.BudgetReappropriationReport.View': 'Re-Appropriation Budget Report View',

    // Location
    'Profiling.Location.View': 'Location View',
    'Profiling.Location.Create': 'Location Create',
    'Profiling.Location.Edit': 'Location Update',
    'Profiling.Location.Delete': 'Location Delete',

    //  Warehouse
    'Profiling.Warehouse.View': 'Store View',
    'Profiling.Warehouse.Create': 'Store Create',
    'Profiling.Warehouse.Edit': 'Store Update',
    'Profiling.Warehouse.Delete': 'Store Delete',

    //  purchase Order
    'Procurement.PurchaseOrder.View': 'Purchase Order View',
    'Procurement.PurchaseOrder.Create': 'Purchase Order Create',
    'Procurement.PurchaseOrder.Edit': 'Purchase Order Update',
    'Procurement.PurchaseOrder.Delete': 'Purchase Order Delete',

    // Requisition
    'Procurement.Requisition.View': 'Requisition View',
    'Procurement.Requisition.Create': 'Requisition Create',
    'Procurement.Requisition.Edit': 'Requisition Update',
    'Procurement.Requisition.Delete': 'Requisition Delete',

    // Quatation
    'Procurement.Quotation.View': 'Quotation View',
    'Procurement.Quotation.Create': 'Quotation Create',
    'Procurement.Quotation.Edit': 'Quotation Update',
    'Procurement.Quotation.Delete': 'Quotation Delete',

    // Quatation Comparative
    'Procurement.QuotationComparative.View': 'Quotation Comparative View',
    'Procurement.QuotationComparative.Create': 'Quotation Comparative Create',
    'Procurement.QuotationComparative.Edit': 'Quotation Comparative Update',
    'Procurement.QuotationComparative.Delete': 'Quotation Comparative Delete',

    // Call Quatation
    'Procurement.CallForQuotation.View': 'Call Quotation View',
    'Procurement.CallForQuotation.Create': 'Call Quotation Create',
    'Procurement.CallForQuotation.Edit': 'Call Quotation Update',
    'Procurement.CallForQuotation.Delete': 'Call Quotation Delete',

    // Request Requisition
    'Procurement.Request.View': 'Request Requisition View',
    'Procurement.Request.Create': 'Request Requisition Create',
    'Procurement.Request.Edit': 'Request Requisition Update',
    'Procurement.Request.Delete': 'Request Requisition Delete',

    // Bid Evaluation
    'Procurement.BidEvaluation.View': 'Bid Evaluation View',
    'Procurement.BidEvaluation.Create': 'Bid Evaluation Create',
    'Procurement.BidEvaluation.Edit': 'Bid Evaluation Update',
    'Procurement.BidEvaluation.Delete': 'Bid Evaluation Delete',

    // GRN
    'Procurement.GRN.View': 'Goods Receive Note View',
    'Procurement.GRN.Create': 'Goods Receive Note Create',
    'Procurement.GRN.Edit': 'Goods Receive Note Update',
    'Procurement.GRN.Delete': 'Goods Receive Note Delete',

    // Goods Return Note
    'Procurement.GoodsReturnNote.View': 'Goods Return Note View',
    'Procurement.GoodsReturnNote.Create': 'Goods Return Note Create',
    'Procurement.GoodsReturnNote.Edit': 'Goods Return Note Update',
    'Procurement.GoodsReturnNote.Delete': 'Goods Return Note Delete',

    // ISSUANCE
    'Procurement.Issuance.View': 'Issuance View',
    'Procurement.Issuance.Create': 'Issuance Create',
    'Procurement.Issuance.Edit': 'Issuance Update',
    'Procurement.Issuance.Delete': 'Issuance Delete',

    // ISSUANCE RETURN
    'Procurement.IssuanceReturn.View': 'Issuance Return View',
    'Procurement.IssuanceReturn.Create': 'Issuance Return Create',
    'Procurement.IssuanceReturn.Edit': 'Issuance Return Update',
    'Procurement.IssuanceReturn.Delete': 'Issuance Return Delete',

    // Stock
    'Procurement.Stock.View': 'Inventory View',

    // Transaction Recon
    'Finance.TransactionRecon.View': 'Transaction Reconcile View',
    'Finance.TransactionRecon.Create': 'Transaction Reconcile Create',
    'Finance.TransactionRecon.Edit': 'Transaction Reconcile Update',
    'Finance.TransactionRecon.Delete': 'Transaction Reconcile Delete',

    // Asset Category
    'AssetCategory.View': 'Asset Category View',
    'AssetCategory.Create': 'Asset Category Create',
    'AssetCategory.Edit': 'Asset Category Update',
    'AssetCategory.Delete': 'Asset Category Delete',

    // Depreciation Model
    'FixedAsset.DepreciationModel.View': 'Depreciation Model View',
    'FixedAsset.DepreciationModel.Create': 'Depreciation Model Create',
    'FixedAsset.DepreciationModel.Edit': 'Depreciation Model Update',
    'FixedAsset.DepreciationModel.Delete': 'Depreciation Model Delete',

    // Asset
    'FixedAsset.FixedAsset.View': 'Fixed Asset View',
    'FixedAsset.FixedAsset.Create': 'Fixed Asset Create',
    'FixedAsset.FixedAsset.Edit': 'Fixed Asset Update',
    'FixedAsset.FixedAsset.Delete': 'Fixed Asset Delete',
    'FixedAsset.FixedAssetReport.View': 'Fixed Asset Report',

    // CWIP
    'FixedAsset.CWIP.View': 'CWIP View',
    'FixedAsset.CWIP.Create': 'CWIP Create',
    'FixedAsset.CWIP.Edit': 'CWIP Update',
    'FixedAsset.CWIP.Delete': 'CWIP Delete',


    // Disposal
    'FixedAsset.Disposal.View': 'Disposal View',
    'FixedAsset.Disposal.Create': 'Disposal Create',
    'FixedAsset.Disposal.Edit': 'Disposal Update',
    'FixedAsset.Disposal.Delete': 'Disposal Delete',

    // Depreciation Adjustment
    'FixedAsset.DepreciationAdjustment.View': 'Depreciation Adjustment View',
    'FixedAsset.DepreciationAdjustment.Create': 'Depreciation Adjustment Create',
    'FixedAsset.DepreciationAdjustment.Edit': 'Depreciation Adjustment Update',
    'FixedAsset.DepreciationAdjustment.Delete': 'Depreciation Adjustment Delete',


    // Program
    'Admission.Program.View': 'Program View',
    'Admission.Program.Create': 'Program Create',
    'Admission.Program.Edit': 'Program Update',
    'Admission.Program.Delete': 'Program Delete',

    'Admission.Faculty.View': 'Faculty View',
    'Admission.Faculty.Create': 'Faculty Create',
    'Admission.Faculty.Edit': 'Faculty Edit',
    'Admission.Faculty.Delete': 'Faculty Delete',

    'Admission.AcademicDepartment.View': 'Academic Department View',
    'Admission.AcademicDepartment.Create': 'Academic Department Create',
    'Admission.AcademicDepartment.Edit': 'Academic Department Edit',
    'Admission.AcademicDepartment.Delete': 'Academic Department Delete',

    'Admission.Degree.View': 'Degree View',
    'Admission.Degree.Create': 'Degree Create',
    'Admission.Degree.Edit': 'Degree Edit',
    'Admission.Degree.Delete': 'Degree Delete',

    'Admission.Semester.View': 'Semester View',
    'Admission.Semester.Create': 'Semester Create',
    'Admission.Semester.Edit': 'Semester Edit',
    'Admission.Semester.Delete': 'Semester Delete',

    'Admission.Course.View': 'Course View',
    'Admission.Course.Create': 'Course Create',
    'Admission.Course.Edit': 'Course Edit',
    'Admission.Course.Delete': 'Course Delete',

    'Admission.Qualification.View': 'Qualification View',
    'Admission.Qualification.Create': 'Qualification Create',
    'Admission.Qualification.Edit': 'Qualification Edit',
    'Admission.Qualification.Delete': 'Qualification Delete',

    'Admission.Subject.View': 'Subject View',
    'Admission.Subject.Create': 'Subject Create',
    'Admission.Subject.Edit': 'Subject Edit',
    'Admission.Subject.Delete': 'Subject Delete',

    'Admission.FeeItem.View': 'Fee Item View',
    'Admission.FeeItem.Create': 'Fee Item Create',
    'Admission.FeeItem.Edit': 'Fee Item Edit',
    'Admission.FeeItem.Delete': 'Fee Item Delete',

    'Admission.Country.View': 'Country View',
    'Admission.Country.Create': 'Country Create',
    'Admission.Country.Edit': 'Country Edit',
    'Admission.Country.Delete': 'Country Delete',

    'Admission.State.View': 'State View',
    'Admission.State.Create': 'State Create',
    'Admission.State.Edit': 'State Edit',
    'Admission.State.Delete': 'State Delete',

    'Admission.City.View': 'City View',
    'Admission.City.Create': 'City Create',
    'Admission.City.Edit': 'City Edit',
    'Admission.City.Delete': 'City Delete',

    'Admission.District.View': 'District View',
    'Admission.District.Create': 'District Create',
    'Admission.District.Edit': 'District Edit',
    'Admission.District.Delete': 'District Delete',

    'Admission.Domicile.View': 'Domicile View',
    'Admission.Domicile.Create': 'Domicile Create',
    'Admission.Domicile.Edit': 'Domicile Edit',
    'Admission.Domicile.Delete': 'Domicile Delete',

    'Admission.Applicant.Create': 'Applicant View',
    'Admission.Applicant.View': 'Applicant Create',
    'Admission.Applicant.Edit': 'Applicant Edit',
    'Admission.Applicant.Delete': 'Applicant Delete',

    'Admission.Shift.Create': 'Shift Create',
    'Admission.Shift.View': 'Shift View',
    'Admission.Shift.Edit': 'Shift Edit',
    'Admission.Shift.Delete': 'Shift Delete',

    'Admission.Batch.Create': 'Batch Create',
    'Admission.Batch.View': 'Batch View',
    'Admission.Batch.Edit': 'Batch Edit',
    'Admission.Batch.Delete': 'Batch Delete',

    'Admission.AdmissionCriteria.Create': 'Admission Criteria Create',
    'Admission.AdmissionCriteria.View': 'Admission Criteria View',
    'Admission.AdmissionCriteria.Edit': 'Admission Criteria Edit',
    'Admission.AdmissionCriteria.Delete': 'Admission Criteria Delete',
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
    {value: 'Depreciation Adjustment', id: DocType.DepreciationAdjustment}

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
