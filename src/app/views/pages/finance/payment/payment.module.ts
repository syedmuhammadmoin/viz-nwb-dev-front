import { CreateBusinessPartnerComponent } from 'src/app/views/pages/profiling/business-partner/create-business-partner/create-business-partner.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
import { PaymentService } from './service/payment.service';
import { PaymentInvoiceComponent } from './print-payment/payment-invoice.component';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { ListPaymentComponent } from './list-payment/list-payment.component';
import { AgGridModule } from 'ag-grid-angular';
import { DetailPaymentComponent } from './detail-payment/detail-payment.component';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CommonModule } from '@angular/common';
import { PaymentRoutingModule } from './payment-routing.module';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';


@NgModule({
  declarations: [
    CreatePaymentComponent,
    PaymentInvoiceComponent, 
    ListPaymentComponent, 
    DetailPaymentComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PartialsModule,
    PaymentRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ],
  entryComponents: [
    CreatePaymentComponent, 
    CreateBusinessPartnerComponent, 
    CustomRemarksComponent
  ],
})
export class PaymentModule { }
