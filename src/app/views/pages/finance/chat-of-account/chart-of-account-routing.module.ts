import { NgModule } from '@angular/core';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { ChatOfAccountComponent } from './chat-of-account.component';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListChartOfAccountComponent } from './list-chart-of-account/list-chart-of-account.component';

const routes : Routes = [
  {
    path: '',
    children: [
      // Obselete Component
      // {
      //   path: CRUD_ROUTES.LIST,
      //   component: ChatOfAccountComponent,
      //   data: {
      //     array: [
      //       { permission: Permissions.CHARTOFACCOUNT_VIEW },
      //       { permission: Permissions.LEVEL4_CREATE },
      //       { permission: Permissions.LEVEL4_VIEW },
      //       { permission: Permissions.LEVEL4_EDIT },
      //     ]
      //   },
      //   canActivate: [PermissionGuard],
      // },
      {
        path: CRUD_ROUTES.LIST,
        component: ListChartOfAccountComponent,
        data: {
          array: [
            { permission: Permissions.CHARTOFACCOUNT_VIEW },
            { permission: Permissions.LEVEL4_CREATE },
            { permission: Permissions.LEVEL4_VIEW },
            { permission: Permissions.LEVEL4_EDIT },
          ]
        },
        canActivate: [PermissionGuard],
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes) ],
  exports: [RouterModule]
})
export class ChartOfAccountRoutingModule { }
