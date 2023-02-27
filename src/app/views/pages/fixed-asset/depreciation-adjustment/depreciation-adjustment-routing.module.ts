import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CRUD_ROUTES} from '../../../shared/AppRoutes';
import {ListDepreciationAdjustmentComponent} from './list-depreciation-adjustment/list-depreciation-adjustment.component';
import {CreateDepreciationAdjustmentComponent} from './create-depreciation-adjustment/create-depreciation-adjustment.component';
import {DetailDepreciationAdjustmentComponent} from './detail-depreciation-adjustment/detail-depreciation-adjustment.component';
import {PrintDepreciationAdjustmentComponent} from './print-depreciation-adjustment/print-depreciation-adjustment.component';
import {Permissions} from '../../../shared/AppEnum';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: CRUD_ROUTES.LIST,
        component: ListDepreciationAdjustmentComponent,
        data: {
          array: [
            { permission: Permissions.DEPRECIATION_ADJUSTMENT_VIEW },
            { permission: Permissions.DEPRECIATION_ADJUSTMENT_CREATE },
            { permission: Permissions.DEPRECIATION_ADJUSTMENT_EDIT },
          ]
        },
      },
      {
        path: CRUD_ROUTES.CREATE,
        component: CreateDepreciationAdjustmentComponent,
        data: {
          array: [
            { permission: Permissions.DEPRECIATION_ADJUSTMENT_CREATE },
          ]
        },
      },
      {
        path: CRUD_ROUTES.EDIT,
        component: CreateDepreciationAdjustmentComponent,
        data: {
          array: [
            { permission: Permissions.DEPRECIATION_ADJUSTMENT_EDIT },
          ]
        },
      },
      {
        path: CRUD_ROUTES.DETAILS,
        component: DetailDepreciationAdjustmentComponent,
        data: {
          array: [
            { permission: Permissions.DEPRECIATION_ADJUSTMENT_VIEW },
            { permission: Permissions.DEPRECIATION_ADJUSTMENT_CREATE },
            { permission: Permissions.DEPRECIATION_ADJUSTMENT_EDIT },
          ]
        },
      },
      {
        path: CRUD_ROUTES.PRINT,
        component: PrintDepreciationAdjustmentComponent,
        data: {
          array: [
            { permission: Permissions.DEPRECIATION_ADJUSTMENT_VIEW },
            { permission: Permissions.DEPRECIATION_ADJUSTMENT_CREATE },
            { permission: Permissions.DEPRECIATION_ADJUSTMENT_EDIT },
          ]
        },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepreciationAdjustmentRoutingModule { }
