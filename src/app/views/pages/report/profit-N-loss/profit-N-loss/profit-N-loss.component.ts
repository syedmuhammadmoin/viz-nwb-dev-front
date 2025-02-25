import { NgxsCustomService } from './../../../../shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { ProfitLossService} from '../service/profit-loss.service';
import { IProfitLoss} from '../model/IProfitLoss';
import { isEmpty } from 'lodash';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { finalize, map } from 'rxjs/operators';
import { FirstDataRenderedEvent, GridReadyEvent, ValueFormatterParams } from 'ag-grid-community';
import { APP_ROUTES, REPORT } from 'src/app/views/shared/AppRoutes';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { AppConst } from 'src/app/views/shared/AppConst';

@Component({
  selector: 'kt-profit-n-loss',
  templateUrl: './profit-N-loss.component.html',
  styleUrls: ['./profit-N-loss.component.scss']
})

export class ProfitNLossComponent extends AppComponentBase implements OnInit {
  public currentClient : any ={}
 // for permissions
 public permissions = Permissions;
  rowData: any[] = [];
  columnDefs: any;
  gridOptions: any;
  gridApi: any;
  defaultColDef;
  autoGroupColumnDef: any;
  profitNLossForm: FormGroup;
  profitNLossModel: IProfitLoss = {} as IProfitLoss
  netProfit = '0';

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  //data for PDF
  recordsData: any = []
  disability: boolean = true

  //Busy Loading
  isLoading: boolean;

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition: boolean

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
  formErrors: any = {
    docDate: '',
    docDate2: ''
  }


  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    public addButtonService: AddModalButtonService,
    private profitLossService: ProfitLossService,
    public ngxsService:NgxsCustomService,
    injector: Injector
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Nature',
        field: 'nature',
        rowGroup: true,
        hide: true,
      },
      {
        headerName: 'Transactional',
        field: 'transactional',
        cellStyle: {textAlign : 'left'}

      },
      {
        headerName: 'Total',
        field: 'balance',
        aggFunc: 'sum',
        suppressHeaderMenuButton: true,
        valueFormatter: (param: ValueFormatterParams) => {
          return this.valueFormatter(param.value)
        }
      },
    ];
  }

  ngOnInit(): void {
    this.currentClient = AppConst.ClientConfig.config
    this.profitNLossForm = this.fb.group({
      docDate: ['', [Validators.required]],
      docDate2: ['', [Validators.required]],
      accountId: [null],
      businessPartnerId: [null],
      warehouseId: [null],
      campusId: [null]
    });

    //Get Data from Store
    this.ngxsService.getWarehouseFromState();
    this.ngxsService.getAccountLevel4FromState()
    this.ngxsService.getCampusFromState()
    this.ngxsService.getBusinessPartnerFromState()

    this.defaultColDef = {
      filter: true,
      resizable: true,
      sortable: false,
      menuTabs: ["filterMenuTab"],
    };

    this.autoGroupColumnDef = {
      headerName: 'Nature',
      menuTabs: ["filterMenuTab"],
      filterValueGetter: (params) => params.data.nature
    }

    //handling dueDate logic
    this.profitNLossForm.get('docDate').valueChanges.subscribe((value) => {
      this.minDate = new Date(value);
      this.dateCondition = this.profitNLossForm.get('docDate2').value < this.profitNLossForm.get('docDate').value
    })
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onSubmit() {
    if (this.profitNLossForm.invalid) {
      this.logValidationErrors(this.profitNLossForm, this.formErrors, this.validationMessages);
      return;
    }
    this.mapProfitNLossValuesToModel();
    this.isLoading = true;
    this.profitLossService.getProfitNLoss(this.profitNLossModel)
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
      .subscribe((res: any) => {
        this.rowData = res;
        this.recordsData = res;
        // for PDF
        this.disability = (!isEmpty(res)) ? false : true;
        if (isEmpty(res)) {
          this.toastService.info('No Records Found !' , 'Income & Expenditure')
        }
        this.cdRef.detectChanges();
        this.calculateNetProfit(res);
      });
  }

  mapProfitNLossValuesToModel () {
    this.profitNLossModel.docDate = this.formatDate(this.profitNLossForm.value.docDate)
    this.profitNLossModel.docDate2 = this.formatDate(this.profitNLossForm.value.docDate2)
    this.profitNLossModel.businessPartnerId = this.profitNLossForm.value.businessPartnerId?.id || null;
    this.profitNLossModel.campusId = this.profitNLossForm.value.campusId?.id || null;
    this.profitNLossModel.accountId = this.profitNLossForm.value.accountId?.id || null;
    this.profitNLossModel.warehouseId = this.profitNLossForm.value.warehouseId?.id || null;
  }

  calculateNetProfit(res: any[]) {
    const revenue = res.filter(x => x.nature.toLowerCase() === 'income').reduce((a, b) => {
      return Number(a) + Number(b.balance)
    }, 0);
    const expense = res.filter(x => x.nature.toLowerCase() === 'expenses').reduce((a, b) => {
      return Number(a) + Number(b.balance)
    }, 0);
    this.netProfit = `(${Math.abs((revenue) - (expense)).toLocaleString()})`
  }

  reset() {
    this.formDirective.resetForm();
    this.recordsData = [];
    this.rowData = [];
    this.isLoading = false;
    //for PDF
    this.disability = true;
  }

  printProfitNLoss(data: any) {
    this.profitLossService.setProfitNLossDataForPrintComponent(data);
      this.router.navigate(['/' + APP_ROUTES.REPORT + '/' + REPORT.PROFIT_N_LOSS + '/' + REPORT.PRINT], {
        queryParams: {
          from: this.dateHelperService.transformDate(this.profitNLossForm.value.docDate, 'MMM d, y'),
          to: this.dateHelperService.transformDate(this.profitNLossForm.value.docDate2, 'MMM d, y'),
          account: (this.profitNLossForm.value.accountId?.editableName || 'All'),
          businessPartner: (this.profitNLossForm.value.businessPartnerId?.name || 'All'),
          campus: (this.profitNLossForm.value.campusId?.name || 'All'),
          store: (this.profitNLossForm.value.warehouseId?.name || 'All'),
        }
      })
  }
}
