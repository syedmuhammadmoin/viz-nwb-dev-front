import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { ListGrnComponent } from './list-grn/list-grn.component';
import { GrnDetailComponent } from './grn-detail/grn-detail.component';
import { PrintGrnComponent } from './print-grn/print-grn.component';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { GoodsReceivedNoteRoutingModule } from './goods-received-note-routing.module';
import { CreateGrnComponent } from './create-grn/create-grn.component';
import {AgGridButtonCellRendrerComponent} from '../../../shared/components/ag-grid-button-cell-rendrer/ag-grid-button-cell-rendrer.component';
import {CreateAssetComponent} from '../../fixed-asset/asset/create-asset/create-asset.component';


@NgModule({
  declarations: [
    ListGrnComponent,
    GrnDetailComponent,
    PrintGrnComponent,
    CreateGrnComponent
  ],
  imports: [
    CommonModule,
    PartialsModule,
    SharedModule,
    GoodsReceivedNoteRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent, AgGridButtonCellRendrerComponent])
  ],
  entryComponents: [
    CreateAssetComponent
  ]
})
export class GoodsReceivedNoteModule { }
