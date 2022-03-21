import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { ListPurchaseOrderComponent } from './list-purchase-order/list-purchase-order.component';
import { PurchaseOrderService } from './service/purchase-order.service';
import { PurchaseOrderDetailComponent } from './purchase-order-detail/purchase-order-detail.component';
import { PrintPurchaseOrderComponent } from './print-purchase-order/print-purchase-order.component';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import { ProductService } from '../../profiling/product/service/product.service';
import { LocationService } from '../../profiling/location/service/location.service';
import { BusinessPartnerService } from '../../profiling/business-partner/service/businessPartner.service';
import { CategoryService } from '../../profiling/category/service/category.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { DepartmentService } from '../../profiling/department/service/department.service';
import { WarehouseService } from '../../profiling/warehouse/services/warehouse.service';

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
    AgGridModule.withComponents([CustomTooltipComponent])
  ],
 
})
export class PurchaseOrderModule { }
