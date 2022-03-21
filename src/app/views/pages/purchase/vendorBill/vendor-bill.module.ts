import { NgModule} from '@angular/core';
import { CreateVendorBillComponent} from './create-vendor-bill/create-vendor-bill.component';
import { ListVendorBillComponent} from './list-vendor-bill/list-vendor-bill.component';
import { SharedModule} from '../../../shared/modules/shared.module';
import { PartialsModule} from '../../../partials/partials.module';
import { AgGridModule} from 'ag-grid-angular';
import { VendorBillDetailComponent} from './vendor-bill-detail/vendor-bill-detail.component';
import { PrintBillComponent} from './print-bill/print-bill.component';
import { ServiceProxyModule } from "../../../shared/modules/service-proxy/service-proxy.module";
import { AgingReportComponent } from './aging-report/aging-report.component';
import { RegisterPaymentComponent } from '../../sales/invoice/register-payment/register-payment.component';
import { VendorBillRoutingModule } from './vendor-bill-routing.module';
import { ProductService } from '../../profiling/product/service/product.service';
import { LocationService } from '../../profiling/location/service/location.service';
import { BusinessPartnerService } from '../../profiling/business-partner/service/businessPartner.service';
import { CategoryService } from '../../profiling/category/service/category.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { DepartmentService } from '../../profiling/department/service/department.service';
import { WarehouseService } from '../../profiling/warehouse/services/warehouse.service';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';




@NgModule({
  declarations: [
    CreateVendorBillComponent,
    ListVendorBillComponent,
    VendorBillDetailComponent,
    PrintBillComponent,
    AgingReportComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    ServiceProxyModule,
    VendorBillRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ],

  entryComponents: [
    RegisterPaymentComponent,
  ]
})
export class VendorBillModule { }
