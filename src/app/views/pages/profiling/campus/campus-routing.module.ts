import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListCampusComponent } from './list-campus/list-campus.component';

const route : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListCampusComponent,
        // data: {
        //   array: [
        //     { permission: Permissions.BUSINESSPARTNER_VIEW },
        //     { permission: Permissions.BUSINESSPARTNER_CREATE },
        //     { permission: Permissions.BUSINESSPARTNER_DELETE },
        //     { permission: Permissions.BUSINESSPARTNER_EDIT },
        //   ]
        // },
        // canActivate: [PermissionGuard]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})

export class CampusRoutingModule { }
