import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PermissionGuard } from 'src/app/core/auth/_guards/permission.guard';
import { CRUD_ROUTES } from 'src/app/views/shared/AppRoutes';
import { ListGoodsReturnNoteComponent } from './list-goods-return-note/list-goods-return-note.component';
import { GoodsReturnNoteDetailComponent } from './goods-return-note-detail/goods-return-note-detail.component';
import { PrintGoodsReturnNoteComponent } from './print-goods-return-note/print-goods-return-note.component';
import { CreateGoodsReturnNoteComponent } from './create-goods-return-note/create-goods-return-note.component';

const routes : Routes = [
  {
    path:'',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListGoodsReturnNoteComponent,
        data: {
          array: [
            { permission: Permissions.GOODS_RETURN_NOTE_VIEW },
            { permission: Permissions.GOODS_RETURN_NOTE_EDIT },
            { permission: Permissions.GOODS_RETURN_NOTE_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateGoodsReturnNoteComponent,
        data: {
          array: [
            { permission: Permissions.GOODS_RETURN_NOTE_CREATE },
            { permission: Permissions.GOODS_RETURN_NOTE_VIEW },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateGoodsReturnNoteComponent,
        data: {
          array: [
            { permission: Permissions.GOODS_RETURN_NOTE_EDIT },
            { permission: Permissions.GOODS_RETURN_NOTE_VIEW },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: GoodsReturnNoteDetailComponent,
        data: {
          array: [
            { permission: Permissions.GOODS_RETURN_NOTE_VIEW },
            { permission: Permissions.GOODS_RETURN_NOTE_EDIT },
            { permission: Permissions.GOODS_RETURN_NOTE_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintGoodsReturnNoteComponent,
        data: {
          array: [
            { permission: Permissions.GOODS_RETURN_NOTE_VIEW },
            { permission: Permissions.GOODS_RETURN_NOTE_EDIT },
            { permission: Permissions.GOODS_RETURN_NOTE_CREATE },
          ]
        },
        canActivate: [PermissionGuard]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GoodsReturnNoteRoutingModule { }
