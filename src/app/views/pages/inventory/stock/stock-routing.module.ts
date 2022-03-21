import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { ListStockComponent } from './list-stock/list-stock.component';

const route : Routes = [
  {
    path: '',
    children: [
        {
        path: CRUD_ROUTES.LIST,
        component: ListStockComponent,
        data: {
          array: [
            { permission: Permissions.STOCK_VIEW }
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
export class StockRoutingModule { }
