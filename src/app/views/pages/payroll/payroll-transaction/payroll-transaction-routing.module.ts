import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListPayrollTransactionComponent } from './list-payroll-transaction/list-payroll-transaction.component';
import { CreatePayrollTransactionComponent } from './create-payroll-transaction/create-payroll-transaction.component';
import { PayrollTransactionDetailComponent } from './payroll-transaction-detail/payroll-transaction-detail.component';
import { PrintPayrollTransactionComponent } from './print-payroll-transaction/print-payroll-transaction.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListPayrollTransactionComponent,
        data: {
          array: [
            { permission: Permissions.PAYROLL_TRANSACTION_VIEW },
            { permission: Permissions.PAYROLL_TRANSACTION_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreatePayrollTransactionComponent,
        data: {
          array: [
            { permission: Permissions.PAYROLL_TRANSACTION_CREATE },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreatePayrollTransactionComponent,
        data: {
          array: [
            { permission: Permissions.PAYROLL_TRANSACTION_EDIT },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: PayrollTransactionDetailComponent,
        data: {
          array: [
            { permission: Permissions.PAYROLL_TRANSACTION_VIEW },
            { permission: Permissions.PAYROLL_TRANSACTION_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintPayrollTransactionComponent,
        data: {
          array: [
            { permission: Permissions.PAYROLL_TRANSACTION_VIEW },
            { permission: Permissions.PAYROLL_TRANSACTION_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PayrollTransactionRoutingModule { }















