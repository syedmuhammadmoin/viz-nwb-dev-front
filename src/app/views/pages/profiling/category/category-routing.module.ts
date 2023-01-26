import { CRUD_ROUTES } from '../../../shared/AppRoutes';
import { NgModule } from '@angular/core';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { ListCategoryComponent } from './list-category/list-category.component';

const route : Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListCategoryComponent,
        data: {
          array: [
            { permission: Permissions.CATEGORIES_VIEW },
            { permission: Permissions.CATEGORIES_CREATE },
            { permission: Permissions.CATEGORIES_DELETE },
            { permission: Permissions.CATEGORIES_EDIT },
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

export class CategoryRoutingModule { }
