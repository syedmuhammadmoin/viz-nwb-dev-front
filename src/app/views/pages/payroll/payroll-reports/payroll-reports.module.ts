import { NgModule } from '@angular/core';
import { PayrollTransReportComponent } from './payroll-trans-report/payroll-trans-report.component';
import { PayrollReportsRoutingModule } from './payroll-reports-routing.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { AgGridModule } from 'ag-grid-angular';
import { PayrollExecutiveReportComponent } from './payroll-executive-report/payroll-executive-report.component';
import { PrintExecutiveReportComponent } from './print-executive-report/print-executive-report.component';
import { BankAdviceReportComponent } from './bank-advice-report/bank-advice-report.component';
import { PrintBankAdviceComponent } from './print-bank-advice/print-bank-advice.component';
import { PayrollTransDetailReportComponent } from './payroll-trans-detail-report/payroll-trans-detail-report.component';


@NgModule({
  declarations: [
    PayrollTransDetailReportComponent,
    PayrollTransReportComponent, 
    PayrollExecutiveReportComponent, 
    PrintExecutiveReportComponent, 
    BankAdviceReportComponent,
    PrintBankAdviceComponent
  ],
  imports: [
    SharedModule,
    PartialsModule,
    PayrollReportsRoutingModule,
    AgGridModule
  ]
})
export class PayrollReportsModule { }
