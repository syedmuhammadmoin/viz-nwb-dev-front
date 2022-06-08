import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { AppComponentBase} from '../../../../shared/app-component-base';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { ColDef, GridOptions, ICellRendererParams, ValueFormatterParams} from 'ag-grid-community';
import { finalize} from 'rxjs/operators';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { isEmpty} from 'lodash';
import { BudgetService } from '../service/budget.service';
import { IBudgetReport } from '../model/IBudgetReport';
import { DateHelperService } from 'src/app/views/shared/helpers/date-helper';

@Component({
  selector: 'kt-budget-report',
  templateUrl: './budget-report.component.html',
  styleUrls: ['./budget-report.component.scss']
})

export class BudgetReportComponent extends AppComponentBase implements OnInit {

  // for permissions 
  public permissions = Permissions;

  // gridOptions: GridOptions;

  defaultColDef: ColDef
  // data for PDF
  recordsData: any = []
  disability = true

  //Busy Loading
  isLoading: boolean;
  
  // Declaring FormGroup
  budgetReportForm: FormGroup;

  // For AG Grid..
  gridOptions: GridOptions;
  rowData: IBudgetReport[] = [];

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Declaring Model
  // Initializing budgetReport model...
  budgetReportModel: IBudgetReport = {} as IBudgetReport
  // Validation Messages
  validationMessages = {
    budgetName: {
      required: 'Budget is required.'
    },
    to: {
      required: 'Date is required.'
    }
  }

  // Error keys for validation messages
  formErrors = {
    budgetName: '',
    to: ''
  }

  constructor(
    // Injecting services in constructor
    private fb: FormBuilder,   
    private _budgetService: BudgetService,
    private cdRef: ChangeDetectorRef,   
    public ngxsService: NgxsCustomService,
    public dateHelperService: DateHelperService,
    injector: Injector
  ) {
    super(injector);
  }

  columnDefs = [
    {headerName: 'Budget Name', field: 'budgetName', suppressMenu: true},
    {
      headerName: 'Date', 
      field: 'to',
      suppressMenu: true,
      cellRenderer: (params: ICellRendererParams) => {
        return this.dateHelperService.transformDate(params.data.to, 'MMM d, y')
      }
    },
    {headerName: 'Account', field: 'account', suppressMenu: true},
    {
      headerName: 'Budget Amount', 
      field: 'budgetAmount',
      suppressMenu: true,
      valueFormatter: (params: ValueFormatterParams ) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Incurred Amount', 
      field: 'incurredAmount',
      suppressMenu: true,
      valueFormatter: (params: ValueFormatterParams ) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Balance', 
      field: 'balanceRemaining',
      suppressMenu: true,
      valueFormatter: (params: ValueFormatterParams ) => {
        return this.valueFormatter(params.value)
      }
    },
  ];


  ngOnInit() {
    // AG Grid Options
    this.gridOptions = ({} as GridOptions);
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      resizable: true,
      cellStyle: {textAlign : 'left'},
    }

    // initializing formGroup
    this.budgetReportForm = this.fb.group({
      budgetName: ['', [Validators.required]],
      to: ['', [Validators.required]],
    });

    //get Budgets from state
    this.ngxsService.getBudgetsFromState()
  }

  onSubmit() {
    if (this.budgetReportForm.invalid) {
      this.logValidationErrors(this.budgetReportForm, this.formErrors, this.validationMessages);
      return;
    }
    this.mapFormValueToModel();
    console.log(this.budgetReportModel);
    this.isLoading = true;
    this._budgetService.getBudgetReport(this.budgetReportModel).subscribe((res) => {
      this.rowData = res.result;
      this.recordsData = res.result;
      // for PDF
      (!isEmpty(res.result)) ? this.disability = false : this.disability = true;
      if (isEmpty(res.result)) {
        this.toastService.info('No Records Found !' , 'Budget Report')
      }
      this.isLoading = false;
      this.cdRef.detectChanges();
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
    this.budgetReportModel.to = this.formatDate(this.budgetReportForm.value.to) || '';
    this.budgetReportModel.budgetName = this.budgetReportForm.value.budgetName || '';
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  // PDF Content
  contentData() {
    // const data = [
    //   {
    //     text: 'VIZALYS',
    //     bold: true,
    //     fontSize: 10,
    //     alignment: 'center',
    //     // color: 'lightblue',
    //     margin: [0, 35, 0, 10]
    //   },
    //   {
    //     text: 'GENERAL LEDGER REPORT',
    //     bold: true,
    //     decoration: 'underline',
    //     fontSize: 20,
    //     alignment: 'center',
    //     // color: 'green',
    //     margin: [0, 5, 0, 10]
    //   },
    //   {
    //     text: 'Report for : ' + this.transformDate(this.budgetReportForm.value.to, 'MMM d, y') + ' - ' + this.transformDate(this.budgetReportForm.value.to2, 'MMM d, y'),
    //     alignment: 'center',
    //     fontSize: 12,
    //     margin: [0, 0, 0, 10]
    //   },
    //   {
    //     text: 'Business Partner : ' + (this.budgetReportForm.value.businessPartnerName || 'N/A'),
    //     fontSize: 10,
    //   },
    //   {
    //     text: 'Account : ' + (this.budgetReportForm.value.accountName || 'N/A'),
    //     fontSize: 10,
    //   },
    //   {
    //     text: 'Department : ' + (this.budgetReportForm.value.department || 'N/A'),
    //     fontSize: 10,
    //   },
    //   {
    //     text: 'Location : ' + (this.budgetReportForm.value.location || 'N/A'),
    //     fontSize: 10,
    //   },
    //   {
    //     text: 'Warehouse : ' + (this.budgetReportForm.value.warehouse || 'N/A'),
    //     fontSize: 10,
    //     margin: [0, 0, 0, 30]
    //   },
    //   {
    //     table: {
    //       widths: [70, 180, 180, 70, 70, 70],
    //       body: [
    //         [{
    //           text: 'Doc#',
    //           style: 'tableHeader',
    //           // margin: [10, 5, 10, 5]
    //         },
    //           {
    //             text: 'Account',
    //             style: 'tableHeader'
    //           },
    //           {
    //             text: 'Description',
    //             style: 'tableHeader',
    //             // margin: [36, 5, 130, 5]
    //           },
    //           {
    //             text: 'Debit',
    //             style: 'tableHeader',
    //             alignment: 'right'
    //           },
    //           {
    //             text: 'Credit',
    //             style: 'tableHeader',
    //             alignment: 'right'
    //           },
    //           {
    //             text: 'Balance',
    //             style: 'tableHeader',
    //             alignment: 'right'
    //           },
    //         ],
    //         ...this.recordsData.map((val) => {
    //           return [
    //             val.docNo,
    //             val.accountName,
    //             val.description,
    //             {text: this.valueFormatter(val.debit), alignment: 'right'},
    //             {text: this.valueFormatter(val.credit), alignment: 'right'},
    //             {text: this.valueFormatter(val.balance), alignment: 'right'}]
    //         })
    //       ],
    //     },
    //     layout: {
    //       paddingTop () {
    //         return 10
    //       },
    //       paddingLeft () {
    //         return 10
    //       },
    //       // paddingRight: function (i) { return (i === 1 || i === 2) ? 10 : 5 },
    //       paddingRight () {
    //         return 10
    //       },
    //       paddingBottom () {
    //         return 10
    //       }
    //     }
    //   }
    // ]
    // return data
  }
}



