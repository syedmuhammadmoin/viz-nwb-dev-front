import { NgModule } from '@angular/core';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { ListJournalComponent } from './list-journal/list-journal.component';
import { CreateJournalComponent } from './create-journal/create-journal.component';
import { JournalDetailsComponent } from './journal-details/journal-details.component';
import { PrintJournalComponent } from './print-journal/print-journal.component';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListJournalComponent,
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
        component: CreateJournalComponent,
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
        component: CreateJournalComponent,
        data: {
          array: [
            { permission: Permissions.JOURNAL_EDIT },
            { permission: Permissions.JOURNAL_VIEW },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: JournalDetailsComponent,
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
        path: CRUD_ROUTES.PRINT,
        component: PrintJournalComponent,
        data: {
          array: [
            { permission: Permissions.JOURNAL_VIEW },
            { permission: Permissions.JOURNAL_CREATE },
            { permission: Permissions.JOURNAL_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes) ],
  exports: [RouterModule]
})
export class JournalRoutingModule { }
