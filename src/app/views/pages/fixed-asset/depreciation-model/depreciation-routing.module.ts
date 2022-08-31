import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListDepreciationComponent } from './list-depreciation/list-depreciation.component';

const route : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListDepreciationComponent,
        data: {
          array: [
            { permission: Permissions.DEPRECIATION_MODEL_VIEW },
            { permission: Permissions.DEPRECIATION_MODEL_CREATE },
            { permission: Permissions.DEPRECIATION_MODEL_DELETE },
            { permission: Permissions.DEPRECIATION_MODEL_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
      },
      // {
      //   path: CRUD_ROUTES.CREATE,
      //   component: CreateDepreciationComponent,
      //   data: {
      //     array: [
      //       { permission: Permissions.BANKACCOUNT_VIEW },
      //       { permission: Permissions.BANKACCOUNT_CREATE },
      //       { permission: Permissions.BANKACCOUNT_DELETE },
      //       { permission: Permissions.BANKACCOUNT_EDIT },
      //     ]
      //   },
      //   canActivate: [PermissionGuard]
      // }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})

export class DepreciationRoutingModule { }
