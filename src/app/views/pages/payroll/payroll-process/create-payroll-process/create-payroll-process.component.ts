import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { PayrollProcessService} from '../service/payroll-process.service';
import { FirstDataRenderedEvent, GridOptions} from 'ag-grid-community';
import { MatDialog} from "@angular/material/dialog";
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { isEmpty } from 'lodash';
import { finalize, take } from 'rxjs/operators';
import { CampusState } from '../../../profiling/campus/store/campus.state';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-create-payroll-process',
  templateUrl: './create-payroll-process.component.html',
  styleUrls: ['./create-payroll-process.component.scss']
})

export class CreatePayrollProcessComponent extends AppComponentBase implements OnInit {

  isLoading = false;
  months = AppConst.Months
  overlayLoadingTemplate;
  permissions = Permissions
  createPayrollProcessForm: FormGroup;

  columnDefs = [
    {
      headerName: 'Employee Name',
      field: 'employee',
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      suppressMenu: true,
    },
    {
      headerName: 'CNIC', field: 'cnic',
      suppressMenu: true,
    },
    {
      headerName: 'Designation', field: 'designation',
      suppressMenu: true,
    },
    {
      headerName: 'Campus',
      field: 'campus',
      suppressMenu: true
    },
    {
      headerName: 'Department',
      field: 'department',
      suppressMenu: true
    },
    {
      headerName: 'Differential Allowance',
      field: 'differential Allowance',
      suppressMenu: true,
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Income from Transport / Buses ',
      field: 'income from Transport / Buses',
      suppressMenu: true,
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Employee Income Tax',
      field: 'employee Income Tax',
      suppressMenu: true,
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Adhoc Relief Allowance 2022',
      field: 'adhoc Relief Allowance 2022',
      suppressMenu: true,
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Computer Allowance',
      field: 'computer Allowance',
      suppressMenu: true,
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Telecommunication Allowance',
      field: 'telecommunication (Telephone) Allowance',
      suppressMenu: true,
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'House Rent Allowance',
      field: 'house Rent Allowance',
      suppressMenu: true,
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Conveyance Allowance',
      field: 'conveyance Allowance',
      suppressMenu: true,
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Medical Allowance',
      field: 'medical Allowance',
      suppressMenu: true,
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Qualification/PHD/Special S&T Allowance',
      field: 'qualification/PhD/Special S&T Allowance',
      suppressMenu: true,
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Entertainment Allowance',
      field: 'entertainment Allowance',
      suppressMenu: true,
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Charge - Deanship/Chairmanship Allowance',
      field: 'charge Allowance  - Deanship / Chairmanship/Headship Allowance',
      suppressMenu: true,
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Transportation Income From Employees',
      field: 'transportation Income from Employees ',
      suppressMenu: true,
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    
  ];

  formErrors = {
    departmentId: '',
    campusId: '',
    accountPayableId: '',
    month: '',
    year: ''
  };
  validationMessages = {
    departmentId: {
      required: 'Department is required.'
    },
    campusId: {
      required: 'Campus is required.'
    },
    accountPayableId: {
      required: 'Account Payable is required.'
    },
    month: {
      required: 'Month is required.'
    },
    year: {
      required: 'Year is required.'
    }
  };
  employeeList: any[] = [];
  employeeGridApi: any;
  frameworkComponents: any;
  gridOptions: any;
  defaultColDef: any;
  departmentsList: any = new BehaviorSubject<any>([])

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    public ngxsService: NgxsCustomService,
    private payrollProcessService: PayrollProcessService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">Please wait while your data is loading</span>';

    this.gridOptions = ((
      {
        context: {componentParent: this}
      }

    ) as GridOptions);
  }

  ngOnInit(): void {
    this.createPayrollProcessForm = this.fb.group({
      departmentId: ['', Validators.required],
      accountPayableId: ['', Validators.required],
      campusId: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
    })


    this.getLatestCampuses();
    this.ngxsService.getAccountPayableFromState();
    this.ngxsService.getCampusFromState();
    this.ngxsService.getDepartmentFromState();
  }

  createProcess() {
    if (this.createPayrollProcessForm.invalid) {
      this.logValidationErrors(this.createPayrollProcessForm, this.formErrors, this.validationMessages)
      return;
    }
    this.isLoading = true;
    const body = {
      departmentId: this.createPayrollProcessForm.value.departmentId ,
      campusId : this.createPayrollProcessForm.value.campusId,
      accountPayableId: this.createPayrollProcessForm.value.accountPayableId,
      month: this.createPayrollProcessForm.value.month,
      year: this.createPayrollProcessForm.value.year,
    }

    this.payrollProcessService.createPayrollProcess(body)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res) => {
        this.employeeList = res.result;
        if (isEmpty(res.result)) {
          this.toastService.info('No Records Found !' , 'Payroll Process')
        }
        this.cdRef.detectChanges();
      });
  }

  onEmployeeRowClicked($event: any) {
    console.log($event)
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    //params.api.sizeColumnsToFit();
  }

  onGridReady(params) {
    this.employeeGridApi = params.api;
  }

  submitProcess() {
    if (this.createPayrollProcessForm.invalid) {
      this.logValidationErrors(this.createPayrollProcessForm, this.formErrors, this.validationMessages)
      return;
    }
    
    if (this.employeeGridApi.getSelectedRows().length < 1) {
      this.toastService.error('Atleast 1 employee is required.', 'Employee is required.')
      return
    }

    this.isLoading = true;

    // Selected Employees
    const selectedEmployeeList = this.employeeGridApi.getSelectedRows();

    // Employee List to post
    const employeeListToPost = this.mapValuesToModel(selectedEmployeeList);

    // API Call
    this.payrollProcessService.submitPayrollProcess(employeeListToPost)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      this.toastService.success(res.message, 'Created Successfully!');
      this.cdRef.detectChanges();
      this.resetForm();
    })
  }

  mapValuesToModel(listToMap: any): [] {
    // Traverse through selected employee list
    return listToMap.map(x => {
      return x.id
    })
  }

  resetForm() {
    this.formDirective.resetForm();
    this.employeeList = []
    this.cdRef.detectChanges()
  }

  onCampusSelected(campusId : number) {
    this.ngxsService.departmentService.getDepartmentByCampusId(campusId).subscribe(res => {
      this.departmentsList.next(res.result || [])
    })
     this.createPayrollProcessForm.get('departmentId').setValue(null)
     this.cdRef.detectChanges()
  }

  checkCampus(){
    if(this.createPayrollProcessForm.value.campusId === '') {
      this.toastService.info("Please Select Campus First!", "Payroll Process")
    }
  }

  getLatestCampuses(){
    this.ngxsService.store.dispatch(new IsReloadRequired(CampusState , true))
  }
}



