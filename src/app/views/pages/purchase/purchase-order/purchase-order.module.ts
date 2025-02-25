import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { ListPurchaseOrderComponent } from './list-purchase-order/list-purchase-order.component';
import { PurchaseOrderDetailComponent } from './purchase-order-detail/purchase-order-detail.component';
import { PrintPurchaseOrderComponent } from './print-purchase-order/print-purchase-order.component';
import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';

@NgModule({
  declarations: [
  
    ListPurchaseOrderComponent,
    PurchaseOrderDetailComponent,
    PrintPurchaseOrderComponent,
    CreatePurchaseOrderComponent
  ],
  imports: [
    CommonModule,
    PartialsModule,
    SharedModule,
    PurchaseOrderRoutingModule,
    AgGridModule
  ]
})
export class PurchaseOrderModule { }
