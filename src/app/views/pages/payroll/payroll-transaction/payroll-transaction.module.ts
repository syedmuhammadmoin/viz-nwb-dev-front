import { NgModule } from '@angular/core';
import { ListPayrollTransactionComponent } from './list-payroll-transaction/list-payroll-transaction.component';
import { CreatePayrollTransactionComponent } from './create-payroll-transaction/create-payroll-transaction.component';
import { PayrollTransactionDetailComponent } from './payroll-transaction-detail/payroll-transaction-detail.component';
import { PrintPayrollTransactionComponent } from './print-payroll-transaction/print-payroll-transaction.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { PayrollTransactionRoutingModule } from './payroll-transaction-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { MatDialogRef } from '@angular/material/dialog';


@NgModule({
  declarations: [
    ListPayrollTransactionComponent, 
    CreatePayrollTransactionComponent, 
    PayrollTransactionDetailComponent, 
    PrintPayrollTransactionComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    PayrollTransactionRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ],
  providers: []
})
export class PayrollTransactionModule { }


