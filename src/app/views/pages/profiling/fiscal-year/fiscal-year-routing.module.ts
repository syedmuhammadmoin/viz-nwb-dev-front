import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListFiscalYearsComponent } from './list-fiscal-years/list-fiscal-years.component';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CreateFiscalYearComponent } from './create-fiscal-year/create-fiscal-year.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListFiscalYearsComponent,
        data: {
          array: [
            { permission: Permissions.JOURNAL_VIEW },
            { permission: Permissions.JOURNAL_CREATE },
            { permission: Permissions.JOURNAL_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateFiscalYearComponent,
        data: {
          array: [
            { permission: Permissions.JOURNAL_CREATE },
            { permission: Permissions.JOURNAL_VIEW },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateFiscalYearComponent,
        data: {
          array: [
            { permission: Permissions.JOURNAL_EDIT },
            { permission: Permissions.JOURNAL_VIEW },
          ]
        },
        canActivate: [PermissionGuard] 
      },    
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FiscalYearRoutingModule { }
