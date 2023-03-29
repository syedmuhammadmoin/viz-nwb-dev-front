import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CRUD_ROUTES} from '../../../shared/AppRoutes';
import {ListCountryComponent} from './list-country/list-country.component';
import {CreateCountryComponent} from './create-country/create-country.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListCountryComponent,
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
        component: CreateCountryComponent,
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
export class CountryRoutingModule { }
