import { NgModule } from '@angular/core';
import { ListGoodsReturnNoteComponent } from './list-goods-return-note/list-goods-return-note.component';
import { CreateGoodsReturnNoteComponent } from './create-goods-return-note/create-goods-return-note.component';
import { GoodsReturnNoteDetailComponent } from './goods-return-note-detail/goods-return-note-detail.component';
import { PrintGoodsReturnNoteComponent } from './print-goods-return-note/print-goods-return-note.component';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { GoodsReturnNoteRoutingModule } from './goods-return-note-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';



@NgModule({
  declarations: [
    ListGoodsReturnNoteComponent, 
    CreateGoodsReturnNoteComponent, 
    GoodsReturnNoteDetailComponent, 
    PrintGoodsReturnNoteComponent
  ],
  imports: [
    PartialsModule,
    SharedModule,
    GoodsReturnNoteRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ]
})
export class GoodsReturnNoteModule { }
