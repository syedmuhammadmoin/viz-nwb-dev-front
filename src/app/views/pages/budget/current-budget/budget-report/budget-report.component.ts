import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { AppComponentBase} from '../../../../shared/app-component-base';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { ColDef, GridOptions, ICellRendererParams, ValueFormatterParams} from 'ag-grid-community';
import { finalize, take} from 'rxjs/operators';
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

  public permissions = Permissions;

  //Loader
  isLoading: boolean;
  
  // Declaring FormGroup
  budgetReportForm: FormGroup;

  // For AG Grid..
  gridOptions: GridOptions;
  defaultColDef: ColDef
  rowData: IBudgetReport[] = [];

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  //Budget Model
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

  //Keys for validation messages
  formErrors = {
    budgetName: '',
    to: ''
  }

  //Injecting Dependencies
  constructor(
    private fb: FormBuilder,   
    private _budgetService: BudgetService,
    private cdRef: ChangeDetectorRef,   
    public ngxsService: NgxsCustomService,
    public dateHelperService: DateHelperService,
    injector: Injector
  ) {
    super(injector);
  }

  //Defining AG Grid Columns
  columnDefs = [
    {headerName: 'Budget Name', field: 'budgetName', suppressMenu: true,  cellStyle: {textAlign : 'left'},},
    {
      headerName: 'Date', 
      field: 'to',
      suppressMenu: true,
      cellStyle: {textAlign : 'left'},
      cellRenderer: (params: ICellRendererParams) => {
        return this.dateHelperService.transformDate(params.data.to, 'MMM d, y')
      }
    },
    {headerName: 'Account', field: 'account', suppressMenu: true,  cellStyle: {textAlign : 'left'},},
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

    this.gridOptions = ({} as GridOptions);
    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      resizable: true,
    }

    //Initializing formGroup
    this.budgetReportForm = this.fb.group({
      budgetName: ['', [Validators.required]],
      to: ['', [Validators.required]],
    });

    //Get Data From Store
    this.ngxsService.getBudgetsFromState()
  }

  onSubmit() {
    if (this.budgetReportForm.invalid) {
      this.logValidationErrors(this.budgetReportForm, this.formErrors, this.validationMessages);
      return;
    }

    this.isLoading = true;
    this.mapFormValueToModel();
    this._budgetService.getBudgetReport(this.budgetReportModel)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      this.rowData = res.result;
      if (isEmpty(res.result)) {
        this.toastService.info('No Records Found !' , 'Budget Report')
      }
      this.cdRef.detectChanges();
    });
  }

  reset() {
    this.formDirective.resetForm();
    this.rowData = [];
    this.isLoading = false;
  }

  //Mapping Form values to Model
  mapFormValueToModel() {
    this.budgetReportModel.to = this.formatDate(this.budgetReportForm.value.to) || '';
    this.budgetReportModel.budgetName = this.budgetReportForm.value.budgetName || '';
  }
}



