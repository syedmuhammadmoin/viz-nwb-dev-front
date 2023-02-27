import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DepreciationAdjustmentRoutingModule} from './depreciation-adjustment-routing.module';
import {ListDepreciationAdjustmentComponent} from './list-depreciation-adjustment/list-depreciation-adjustment.component';
import {CreateDepreciationAdjustmentComponent} from './create-depreciation-adjustment/create-depreciation-adjustment.component';
import {DetailDepreciationAdjustmentComponent} from './detail-depreciation-adjustment/detail-depreciation-adjustment.component';
import {PrintDepreciationAdjustmentComponent} from './print-depreciation-adjustment/print-depreciation-adjustment.component';
import {SharedModule} from '../../../shared/modules/shared.module';
import {PartialsModule} from '../../../partials/partials.module';
import {AgGridModule} from 'ag-grid-angular';


@NgModule({
  declarations: [
    ListDepreciationAdjustmentComponent,
    CreateDepreciationAdjustmentComponent,
    DetailDepreciationAdjustmentComponent,
    PrintDepreciationAdjustmentComponent
  ],
  imports: [
    CommonModule,
    DepreciationAdjustmentRoutingModule,
    SharedModule,
    PartialsModule,
    AgGridModule
  ]
})
export class DepreciationAdjustmentModule {
}
