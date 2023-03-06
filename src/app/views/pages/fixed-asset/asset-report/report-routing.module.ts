import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ReportListComponent } from './report-list/report-list.component';


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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
