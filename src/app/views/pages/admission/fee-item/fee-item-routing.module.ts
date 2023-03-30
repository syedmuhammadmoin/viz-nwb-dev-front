import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CRUD_ROUTES} from '../../../shared/AppRoutes';
import {ListCityComponent} from '../city/list-city/list-city.component';
import {CreateCityComponent} from '../city/create-city/create-city.component';
import {ListFeeItemComponent} from './list-fee-item/list-fee-item.component';
import {CreateFeeItemComponent} from './create-fee-item/create-fee-item.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListFeeItemComponent,
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
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateFeeItemComponent,
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
export class FeeItemRoutingModule { }
