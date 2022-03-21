import { NgModule } from '@angular/core';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { ListWarehouseComponent } from './list-warehouse/list-warehouse.component';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';

const routes : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListWarehouseComponent,
        data: {
          array: [
            { permission: Permissions.WAREHOUSE_VIEW },
            { permission: Permissions.WAREHOUSE_CREATE },
            { permission: Permissions.WAREHOUSE_DELETE },
            { permission: Permissions.WAREHOUSE_EDIT },
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
export class WarehouseRoutingModule { }
