import { NgModule } from '@angular/core';
import { DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { ListPaymentComponent } from './list-payment/list-payment.component';
import { DetailPaymentComponent } from './detail-payment/detail-payment.component';
import { PaymentInvoiceComponent } from './print-payment/payment-invoice.component';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';

const documents = DocType

const routes : Routes = [
  {
    path:'basic',
    children: [
      {
        path: CRUD_ROUTES.LIST, 
        component: ListPaymentComponent,
        data: {
          array: [
            { permission: Permissions.PAYMENT_VIEW },
            { permission: Permissions.PAYMENT_CREATE },
            { permission: Permissions.BUSINESSPARTNER_CREATE },
            { permission: Permissions.PAYMENT_DELETE },
            { permission: Permissions.PAYMENT_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: DetailPaymentComponent,
        data: {
          array: [
            { permission: Permissions.PAYMENT_VIEW },
            { permission: Permissions.PAYMENT_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PaymentInvoiceComponent,
        data: {
          array: [
            { permission: Permissions.PAYMENT_VIEW },
            { permission: Permissions.PAYMENT_CREATE },
          ]
        },
        canActivate: [PermissionGuard] 
      },
    ]
  },
  {
    path: 'internal',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListPaymentComponent,
        data: {
          docType: documents.InternalReceipt,
          array: [
            { permission: Permissions.INTERNALRECIPT_VIEW },
            { permission: Permissions.INTERNALRECIPT_CREATE },
            { permission: Permissions.INTERNALRECIPT_EDIT },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: DetailPaymentComponent,
        data: {
          docType: documents.InternalReceipt,
          array: [
            { permission: Permissions.INTERNALRECIPT_VIEW },
            { permission: Permissions.INTERNALRECIPT_CREATE },
            { permission: Permissions.INTERNALRECIPT_EDIT },
          ]
        },
        canActivate: [PermissionGuard],
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PaymentInvoiceComponent,
        data: {
          docType: documents.InternalReceipt,
          array: [
            { permission: Permissions.INTERNALRECIPT_VIEW },
            { permission: Permissions.INTERNALRECIPT_CREATE },
            { permission: Permissions.INTERNALRECIPT_EDIT },
          ]
        },
        canActivate: [PermissionGuard],
      }
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes) ],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
