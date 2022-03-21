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
import { GrnService } from './service/grn.service';
import { CreateGrnComponent } from './create-grn/create-grn.component';


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
    AgGridModule.withComponents([CustomTooltipComponent])
  ],
  providers:[GrnService]
})
export class GoodsReceivedNoteModule { }
