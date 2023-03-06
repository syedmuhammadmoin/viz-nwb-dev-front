import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { GridOptions, ValueFormatterParams } from 'ag-grid-community';
import { DocType } from 'src/app/views/shared/AppEnum';
import { isEmpty} from 'lodash';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IReport } from '../model/IReport';

@Component({
  selector: 'kt-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent extends AppComponentBase implements OnInit {

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition: boolean

  // gridOptions: GridOptions;

  autoGroupColumnDef;
  openingBalance = 0;
  balance = 0;
  columnDefs;
  defaultColDef: any

  //Busy Loading
  isLoading: boolean;

  disability = true

  // Declaring FormGroup
  assetReportForm: FormGroup;

  // For AG Grid..
  gridOptions: GridOptions;
  rowData: IReport[] = [];

  // Declaring Model
  // Initializing generalLedger model...

  // generalLedgerModel: IGeneralLedger = {} as IGeneralLedger

  // Validation Messages
  validationMessages = {
    docDate: {
      required: 'Start Date is required.'
    },
    docDate2: {
      required: 'End Date is required.'
    }
  }

  // Error keys for validation messages
  formErrors = {
    docDate: '',
    docDate2: ''
  }

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private injector: Injector
    ) {
      super(injector);
      this.columnDefs = [
        {
          headerName: 'Store', 
          field: 'store', 
          rowGroup: true, 
          hide: true
        },
        {
          headerName: 'Asset Name', 
          field: 'assetName', 
          cellStyle: {textAlign : 'left'}
        },
        {
          headerName: 'Date', field: 'docDate',cellStyle: {textAlign : 'left'},
          cellRenderer: (params: any) => {
            const date = params?.data?.docDate != null ? params?.data?.docDate : null;
            return date == null ? null : this.transformDate(date, 'MMM d, y');
          }
        },
        {
          headerName: 'Usefull Life', 
          field: 'usefullLife', 
          cellStyle: {textAlign : 'left'}
        },
        {
          headerName: 'Quantity', 
          field: 'quantity',  
          suppressMenu: true,
          cellStyle: {textAlign : 'left'},
          valueFormatter: (params: ValueFormatterParams) => {
            return DocType[params.value]
          } 
        },

        // },
        {headerName: 'Unit Cost', field: 'unitCost', suppressMenu: true, cellStyle: {textAlign : 'left'}},
        {
          headerName: 'Dep Charged For The Period',
          field: 'dep',
          suppressMenu: true,
        },
        {
          headerName: 'Opening Accumulated Dep.',
          field: 'credit',
          suppressMenu: true,
        },
        {
          headerName: 'Category',
          field: 'category',
          colId: 'balance',
          suppressMenu: true,
        },
        {
          headerName: 'Dep. Rate',
          field: 'balance',
          colId: 'balance',
          suppressMenu: true,
        },
        {
          headerName: 'Closing Accumulated Depreciation',
          field: 'Acumulated',
          colId: 'balance',
          suppressMenu: true,
        },
        
        {
          headerName: 'NBV',
          field: 'NBV',
          colId: 'balance',
          suppressMenu: true,
        }
      ];
    }

    onRowDoubleClicked($event: any) {
    }
  ngOnInit(): void {

      // AG Grid Options
      this.gridOptions = ({} as GridOptions);
      this.gridOptions.rowHeight = 30;
      this.gridOptions.headerHeight = 35;
      this.gridOptions.suppressAggFuncInHeader = true;
  
      this.defaultColDef = {
        filter: true,
        resizable: true,
        menuTabs: ["filterMenuTab"],
      };
     
      this.autoGroupColumnDef = {
        headerName: 'Account',
        menuTabs: ["filterMenuTab"],
        minWidth: 300,
        filterValueGetter: (params) => params.data.accountName,
        cellRendererParams: {
          suppressCount: true,
          checkbox: false,
        },
      }
  
      // initializing formGroup
      this.assetReportForm = this.fb.group({
        docDate: ['', [Validators.required]],
        docDate2: ['', [Validators.required]],
      });
  
      //Get Data From Store
      // this.ngxsService.getAllBusinessPartnerFromState();
      // this.ngxsService.getWarehouseFromState();    
      // this.ngxsService.getAccountLevel4FromState()
      // this.ngxsService.getCampusFromState()
  
       //handling dueDate logic
      this.assetReportForm.get('docDate').valueChanges.subscribe((value) => {
        this.minDate = new Date(value);
        this.dateCondition = this.assetReportForm.get('docDate2').value < this.assetReportForm.get('docDate').value
      })
  }

  onSubmit() {
    if (this.assetReportForm.invalid) {
      this.logValidationErrors(this.assetReportForm, this.formErrors, this.validationMessages);
      return;
    }
    // this.mapFormValueToModel();
    this.isLoading = true;

  }

  reset() {
    this.formDirective.resetForm();
    // this.formSubmitAttempt = false;
    // this.recordsData = [];
    this.rowData = [];
    this.isLoading = false;
    // for PDF
    this.disability = true;
  }

  onFirstDataRendered(params: any) {
    //params.api.sizeColumnsToFit();
  }

}
