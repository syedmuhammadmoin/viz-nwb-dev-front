import { NgModule } from '@angular/core';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { ListJournalEntryComponent } from './list-journal-entry/list-journal-entry.component';
import { CreateJournalEntryComponent } from './create-journal-entry/create-journal-entry.component';
import { JouralEntryDetailsComponent } from './joural-entry-details/joural-entry-details.component';
import { PrintJournalEntryComponent } from './print-journal-entry/print-journal-entry.component';
import { FormConfirmationGuard } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListJournalEntryComponent,
        data: {
          array: [
            { permission: Permissions.JOURNALENTRY_VIEW },
            { permission: Permissions.JOURNALENTRY_CREATE },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateJournalEntryComponent,
        //canDeactivate: [FormConfirmationGuard],
        data: {
          array: [
            { permission: Permissions.JOURNALENTRY_CREATE },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateJournalEntryComponent,
        data: {
          array: [
            { permission: Permissions.JOURNALENTRY_EDIT },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: JouralEntryDetailsComponent,
        data: {
          array: [
            { permission: Permissions.JOURNALENTRY_VIEW },
            { permission: Permissions.JOURNALENTRY_CREATE },
          ]
        },
        canActivate: [PermissionGuard] 
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintJournalEntryComponent,
        data: {
          array: [
            { permission: Permissions.JOURNALENTRY_VIEW },
            { permission: Permissions.JOURNALENTRY_CREATE },
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
export class JournalEntryRoutingModule { }
