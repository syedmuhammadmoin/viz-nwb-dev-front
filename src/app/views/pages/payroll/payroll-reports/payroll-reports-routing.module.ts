import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { CRUD_ROUTES, PAYROLL_REPORT } from 'src/app/views/shared/AppRoutes';
import { AllowanceReportComponent } from './allowance-report/allowance-report.component';
import { BankAdviceReportComponent } from './bank-advice-report/bank-advice-report.component';
import { PayrollExecutiveReportComponent } from './payroll-executive-report/payroll-executive-report.component';
import { PayrollTransReportComponent } from './payroll-trans-report/payroll-trans-report.component';
import { PrintBankAdviceComponent } from './print-bank-advice/print-bank-advice.component';
import { PrintExecutiveReportComponent } from './print-executive-report/print-executive-report.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PAYROLL_REPORT.TRANSACTION,
        children: [
          {
            path: CRUD_ROUTES.LIST,
            component: PayrollTransReportComponent,
            data: {
              array: [
                {permission: Permissions.PAYROLL_TRANSACTION_CREATE},
                {permission: Permissions.PAYROLL_TRANSACTION_VIEW},
                {permission: Permissions.PAYROLL_TRANSACTION_EDIT},
                {permission: Permissions.PAYROLL_TRANSACTION_DELETE},
                {permission: Permissions.PAYROLL_TRANSACTION_REVIEW},
                {permission: Permissions.PAYROLL_TRANSACTION_APPROVE},
              ]
            },
            canActivate: [PermissionGuard]
          },
          // {
          //   path: 'print',
          //   component: PrintPayrollTransactionReportComponent,
          //   data: {
          //     array: [
          //       {permission: Permissions.PAYROLL_TRANSACTION_CREATE},
          //       {permission: Permissions.PAYROLL_TRANSACTION_VIEW},
          //       {permission: Permissions.PAYROLL_TRANSACTION_EDIT},
          //       {permission: Permissions.PAYROLL_TRANSACTION_DELETE},
          //       {permission: Permissions.PAYROLL_TRANSACTION_REVIEW},
          //       {permission: Permissions.PAYROLL_TRANSACTION_APPROVE},
          //     ]
          //   },
          //   canActivate: [PermissionGuard]
          // },
        ]
      },
      {
        path: PAYROLL_REPORT.EXECUTIVE,
        children: [
          {
            path: CRUD_ROUTES.LIST,
            component: PayrollExecutiveReportComponent,
            data: {
              // array: [
              //   {permission: Permissions.PAYROLL_EXECUTIVE_CREATE},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_VIEW},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_EDIT},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_DELETE},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_REVIEW},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_APPROVE},
              // ]
            },
            //canActivate: [PermissionGuard]
          },
          {
            path: 'print',
            component: PrintExecutiveReportComponent,
            data: {
              // array: [
              //   {permission: Permissions.PAYROLL_EXECUTIVE_CREATE},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_VIEW},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_EDIT},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_DELETE},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_REVIEW},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_APPROVE},
              // ]
            },
            //canActivate: [PermissionGuard]
          },
        ]
      },
      {
        path: PAYROLL_REPORT.BANK_ADVICE,
        children: [
          {
            path: CRUD_ROUTES.LIST,
            component: BankAdviceReportComponent,
            data: {
              // array: [
              //   {permission: Permissions.PAYROLL_EXECUTIVE_CREATE},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_VIEW},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_EDIT},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_DELETE},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_REVIEW},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_APPROVE},
              // ]
            },
            //canActivate: [PermissionGuard]
          },
          {
            path: 'print',
            component: PrintBankAdviceComponent,
            data: {
              // array: [
              //   {permission: Permissions.PAYROLL_EXECUTIVE_CREATE},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_VIEW},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_EDIT},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_DELETE},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_REVIEW},
              //   {permission: Permissions.PAYROLL_EXECUTIVE_APPROVE},
              // ]
            },
            //canActivate: [PermissionGuard]
          },
        ]
      },
      {
        path: PAYROLL_REPORT.ALLOWANCE,
        children: [
          {
            path: 'report',
            component: AllowanceReportComponent,
            data: {
              array: [
                {permission: Permissions.ALLOWANCE_VIEW}
              ]
            },
            canActivate: [PermissionGuard]
          },
          // {
          //   path: 'print',
          //   component: PrintAllowancesComponent,
          //   data: {
          //     array: [
          //       {permission: Permissions.ALLOWANCE_VIEW}
          //     ]
          //   },
          //   canActivate: [PermissionGuard]
          // },
        ]
      },
    ]
  }
]
      

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollReportsRoutingModule { }
