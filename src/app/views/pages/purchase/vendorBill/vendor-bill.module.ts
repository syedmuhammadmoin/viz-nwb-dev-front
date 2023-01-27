import { NgModule} from '@angular/core';
import { CreateVendorBillComponent} from './create-vendor-bill/create-vendor-bill.component';
import { ListVendorBillComponent} from './list-vendor-bill/list-vendor-bill.component';
import { SharedModule} from '../../../shared/modules/shared.module';
import { PartialsModule} from '../../../partials/partials.module';
import { AgGridModule} from 'ag-grid-angular';
import { VendorBillDetailComponent} from './vendor-bill-detail/vendor-bill-detail.component';
import { PrintBillComponent} from './print-bill/print-bill.component';
import { AgingReportComponent } from './aging-report/aging-report.component';
import { RegisterPaymentComponent } from '../../sales/invoice/register-payment/register-payment.component';
import { VendorBillRoutingModule } from './vendor-bill-routing.module';
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
    VendorBillRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ],

  entryComponents: [RegisterPaymentComponent]
})
export class VendorBillModule { }
