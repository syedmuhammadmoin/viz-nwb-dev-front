import { NgxsCustomService } from './../../../../shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, ViewChild} from '@angular/core';
import { Injector} from '@angular/core';
import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { finalize, map} from 'rxjs/operators';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { BalanceSheetService} from '../service/balance-sheet.service';
import { isEmpty } from 'lodash';
import { GridOptions } from 'ag-grid-community';
import { IBalanceSheet} from "../model/IBalanceSheet";
import { Permissions } from 'src/app/views/shared/AppEnum';
import { APP_ROUTES, REPORT } from 'src/app/views/shared/AppRoutes';
import { Router } from '@angular/router';
import { AppConst } from 'src/app/views/shared/AppConst';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss']
})
export class BalanceSheetComponent extends AppComponentBase implements OnInit {

 // for permissions
  public permissions = Permissions;
  public currentClient : any ={}
  rowData: any[] = [];
  columnDefs: any;
  gridOptions: GridOptions;
  gridApi: any;
  gridColumnApi: any;
  defaultColDef;
  autoGroupColumnDef: any;
  balanceSheetForm: FormGroup;
  equityNLiability = '0';
  asset = '0';

  //Busy Loading
  isLoading: boolean;

  balanceSheetModel = {} as IBalanceSheet

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation Messages
  validationMessages = {
    docDate: {
      required: 'Date is required.'
    },
  }

  // Error keys for validation messages
  formErrors = {
    docDate: '',
  }


  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private balanceSheetService: BalanceSheetService,
    private cdRef: ChangeDetectorRef,
    public ngxsService:NgxsCustomService
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Nature',
        field: 'nature',
        rowGroup: true,
        hide: true
      },
      {
        field: 'transactional',
        cellStyle: {textAlign : 'left'}
      },
      {
        headerName: 'Total',
        field: 'balance',
        aggFunc: 'sum',
        suppressMenu: true,
        valueFormatter: (param) => {
          return this.valueFormatter(param.value)
        }
      },
    ];
  }
// ng oninit
  ngOnInit() {
    this.currentClient = AppConst.ClientConfig.config
    //creating balance sheet form
    this.balanceSheetForm = this.fb.group({
      docDate: ['', [Validators.required]],
      campusId: [null],
    });

    //Get Data From Store
    this.ngxsService.getWarehouseFromState();
    this.ngxsService.getAccountLevel4FromState()
    this.ngxsService.getCampusFromState()

    this.gridOptions = ({} as GridOptions);
    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      filter: true,
      resizable: true,
      menuTabs: ["filterMenuTab"],
    };

    this.autoGroupColumnDef = {
      menuTabs: ["filterMenuTab"],
      filterValueGetter: (params) => params.data.nature
    }
  }
  // to auto size of column
  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
// called when form is submit by clicking on submit button
  onSubmit() {
    if (this.balanceSheetForm.invalid) {
      this.logValidationErrors(this.balanceSheetForm, this.formErrors, this.validationMessages);
      return;
    }

    this.isLoading = true;
    this.mapFormValueToModel()
    this.balanceSheetService.getBalanceSheetReport(this.balanceSheetModel)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         }),
        map((x: any) => {
          return x.result.map((item: any) => {
            return item;
          })
        })
      )
      .subscribe((res: IBalanceSheet[]) => {
        this.rowData = res;
        if (isEmpty(res)) {
          this.toastService.info('No Records Found !' , 'Balance Sheet')
        }
        this.cdRef.detectChanges();
        this.calculateNetProfit(res);
      });
  }

  mapFormValueToModel() {
    this.balanceSheetModel.docDate = this.formatDate(this.balanceSheetForm.value.docDate);
    this.balanceSheetModel.campusId = this.balanceSheetForm.value.campusId?.id;
  }


  calculateNetProfit(res: any[]) {
    console.table(res);
    this.asset = res.filter(x => x.nature.toLowerCase() === 'assets').reduce((a, b) => {
      return Number(a) + Number(b.balance)
    }, 0).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2});
    const liablity = res.filter(x => x.nature.toLowerCase() === 'liability').reduce((a, b) => {
      return Number(a) + Number(b.balance)
    }, 0);
    const equity = res.filter(x => x.nature.toLowerCase() === 'equity').reduce((a, b) => {
      return Number(a) + Number(b.balance)
    }, 0);
    this.equityNLiability = Math.sign((equity) + (liablity)) === -1
      ? `(${Math.abs((equity) + (liablity)).toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      })})`
      : ((equity) + (liablity)).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2});
    console.log((equity) + (liablity));
  }

  reset() {
    this.formDirective.resetForm();
    this.rowData = [];
    this.isLoading = false;
  }

  printBalanceSheet(data: any) {
    this.balanceSheetService.setBalanceSheetDataForPrintComponent(data);
      this.router.navigate(['/' + APP_ROUTES.REPORT + '/' + REPORT.BALANCE_SHEET + '/' + REPORT.PRINT], {
        queryParams: {
          date: this.dateHelperService.transformDate(this. balanceSheetForm.value.docDate, 'MMM d, y'),
          campus: (this. balanceSheetForm.value.campusId?.name || 'All'),
        }
      })
  }
}
