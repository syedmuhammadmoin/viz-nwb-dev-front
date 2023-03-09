import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListBatchTypeComponent } from './list-batch-type/list-batch-type.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListBatchTypeComponent,
        // data: {
        //   array: [
        //     { permission: Permissions.FACULTY_VIEW },
        //     { permission: Permissions.FACULTY_CREATE },
        //   ]
        // },
        // canActivate: [PermissionGuard]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchTypeRoutingModule { }
