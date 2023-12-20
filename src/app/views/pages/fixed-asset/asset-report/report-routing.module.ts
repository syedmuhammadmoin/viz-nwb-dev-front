import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ReportListComponent } from './report-list/report-list.component';
import {PrintAssetReportComponent} from './print-asset-report/print-asset-report.component';
import {AssetMonthlyReportComponent} from './asset-monthly-report/asset-monthly-report/asset-monthly-report.component';
import {PrintAssetMonthlyReportComponent} from './asset-monthly-report/print-asset-monthly-report/print-asset-monthly-report.component';
import { RegisterAssetComponent } from './register-asset/register-asset.component';



const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ReportListComponent,
        // data: {
        //   array: [
        //     { permission: Permissions.CWIP_VIEW },
        //     { permission: Permissions.CWIP_CREATE },
        //     { permission: Permissions.CWIP_EDIT },
        //   ]
        // },
        // canActivate: [PermissionGuard]
      },
      {
        path: 'print',
        component: PrintAssetReportComponent,
        // data: {
        //   array: [
        //     { permission: Permissions.CWIP_VIEW },
        //     { permission: Permissions.CWIP_CREATE },
        //     { permission: Permissions.CWIP_EDIT },
        //   ]
        // },
        // canActivate: [PermissionGuard]
      },
      {
        path: 'monthly',
        children: [
          {
            path: '',
            component: AssetMonthlyReportComponent
          },
          {
            path: 'print',
            component: PrintAssetMonthlyReportComponent
          }
        ]
      },
      {
        path: 'register',
        children: [
          {
            path: '',
            component: RegisterAssetComponent
          },
          // {
          //   path: 'print',
          //   component: PrintAssetMonthlyReportComponent
          // }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
