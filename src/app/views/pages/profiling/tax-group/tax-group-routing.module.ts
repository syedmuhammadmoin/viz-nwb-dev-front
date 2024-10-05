import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { ListTaxGroupComponent } from './list-tax-group/list-tax-group.component';
import { CreateTaxGroupComponent } from './create-tax-group/create-tax-group.component';

const routes : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListTaxGroupComponent,
        data: {
          array: [
            { permission: Permissions.TAXES_GROUP_VIEW },
            { permission: Permissions.TAXES_GROUP_CREATE },
            { permission: Permissions.TAXES_GROUP_DELETE },
            { permission: Permissions.TAXES_GROUP_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },   
      // {
      //   path: CRUD_ROUTES.EDIT,
      //   component: CreateTaxGroupComponent,
      //   data: {
      //     array: [
      //       { permission: Permissions.TAXES_GROUP_EDIT },
      //       { permission: Permissions.TAXES_GROUP_VIEW },
      //     ]
      //   },
      //   canActivate: [PermissionGuard] 
      // },  
   
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxGroupRoutingModule { }
