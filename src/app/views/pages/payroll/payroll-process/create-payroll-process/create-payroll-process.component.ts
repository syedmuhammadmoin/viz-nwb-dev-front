import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { PayrollProcessService} from '../service/payroll-process.service';
import { FirstDataRenderedEvent, GridOptions} from 'ag-grid-community';
import { MatDialog} from "@angular/material/dialog";
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { CreatePayrollTransactionComponent } from '../../payroll-transaction/create-payroll-transaction/create-payroll-transaction.component';
import { DepartmentState } from '../../department/store/department.store';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { isEmpty } from 'lodash';

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
  tooltipData = 'double click to edit'

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
      headerName: 'Transaction Date',
      field: 'transDate',
      suppressMenu: true,
      cellRenderer: (params) => {
        return this.dateHelperService.transformDate(params.value, 'MMM d, y');
      }
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
      headerName: 'Department',
      field: 'department',
      suppressMenu: true,

    },

    {
      headerName: 'Working Days',
      // editable: true,
      field: 'workingDays',
      tooltipField: 'workingDays',
      suppressMenu: true,
    },
    {
      headerName: 'Present Days',
      // editable: true,
      field: 'presentDays',
      tooltipField: 'presentDays',
      suppressMenu: true,
    },
    /*    {
          headerName: 'Tax',
          // editable: true,
          field: 'tax',
          tooltipField: 'tax'
        },*/
    {
      headerName: 'Net Salary',
      field: 'netSalary',
      suppressMenu: true,
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      suppressMenu: true,
    },
  ];

  formErrors = {
    departmentId: '',
    accountPayableId: '',
    month: '',
    year: ''
  };
  validationMessages = {
    departmentId: {
      required: 'Department is required'
    },
    accountPayableId: {
      required: 'Account Payable is required'
    },
    month: {
      required: 'Month is required'
    },
    year: {
      required: 'Year is required'
    }
  };
  employeeList: any[] = [];
  employeeGridApi: any;
  frameworkComponents: any;
  gridOptions: any;
  defaultColDef: any;

  religionList = [
    { id: 0, value: 'Islam' },
    { id: 1, value: 'Christian' },
    { id: 2, value: 'Hinduism' },
  ]

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
      religion: [''],
      month: ['', Validators.required],
      year: ['', Validators.required],
    })

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }
    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    this.getLatestDepartments();
    this.ngxsService.getAccountPayableFromState();
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
      accountPayableId: this.createPayrollProcessForm.value.accountPayableId,
      month: this.createPayrollProcessForm.value.month,
      year: this.createPayrollProcessForm.value.year,
    }

    console.log(body)

    this.payrollProcessService.createPayrollProcess(body)
      .subscribe((res) => {
        this.employeeList = res.result;
        if (isEmpty(res.result)) {
          this.toastService.info('No Records Found !' , 'Payroll Process')
        }
        console.log(res.result)
        this.isLoading = false;
        this.cdRef.detectChanges();
      }, (err) => {
        this.isLoading = false;
        this.cdRef.detectChanges();
        console.log(err)
        //this.toastService.error(`${err.error.message || 'Something went wrong!'}`, 'Error!')
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
      this.toastService.error('Atleast 1 employee is required', 'Employee is Required')
      return
    }

    console.log(this.employeeGridApi.getSelectedRows());
    this.isLoading = true;

    // Selected Employees
    const selectedEmployeeList = this.employeeGridApi.getSelectedRows();

    // Employee List to post
    const employeeListToPost = this.mapValuesToModel(selectedEmployeeList);
    console.log('post: ', employeeListToPost);

    // API Call
    this.payrollProcessService.submitPayrollProcess(employeeListToPost).subscribe((res) => {
      this.isLoading = false;
      this.toastService.success(res.message, 'Created Successfully!');
      this.cdRef.detectChanges();
      this.resetForm();
    }, (error) => {
      this.isLoading = false;
      this.cdRef.detectChanges();
      console.log(error)
      this.toastService.error(`${error.error.message || 'Something went wrong!'}`, 'Error!')
    })
  }

  mapValuesToModel(listToMap: any): [] {
    // Traverse through selected employee list
    return listToMap.map(x => {
      return x.id
      // return {id: x.id, netSalary: x.netSalary}
    })
  }

  resetForm() {
    this.formDirective.resetForm();
    this.employeeList = []
  }

  editPayrollTransaction(event: any) {
    const dialogRef = this.dialog.open(CreatePayrollTransactionComponent, {
      width: '860px',
      height: '700px',
      data: event?.data?.id,
      //panelClass: 'custom-modalbox'
    });
    // Recalling getBankAccounts function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.createProcess();
    });
  }

  getLatestDepartments(){
    this.ngxsService.store.dispatch(new IsReloadRequired(DepartmentState , true))
  }
}



