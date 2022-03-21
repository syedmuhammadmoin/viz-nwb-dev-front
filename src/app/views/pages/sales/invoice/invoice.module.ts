import { PaymentService } from '../../finance/payment/service/payment.service';
import { NgModule } from '@angular/core';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { ListInvoiceComponent } from './list-invoice/list-invoice.component';
import { AgGridModule } from 'ag-grid-angular';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { RegisterPaymentComponent } from './register-payment/register-payment.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import { AgingReportComponent } from './aging-report/aging-report.component';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { ProductService } from '../../profiling/product/service/product.service';
import { LocationService } from '../../profiling/location/service/location.service';
import { BusinessPartnerService } from '../../profiling/business-partner/service/businessPartner.service';
import { CategoryService } from '../../profiling/category/service/category.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { DepartmentService } from '../../profiling/department/service/department.service';
import { WarehouseService } from '../../profiling/warehouse/services/warehouse.service';
import { SaleOrderService } from '../sales-order/service/sale-order.service';



@NgModule({
  declarations: [
    CreateInvoiceComponent,
    ListInvoiceComponent,
    InvoiceDetailsComponent,
    RegisterPaymentComponent,
    PrintInvoiceComponent,
    AgingReportComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    InvoiceRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ],
  entryComponents: [
    RegisterPaymentComponent
  ],
 
})
export class InvoiceModule { }