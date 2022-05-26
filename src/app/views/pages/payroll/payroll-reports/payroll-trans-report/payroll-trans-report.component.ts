import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { PayrollTransactionService } from '../../payroll-transaction/service/payroll-transaction.service';
import { GridApi, GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DesignationService } from '../../designation/service/designation.service';
import { CampusService } from '../../../profiling/campus/service/campus.service';
import { PayrollItemService } from '../../payroll-item/service/payroll-item.service';
import { finalize } from 'rxjs/operators';
import { isEmpty} from 'lodash';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { EmployeeService } from '../../employee/service/employee.service';
import { DepartmentService } from '../../department/service/department.service';

@Component({
  selector: 'kt-payroll-trans-report',
  templateUrl: './payroll-trans-report.component.html',
  styleUrls: ['./payroll-trans-report.component.scss']
})

export class PayrollTransReportComponent extends AppComponentBase implements OnInit {

  constructor(injector: Injector) { super(injector)}

  ngOnInit(): void {
    
  }


}
