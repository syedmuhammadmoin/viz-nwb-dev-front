import { NgModule } from '@angular/core';
import { CreatePayrollProcessComponent } from './create-payroll-process/create-payroll-process.component';
import { ApprovePayrollProcessComponent } from './approve-payroll-process/approve-payroll-process.component';
import { ApprovePaymentProcessComponent } from './register-payment-process/approve-payment-process/approve-payment-process.component';
import { CreatePaymentComponent } from './register-payment-process/create-payment-process/create-payment/create-payment.component';
import { SubmitPaymentComponent } from './register-payment-process/create-payment-process/submit-payment/submit-payment.component';
import { PaymentProcessComponent } from './register-payment-process/create-payment-process/payment-process/payment-process.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { AgGridModule } from 'ag-grid-angular';
import { PayrollProcessRoutingModule } from './payroll-process-routing.module';



@NgModule({
  declarations: [
    CreatePayrollProcessComponent, 
    ApprovePayrollProcessComponent, 
    ApprovePaymentProcessComponent, 
    CreatePaymentComponent, 
    SubmitPaymentComponent, 
    PaymentProcessComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    PayrollProcessRoutingModule,
    AgGridModule
  ]
})
export class PayrollProcessModule { }
