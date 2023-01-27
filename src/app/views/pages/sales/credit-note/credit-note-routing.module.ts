import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { ListCreditNoteComponent } from './list-credit-note/list-credit-note.component';
import { CreateCreditNoteComponent } from './create-credit-note/create-credit-note.component';
import { CreditNoteDetailComponent } from './credit-note-detail/credit-note-detail.component';
import { PrintCreditNoteComponent } from './print-credit-note/print-credit-note.component';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';

const route : Routes = [
  {
    path: '',
    children: [
        {
          path: CRUD_ROUTES.LIST, 
          component: ListCreditNoteComponent,
          data: {
          array: [
            { permission: Permissions.CREDITNOTE_VIEW },
            { permission: Permissions.CREDITNOTE_CREATE },
            { permission: Permissions.CREDITNOTE_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
        },
        {
          path: CRUD_ROUTES.CREATE,
          component: CreateCreditNoteComponent,
          data: {
          array: [
            { permission: Permissions.CREDITNOTE_CREATE },
            { permission: Permissions.CREDITNOTE_VIEW },
          ]
        },
        canActivate: [PermissionGuard]
        },
        {
          path: CRUD_ROUTES.EDIT,
          component: CreateCreditNoteComponent,
          data: {
          array: [
            { permission: Permissions.CREDITNOTE_EDIT },
            { permission: Permissions.CREDITNOTE_VIEW },
          ]
        },
        canActivate: [PermissionGuard]
        },
        {
          path: CRUD_ROUTES.DETAILS,
          component: CreditNoteDetailComponent,
          data: {
          array: [
            { permission: Permissions.CREDITNOTE_VIEW },
            { permission: Permissions.CREDITNOTE_CREATE },
            { permission: Permissions.CREDITNOTE_EDIT },
          ]
        },
        canActivate: [PermissionGuard]
        },
        {
          path: CRUD_ROUTES.PRINT,
          component: PrintCreditNoteComponent,
          data: {
          array: [
            { permission: Permissions.CREDITNOTE_VIEW },
            { permission: Permissions.CREDITNOTE_CREATE },
            { permission: Permissions.CREDITNOTE_EDIT },
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
export class CreditNoteRoutingModule { }
