import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListCampusComponent } from './list-campus/list-campus.component';

const route : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListCampusComponent,
        data: {
          array: [
            { permission: Permissions.CAMPUS_VIEW },
            { permission: Permissions.CAMPUS_CREATE },
            { permission: Permissions.CAMPUS_DELETE },
            { permission: Permissions.CAMPUS_EDIT },
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

export class CampusRoutingModule { }
