import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTaxComponent } from './list-tax/list-tax.component';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { Permissions } from 'src/app/views/shared/AppEnum';


const routes : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListTaxComponent,
        data: {
          array: [
            { permission: Permissions.TAXES_VIEW },
            { permission: Permissions.TAXES_CREATE },
            { permission: Permissions.TAXES_DELETE },
            { permission: Permissions.TAXES_EDIT },
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

export class TaxRoutingModule { }
