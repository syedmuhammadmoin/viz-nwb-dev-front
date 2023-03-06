// Angular
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
// Components
import {BaseComponent} from './views/theme/base/base.component';
// Auth
import {AuthGuard} from './core/auth';
import {APP_ROUTES} from './views/shared/AppRoutes';

const routes: Routes = [
  {
    path: APP_ROUTES.AUTH,
    loadChildren: () =>
      import('./views/pages/auth/auth.module').then(
        (m) => m.AuthModule
      ),
    canActivateChild: [AuthGuard]
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./views/pages/error/error.module').then(
        (m) => m.ErrorModule)
  },
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: APP_ROUTES.BUILDER,
        loadChildren: () =>
          import('./views/theme/content/builder/builder.module').then(
            (m) => m.BuilderModule
          ),
      },
      // Lazy Load DASHBOARD Module
      {
        path: APP_ROUTES.DASHBOARD,
        loadChildren: () =>
          import('./views/pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        canActivateChild: [AuthGuard]
      },

      // Access Management Section
      // Lazy Load ACCESS MANAGEMENT Module
      {
        path: APP_ROUTES.ACCESS_MANAGEMENT,
        loadChildren: () =>
          import('./views/pages/access-management/access-management.module').then(
            (m) => m.AccessManagementModule
          ),
        canActivateChild: [AuthGuard]
      },

      // profiling Section
      // Lazy Load BUSINESS PARTNER Module
      {
        path: APP_ROUTES.BUSINESS_PARTNER,
        loadChildren: () =>
          import('./views/pages/profiling/business-partner/business-partner.module').then(
            (m) => m.BusinessPartnerModule
          ),
        canActivateChild: [AuthGuard]
      },
      {
        path: APP_ROUTES.CAMPUS,
        loadChildren: () =>
          import('./views/pages/profiling/campus/campus.module').then(
            (m) => m.CampusModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load CATEGORY Module
      {
        path: APP_ROUTES.CATEGORY,
        loadChildren: () =>
          import('./views/pages/profiling/category/category.module').then(
            (m) => m.CategoryModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load ORGANIZATION Module
      {
        path: APP_ROUTES.ORGANIZATION,
        loadChildren: () =>
          import('./views/pages/profiling/organization/organization.module').then(
            (m) => m.OrganizationModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load PRODUCT Module
      {
        path: APP_ROUTES.PRODUCT, // <= Page URL
        loadChildren: () =>
          import('./views/pages/profiling/product/product.module').then(
            (m) => m.ProductModule
          ),
        canActivateChild: [AuthGuard] // <= Page component registration
      },
      // Lazy Load WAREHOUSE Module
      {
        path: APP_ROUTES.WAREHOUSE, // <= Page URL
        loadChildren: () =>
          import('./views/pages/profiling/warehouse/warehouse.module').then(
            (m) => m.WarehouseModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load TAX Module
      {
        path: APP_ROUTES.TAX, // <= Page URL
        loadChildren: () =>
          import('./views/pages/profiling/tax/tax.module').then(
            (m) => m.TaxModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load Unit Of Measurement Module
      {
        path: APP_ROUTES.UNIT_OF_MEASUREMENT, // <= Page URL
        loadChildren: () =>
          import('./views/pages/profiling/unit-of-measurement/unit-of-measurement.module').then(
            (m) => m.UnitOfMeasurementModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Budget Section
      // Lazy Load BUDGET Module
      {
        path: APP_ROUTES.BUDGET,
        loadChildren: () =>
          import('./views/pages/budget/current-budget/budget.module').then(
            (m) => m.BudgetModule
          ),
        canActivateChild: [AuthGuard]
      },
      {
        path: APP_ROUTES.BUDGET_REAPPROPIATION,
        loadChildren: () =>
          import('./views/pages/budget/budget-reappropiation/budget-reappropiation.module').then(
            (m) => m.BudgetReappropiationModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load ESTIMATED BUDGET Module
      {
        path: APP_ROUTES.ESTIMATED_BUDGET,
        loadChildren: () =>
          import('./views/pages/budget/estimated-budget/estimated-budget.module').then(
            (m) => m.EstimatedBudgetModule
          ),
        canActivateChild: [AuthGuard]
      },

      // finance Section
      // Lazy Load BANK ACCOUNT Module
      {
        path: APP_ROUTES.BANK_ACCOUNT,
        loadChildren: () =>
          import('./views/pages/finance/bank-account/bank-account.module').then(
            (m) => m.BankAccountModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load BANK RECONCILIATION Module
      {
        path: APP_ROUTES.BANK_RECONCILIATION,
        loadChildren: () =>
          import('./views/pages/finance/bank-reconciliation/bank-reconciliation.module').then(
            (m) => m.BankReconciliationModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load BANK STATEMENT Module
      {
        path: APP_ROUTES.BANK_STATEMENT,
        loadChildren: () =>
          import('./views/pages/finance/bank-statement/bank-statement.module').then(
            (m) => m.BankStatementModule
          ),
        canActivateChild: [AuthGuard]
      },

      // Lazy Load CASH ACCOUNT Module
      {
        path: APP_ROUTES.CASH_ACCOUNT,
        loadChildren: () =>
          import('./views/pages/finance/cash-account/cash-account.module').then(
            (m) => m.CashAccountModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load JOURNAL ENTRY Module
      {
        path: APP_ROUTES.JOURNAL_ENTRY, // <= Page URL
        loadChildren: () =>
          import('./views/pages/finance/journalEntry/journal-entry.module').then(
            (m) => m.JournalEntryModule
          ),
        canActivateChild: [AuthGuard] // <= Page component registration
      },
      // Lazy Load PAYMENT Module
      {
        path: APP_ROUTES.PAYMENT, // <= Page URL
        loadChildren: () =>
          import('./views/pages/finance/payment/payment.module').then(
            (m) => m.PaymentModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load VENDOR BILL Module
      {
        path: APP_ROUTES.CHART_OF_ACCOUNT, // <= Page URL
        loadChildren: () =>
          import('./views/pages/finance/chat-of-account/chat-of-account.module').then(
            (m) => m.ChatOfAccountModule
          ),
        canActivateChild: [AuthGuard]
      },

      // Procurement Section
      // Lazy Load REQUISITION Module
      {
        path: APP_ROUTES.REQUISITION,
        loadChildren: () =>
          import('./views/pages/procurement/requisition/requisition.module').then(
            (m) => m.RequisitionModule
          ),
        canActivateChild: [AuthGuard]
      },

      // Lazy Load Quotation Module
      {
        path: APP_ROUTES.QUOTATION,
        loadChildren: () =>
          import('./views/pages/procurement/quotation/quotation.module').then(
            (m) => m.QuotationModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load Call Quotation Module
      {
        path: APP_ROUTES.CALL_QUOTATION,
        loadChildren: () =>
          import('./views/pages/procurement/call-quotation/call-quotation.module').then(
            (m) => m.CallQuotationModule
          ),
        canActivateChild: [AuthGuard]
      },

      // Lazy Load Quotation Comparative Module
      {
        path: APP_ROUTES.QUOTATION_COMPARATIVE,
        loadChildren: () =>
          import('./views/pages/procurement/quotation-comparative/quotation-comparative.module').then(
            (m) => m.QuotationComparativeModule
          ),
        canActivateChild: [AuthGuard]
      },

      // Lazy Load REQUEST REQUISITION Module
      {
        path: APP_ROUTES.REQUEST_REQUISITION,
        loadChildren: () =>
          import('./views/pages/procurement/request-requisition/request-requisition.module').then(
            (m) => m.RequestRequisitionModule
          ),
        canActivateChild: [AuthGuard]
      },

      // Lazy Load BID EVALUATION Module
      {
        path: APP_ROUTES.BID_EVALUATION,
        loadChildren: () =>
          import('./views/pages/procurement/bid-evaluation/bid-evaluation.module').then(
            (m) => m.BidEvaluationModule
          ),
        canActivateChild: [AuthGuard]
      },

      // sales Section
      // Lazy Load CREDIT NOTE Module
      {
        path: APP_ROUTES.CREDIT_NOTE,
        loadChildren: () =>
          import('./views/pages/sales/credit-note/credit-note.module').then(
            (m) => m.CreditNoteModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load INVOICE Module
      {
        path: APP_ROUTES.INVOICE, // <= Page URL
        loadChildren: () =>
          import('./views/pages/sales/invoice/invoice.module').then(
            (m) => m.InvoiceModule
          ),
        canActivateChild: [AuthGuard] // <= Page component registration
      },
      // purchase Section
      // Lazy Load DEBIT NOTE Module
      {
        path: APP_ROUTES.DEBIT_NOTE,
        loadChildren: () =>
          import('./views/pages/purchase/debit-note/debit-note.module').then(
            (m) => m.DebitNoteModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load PURCHASE ORDER Module
      {
        path: APP_ROUTES.PURCHASE_ORDER, // <= Page URL
        loadChildren: () =>
          import('./views/pages/purchase/purchase-order/purchase-order.module').then(
            (m) => m.PurchaseOrderModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load VENDOR BILL Module
      {
        path: APP_ROUTES.BILL, // <= Page URL
        loadChildren: () =>
          import('./views/pages/purchase/vendorBill/vendor-bill.module').then(
            (m) => m.VendorBillModule
          ),
        canActivateChild: [AuthGuard]
      },

      // Reports Section
      {
        path: APP_ROUTES.REPORT,
        loadChildren: () =>
          import('./views/pages/report/report.module').then(
            (m) => m.ReportModule
          ),
        canActivateChild: [AuthGuard]
      },

      // Payroll Section
      // Payroll Item
      // Lazy Load Payroll Item Module
      {
        path: APP_ROUTES.PAYROLL_ITEM,
        loadChildren: () =>
          import('./views/pages/payroll/payroll-item/payroll-item.module').then(
            (m) => m.PayrollItemModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Payroll Transaction
      // Lazy Load Payroll Transaction Module
      {
        path: APP_ROUTES.PAYROLL_TRANSACTION,
        loadChildren: () =>
          import('./views/pages/payroll/payroll-transaction/payroll-transaction.module').then(
            (m) => m.PayrollTransactionModule
          ),
        canActivateChild: [AuthGuard]
      },
      {
        path: APP_ROUTES.PAYROLL_PROCESS,
        loadChildren: () =>
          import('./views/pages/payroll/payroll-process/payroll-process.module').then(
            (m) => m.PayrollProcessModule
          ),
        canActivateChild: [AuthGuard]
      },
      {
        path: APP_ROUTES.PAYROLL_REPORTS,
        loadChildren: () =>
          import('./views/pages/payroll/payroll-reports/payroll-reports.module').then(
            (m) => m.PayrollReportsModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load Department Module
      {
        path: APP_ROUTES.DEPARTMENT,
        loadChildren: () =>
          import('./views/pages/payroll/department/department.module').then(
            (m) => m.DepartmentModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load Designation Module
      {
        path: APP_ROUTES.DESIGNATION,
        loadChildren: () =>
          import('./views/pages/payroll/designation/designation.module').then(
            (m) => m.DesignationModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load Employee Module
      {
        path: APP_ROUTES.EMPLOYEE,
        loadChildren: () =>
          import('./views/pages/payroll/employee/employee.module').then(
            (m) => m.EmployeeModule
          ),
        canActivateChild: [AuthGuard]
      },

      // Inventory Section
      // Lazy Load STOCK Module
      {
        path: APP_ROUTES.STOCK,
        loadChildren: () =>
          import('./views/pages/inventory/stock/stock.module').then(
            (m) => m.StockModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load GOODS RECEIVED NOTE Module
      {
        path: APP_ROUTES.GOODS_RECEIVED_NOTE, // <= Page URL
        loadChildren: () =>
          import('./views/pages/inventory/goods-received-note/goods-received-note.module').then(
            (m) => m.GoodsReceivedNoteModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load ISSUANCE Module
      {
        path: APP_ROUTES.ISSUANCE, // <= Page URL
        loadChildren: () =>
          import('./views/pages/inventory/issuance/issuance.module').then(
            (m) => m.IssuanceModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load ISSUANCE RETURN Module
      {
        path: APP_ROUTES.ISSUANCE_RETURN, // <= Page URL
        loadChildren: () =>
          import('./views/pages/inventory/issuance-return/issuance-return.module').then(
            (m) => m.IssuanceReturnModule
          ),
        // canActivateChild: [AuthGuard]
      },
      // Lazy Load GOODS RETURN NOTE Module
      {
        path: APP_ROUTES.GOODS_RETURN_NOTE, // <= Page URL
        loadChildren: () =>
          import('./views/pages/inventory/goods-return-note/goods-return-note.module').then(
            (m) => m.GoodsReturnNoteModule
          ),
        canActivateChild: [AuthGuard]
      },

      // Workflow Section
      // Lazy Load WORKFLOW Module
      {
        path: APP_ROUTES.WORKFLOW, // <= Page URL
        loadChildren: () =>
          import('./views/pages/workflows/workflow/workflow.module').then(
            (m) => m.WorkflowModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load STATUS Module
      {
        path: APP_ROUTES.STATUS, // <= Page URL
        loadChildren: () =>
          import('./views/pages/workflows/status/status.module').then(
            (m) => m.StatusModule
          ),
        canActivateChild: [AuthGuard]
      },
      // FIXED ASSET
      // Lazy Load DEPRECIATION MODEL Module
      {
        path: APP_ROUTES.DEPRECIATION_MODEL, // <= Page URL
        loadChildren: () =>
          import('./views/pages/fixed-asset/depreciation-model/depreciation-method.module').then(
            (m) => m.DepreciationMethodModule
          ),
        canActivateChild: [AuthGuard]
      },

      // Lazy Load DEPRECIATION MODEL Module
      {
        path: APP_ROUTES.DEPRECIATION_ADJUSTMENT, // <= Page URL
        loadChildren: () =>
          import('./views/pages/fixed-asset/depreciation-adjustment/depreciation-adjustment.module').then(
            (m) => m.DepreciationAdjustmentModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load ASSET Module
      {
        path: APP_ROUTES.ASSET, // <= Page URL
        loadChildren: () =>
          import('./views/pages/fixed-asset/asset/asset.module').then(
            (m) => m.AssetModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load CWIP Module
      {
        path: APP_ROUTES.CWIP, // <= Page URL
        loadChildren: () =>
          import('./views/pages/fixed-asset/cwip/cwip.module').then(
            (m) => m.CwipModule
          ),
        canActivateChild: [AuthGuard]
      },
      // Lazy Load DISPOSAL Module
      {
        path: APP_ROUTES.DISPOSAL, // <= Page URL
        loadChildren: () =>
          import('./views/pages/fixed-asset/disposal/disposal.module').then(
            (m) => m.DisposalModule
          ),
        canActivateChild: [AuthGuard]
      },
      {path: '', redirectTo: APP_ROUTES.DASHBOARD, pathMatch: 'full'},
      {path: '**', redirectTo: APP_ROUTES.DASHBOARD, pathMatch: 'full'},
    ],
  },
  {path: '**', redirectTo: 'error/403', pathMatch: 'full'},
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {
}
