import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeeItemRoutingModule } from './fee-item-routing.module';
import {ListFeeItemComponent} from './list-fee-item/list-fee-item.component';
import {CreateFeeItemComponent} from './create-fee-item/create-fee-item.component';
import {SharedModule} from '../../../shared/modules/shared.module';
import {PartialsModule} from '../../../partials/partials.module';
import {AgGridModule} from 'ag-grid-angular';


@NgModule({
  declarations: [
    ListFeeItemComponent,
    CreateFeeItemComponent
  ],
  imports: [
    CommonModule,
    FeeItemRoutingModule,
    SharedModule,
    PartialsModule,
    AgGridModule
  ]
})
export class FeeItemModule { }
