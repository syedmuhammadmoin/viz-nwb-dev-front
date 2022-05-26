import { NgModule } from '@angular/core';
import { PayrollTransReportComponent } from './payroll-trans-report/payroll-trans-report.component';
import { PayrollReportsRoutingModule } from './payroll-reports-routing.module';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';


@NgModule({
  declarations: [PayrollTransReportComponent],
  imports: [
    SharedModule,
    PartialsModule,
    PayrollReportsRoutingModule,
    // AgGridModule.withComponents([CustomTooltipComponent])
    AgGridModule
  ]
})
export class PayrollReportsModule { }
