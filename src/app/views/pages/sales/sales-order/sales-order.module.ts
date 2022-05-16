import { NgModule} from '@angular/core';
import { CommonModule} from '@angular/common';
import { AgGridModule} from 'ag-grid-angular';
import { PartialsModule} from 'src/app/views/partials/partials.module';
import { SharedModule} from 'src/app/views/shared/modules/shared.module';
import { ListSaleOrderComponent} from './list-sale-order/list-sale-order.component';
import { SalesOrderDetailComponent} from './sales-order-detail/sales-order-detail.component';
import { PrintSalesOrderComponent} from './print-sales-order/print-sales-order/print-sales-order.component';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { SalesOrderRoutingModule } from './sales-order-routing.module';
import { CreateSalesOrderComponent } from './create-sales-order/create-sales-order.component';


@NgModule({
  declarations: [
    CreateSalesOrderComponent,
    ListSaleOrderComponent,
    SalesOrderDetailComponent,
    PrintSalesOrderComponent,
    CreateSalesOrderComponent
  ],
  imports: [
    CommonModule,
    PartialsModule,
    SharedModule,
    SalesOrderRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ],

})
export class SalesOrderModule { }
