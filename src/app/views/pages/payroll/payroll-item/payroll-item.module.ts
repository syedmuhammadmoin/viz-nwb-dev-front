import { NgModule } from '@angular/core';
import { CreatePayrollItemComponent } from './create-payroll-item/create-payroll-item.component';
import { SharedModule } from 'src/app/views/shared/modules/shared.module';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { PayrollItemRoutingModule } from './payroll-item-routing.module';
import { AssignEmployeeComponent } from './assign-employee/assign-employee.component';
import { ActionButtonComponent } from 'src/app/views/shared/components/action-button/action-button.component';
import { ListPayrollItemComponent } from './list-payroll-item/list-payroll-item.component';


@NgModule({
  declarations: [CreatePayrollItemComponent, AssignEmployeeComponent, ListPayrollItemComponent],
  imports: [
    SharedModule,
    PartialsModule,
    PayrollItemRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent])
  ],
  providers: [],
  entryComponents: [AssignEmployeeComponent, ActionButtonComponent]
})
export class PayrollItemModule { }
