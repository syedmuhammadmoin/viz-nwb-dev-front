import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { AppComponentBase} from '../../../../shared/app-component-base';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { finalize} from 'rxjs/operators';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { isEmpty} from 'lodash';
import { APP_ROUTES, PAYROLL_REPORT, REPORT } from 'src/app/views/shared/AppRoutes';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { PayrollReportsService } from '../service/payroll-reports.service';
import { AppConst } from 'src/app/views/shared/AppConst';

function sumFunc(params) {
  // let sum = 0;
  if (params && params.values) {
    this.balance = params?.values[params?.values?.length - 1]
  }
  return this.balance;
}



@Component({
  selector: 'kt-payroll-executive-report',
  templateUrl: './payroll-executive-report.component.html',
  styleUrls: ['./payroll-executive-report.component.scss']
})

export class PayrollExecutiveReportComponent extends AppComponentBase implements OnInit {
  // for permissions
  public permissions = Permissions;

  // app const for month
  months = AppConst.Months

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  constructor(
    // Injecting services in constructor
    private fb: FormBuilder,
    private payrollReportService: PayrollReportsService,
    private cdRef: ChangeDetectorRef,
    public addButtonService: AddModalButtonService,
    public ngxsService: NgxsCustomService,
    private injector: Injector
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'COA',
        field: 'accountName',
        cellStyle: {textAlign : 'left'}
      },
      {
        headerName: 'Payroll Item Type',
        field: 'payrollType',
        cellStyle: {textAlign : 'left'},
        valueFormatter: (params: any) => {
          return AppConst.PayrollType[params.value].value
        }
      },
      {
        headerName: 'Amount',
        field: 'amount',
        headerClass: 'custom_left',
        suppressHeaderMenuButton: true,
        valueFormatter: (params: any) => {
          return this.valueFormatter(params.value)
        }
      }
    ];
  }

  // gridOptions: any;;

  autoGroupColumnDef;
  openingBalance = 0;
  balance = 0;
  columnDefs;
  defaultColDef: any

  // data for PDF
  recordsData: any = []
  disability = true

  //Busy Loading
  isLoading: boolean;

  //Limit Date
  maxDate : Date = new Date()

  // Declaring FormGroup
  payrollExecutiveForm: FormGroup;

  // For AG Grid..
  gridOptions: any;;
  rowData: any[] = [];

  // Declaring Model
  // Initializing payrollExecutive model...
  payrollExecutiveModel: any = {};
  // Validation Messages
  validationMessages = {
    year: {
      required: 'Year is required.'
    }
  }

  // Error keys for validation messages
  formErrors: any = {
    year: ''
  }

  ngOnInit() {
    // AG Grid Options
    this.gridOptions = ({} as GridOptions);
    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      filter: true,
      sortable: false,
      resizable: true,
      menuTabs: ["filterMenuTab"],
    };

    //Initializing Form Group
    this.payrollExecutiveForm = this.fb.group({
      campusId: [null],
      accountId: [null],
      month: [null],
      year: ['' ,[Validators.required]]
    });

    //Get Data from Store
    this.ngxsService.getCampusFromState();
    this.ngxsService.getOtherAccountsFromState();
  }

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  onSubmit() {
    if (this.payrollExecutiveForm.invalid) {
      this.logValidationErrors(this.payrollExecutiveForm, this.formErrors, this.validationMessages);
      return;
    }
    this.mapFormValueToModel();
    console.log(this.payrollExecutiveModel);
    this.isLoading = true;
    this.payrollReportService.getExecutiveSummary(this.payrollExecutiveModel).pipe(
      finalize(() => {
        this.columnDefs = [
          {
            headerName: 'COA',
            field: 'accountName',
            cellStyle: {textAlign : 'left'}
          },
          {
            headerName: 'Payroll Item Type',
            field: 'payrollType',
            cellStyle: {textAlign : 'left'},
            valueFormatter: (params: any) => {
              return AppConst.PayrollType[params.value].value
            }
          },
          {
            headerName: 'Amount',
            field: 'amount',
            suppressHeaderMenuButton: true,
            headerClass: 'custom_left',
            valueFormatter: (params: any) => {
              return this.valueFormatter(params.value)
            }
          }
        ];
        this.isLoading = false;
        this.cdRef.detectChanges();
      })
    ).subscribe((res) => {
      this.rowData = res.result.payrollItems;
      this.recordsData = res.result;
      // for PDF
      this.disability = (!isEmpty(res.result.payrollItems)) ? false : true;
      if (isEmpty(res.result.payrollItems)) {
        this.toastService.info('No Records Found !' , 'Payroll Executive Summary')
      }
    });
  }

  reset() {
    this.formDirective.resetForm();
    this.recordsData = [];
    this.rowData = [];
    this.isLoading = false;
    // for PDF
    this.disability = true;
  }

  // Mapping value from form to model
  mapFormValueToModel() {
    this.payrollExecutiveModel.campusId = this.payrollExecutiveForm.value.campusId?.id || null;
    this.payrollExecutiveModel.accountId = this.payrollExecutiveForm.value.accountId || null;
    this.payrollExecutiveModel.month = this.payrollExecutiveForm.value.month || [];
    this.payrollExecutiveModel.year = this.payrollExecutiveForm.value.year || '';
  }

  printPayrollExecutive() {
    this.payrollReportService.setExecutiveDataForPrintComponent(this.recordsData);

      this.router.navigate(['/' + APP_ROUTES.PAYROLL_REPORTS + '/' + PAYROLL_REPORT.EXECUTIVE + '/' + REPORT.PRINT], {
        queryParams: {
          campus: (this.payrollExecutiveForm.value.campusId?.name),
          months: JSON.stringify(this.payrollExecutiveForm.value.month),
          year: (this.payrollExecutiveForm.value.year),
        }
      })
  }
}
