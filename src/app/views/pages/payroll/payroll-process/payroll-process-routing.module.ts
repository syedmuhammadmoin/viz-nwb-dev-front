import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ApprovePayrollProcessComponent } from './approve-payroll-process/approve-payroll-process.component';
import { CreatePayrollProcessComponent } from './create-payroll-process/create-payroll-process.component';
import { PaymentProcessComponent } from './register-payment-process/create-payment-process/payment-process/payment-process.component';
import { ApprovePaymentProcessComponent } from './register-payment-process/approve-payment-process/approve-payment-process.component';

const route : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.APPROVE_PROCESS,
        component: ApprovePayrollProcessComponent,
        data: {
          array: [
            { permission: Permissions.PAYROLL_TRANSACTION_CREATE },
            { permission: Permissions.PAYROLL_TRANSACTION_APPROVE },
            { permission: Permissions.PAYROLL_TRANSACTION_REVIEW }
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE_PROCESS,
        component: CreatePayrollProcessComponent,
        data: {
          array: [
            { permission: Permissions.PAYROLL_TRANSACTION_CREATE }
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.REGISTER_PAYMENT,
        children: [
          {
            path: '',
            redirectTo: CRUD_ROUTES.CREATE_PAYMENT
          },
          {
            path: CRUD_ROUTES.CREATE_PAYMENT,
            component: PaymentProcessComponent,
            data: {
              array: [
                {permission: Permissions.PAYROLL_TRANSACTION_CREATE}
              ]
            },
            canActivate: [PermissionGuard]
          },
          {
            path: CRUD_ROUTES.APPROVE_PAYMENT,
            component: ApprovePaymentProcessComponent,
            data: {
              array: [
                {permission: Permissions.PAYROLL_TRANSACTION_CREATE}
              ]
            },
            canActivate: [PermissionGuard]
          }
        ]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})

export class PayrollProcessRoutingModule { }
