import { NgModule} from '@angular/core';
import { AgGridModule} from 'ag-grid-angular';
import { PartialsModule} from 'src/app/views/partials/partials.module';
import { SharedModule} from 'src/app/views/shared/modules/shared.module';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { ListStockComponent } from './list-stock/list-stock.component';
import { StockRoutingModule } from './stock-routing.module';
import { StockService } from './service/stock.service';


@NgModule({
  declarations: [
   ListStockComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    StockRoutingModule, 
    AgGridModule.withComponents([CustomTooltipComponent])
  ],
  providers:[StockService]
})
export class StockModule { }
