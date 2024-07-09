import { NgModule} from '@angular/core';
import { AgGridModule} from 'ag-grid-angular';
import { PartialsModule} from 'src/app/views/partials/partials.module';
import { SharedModule} from 'src/app/views/shared/modules/shared.module';
import { ListStockComponent } from './list-stock/list-stock.component';
import { StockRoutingModule } from './stock-routing.module';


@NgModule({
  declarations: [
   ListStockComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    StockRoutingModule, 
    AgGridModule
  ]
})
export class StockModule { }
