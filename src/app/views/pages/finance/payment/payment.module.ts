import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
import { PaymentInvoiceComponent } from './print-payment/payment-invoice.component';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { ListPaymentComponent } from './list-payment/list-payment.component';
import { AgGridModule } from 'ag-grid-angular';
import { DetailPaymentComponent } from './detail-payment/detail-payment.component';
import { CommonModule } from '@angular/common';
import { PaymentRoutingModule } from './payment-routing.module';


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
    AgGridModule
  ]
})
export class PaymentModule { }
