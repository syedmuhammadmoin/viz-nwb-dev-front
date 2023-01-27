import { NgModule } from '@angular/core';
import { Permissions } from '../../../shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { ListVendorBillComponent } from './list-vendor-bill/list-vendor-bill.component';
import { CreateVendorBillComponent } from './create-vendor-bill/create-vendor-bill.component';
import { VendorBillDetailComponent } from './vendor-bill-detail/vendor-bill-detail.component';
import { PrintBillComponent } from './print-bill/print-bill.component';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { AgingReportComponent } from './aging-report/aging-report.component';
const routes : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListVendorBillComponent,
        data: {
          array: [
            { permission: Permissions.BILL_VIEW },
            { permission: Permissions.BILL_CREATE },
            { permission: Permissions.BILL_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateVendorBillComponent,
        data: {
          array: [
            { permission: Permissions.BILL_CREATE },
            { permission: Permissions.BILL_VIEW },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateVendorBillComponent,
        data: {
          array: [
            { permission: Permissions.BILL_EDIT },
            { permission: Permissions.BILL_VIEW },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: VendorBillDetailComponent,
        data: {
          array: [
            { permission: Permissions.BILL_VIEW },
            { permission: Permissions.BILL_CREATE },
            { permission: Permissions.BILL_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintBillComponent,
        data: {
          array: [
            { permission: Permissions.BILL_VIEW },
            { permission: Permissions.BILL_CREATE },
            { permission: Permissions.BILL_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.AGING_REPORT,
        component: AgingReportComponent,
        data: {
          array: [
            { permission: Permissions.BILL_VIEW },
            { permission: Permissions.BILL_CREATE },
            { permission: Permissions.BILL_EDIT }
          ]
        },
        canActivate: [PermissionGuard]
      },
    ]
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorBillRoutingModule { }
