import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListBusinessPartnerComponent } from './list-business-partner/list-business-partner.component';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { PrintBusinessPartnerComponent } from './print-business-partner/print-business-partner.component';

const route : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListBusinessPartnerComponent,
        data: {
          array: [
            { permission: Permissions.BUSINESSPARTNER_VIEW },
            { permission: Permissions.BUSINESSPARTNER_CREATE },
            { permission: Permissions.BUSINESSPARTNER_DELETE },
            { permission: Permissions.BUSINESSPARTNER_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintBusinessPartnerComponent,
        data: {
          array: [
            { permission: Permissions.BUSINESSPARTNER_VIEW },
            { permission: Permissions.BUSINESSPARTNER_CREATE },
            { permission: Permissions.BUSINESSPARTNER_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})

export class BusinessPartnerRoutingModule { }
