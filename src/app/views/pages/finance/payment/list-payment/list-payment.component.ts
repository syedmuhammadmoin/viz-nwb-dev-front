import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { Subscription, firstValueFrom } from 'rxjs';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { PaymentService } from '../service/payment.service';
import { DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { MatDialog } from '@angular/material/dialog';
import { CreatePaymentComponent } from '../create-payment/create-payment.component';
import { IPayment } from '../model/IPayment';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { AppConst } from 'src/app/views/shared/AppConst';
import { isEmpty } from 'lodash';

@Component({
  selector: 'kt-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: ['./list-payment.component.scss']
})

export class ListPaymentComponent extends AppComponentBase implements OnInit, OnDestroy {

  public permissions = Permissions;
  docType = DocType
  paymentList: IPayment[];
  FilteredData : any[] = [];
  FormName: string;
  documents = AppConst.Documents;
  selectedDocumentType: number;
  defaultColDef: ColDef;
  
  gridOptions: any;
  tooltipData: string = "double click to view detail"
  components: any;
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  showCreateButton: boolean = false;

  //subscription
  subscription$: Subscription

  constructor(private paymentService: PaymentService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    injector: Injector
  ) {
    super(injector)
    this.selectedDocumentType = this.activatedRoute.snapshot.data.docType;
    this.FormName = this.documents.find(x => x.id === this.selectedDocumentType).value
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  //Defining AG Grid Columns
  columnDefs = [
    {
      headerName: 'Doc #',
      field: 'docNo',
      tooltipField: 'status',
      cellRenderer: "loadingCellRenderer",
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Business Partner',
      field: 'businessPartnerName',
      tooltipField: 'status',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Payment Date',
      field: 'paymentDate',
      tooltipField: 'status',
      filter: 'agDateColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['equals'],
          suppressAndOrCondition: true,
        },
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    {
      headerName: 'Net Payment',
      field: 'netPayment',
      headerClass: 'custom_left',
      tooltipField: 'status',
      cellStyle: { 'text-align': "right" },
      suppressHeaderMenuButton: true,
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      filter: 'agSetColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          values: ['Draft', 'Rejected', 'Unpaid', 'Partial', 'Paid', 'Submitted', 'Reviewed'],
          defaultToNothingSelected: true,
          suppressSorting:true,
          suppressSelectAll: true,
          suppressAndOrCondition: true,
        },
    },
  ];

  ngOnInit(): void {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      paginationPageSizeSelector: false,
      context: "double click to view detail",
    };

    

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 150,
      filter: 'agSetColumnFilter',
      sortable: false,
      resizable: true,
    }

    this.components = {
      customTooltip: CustomTooltipComponent,
      loadingCellRenderer: function (params: any) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },
    };

    if(this.selectedDocumentType === 17) this.showCreateButton = false;

    (this.selectedDocumentType === 0) ? this.showButton(this.permission.isGranted(this.permissions.PAYMENT_CREATE)) :
      (this.selectedDocumentType === 15) ? this.showButton(this.permission.isGranted(this.permissions.RECEIPT_CREATE)) : null
  }

  showButton (permission: boolean) { this.showCreateButton = (permission) ? true : false; }

  ngOnDestroy() {
    if (this.subscription$) this.subscription$.unsubscribe()
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/payment/'+ this.documents.find(x => x.id === this.selectedDocumentType).route +'/details/' + event.data.id])
  }

  addPaymentDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreatePaymentComponent, {
      width: '800px',
      data: { id, docType: this.selectedDocumentType }
    });
    //Getting Updated Payment Data
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setGridOption('datasource', this.dataSource);
    });
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getPayments(params);
     if(isEmpty(res.result)) {
      this.gridApi.showNoRowsOverlay()
    } else {
      this.FilteredData = res.result;
      this.gridApi.hideOverlay();
    }
     params.successCallback( this.FilteredData || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, this.docType[this.selectedDocumentType]);
     this.cdRef.detectChanges();
   },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }

  async getPayments(params: any): Promise<IPaginationResponse<IPayment[]>> {
    const result = await firstValueFrom(this.paymentService.getRecords(params, this.documents.find(x => x.id === this.selectedDocumentType).value));
    return result
  }

  fetchData(x: any) {           
    const dataSource = {
      getRows: (params: any) => {        
        this.paymentService.getRecordByYearMonth(x.startDate ,x.endDate ,x.businessPartnerName )
          .subscribe((data) => {
            if (isEmpty(data.result)) {
              this.gridApi.showNoRowsOverlay();
            } else {
              this.gridApi.hideOverlay();             
              this.FilteredData = data.result;
            }
            params.successCallback(this.FilteredData || 0 ,data.totalRecords);
            this.paginationHelper.goToPage(this.gridApi, 'purchaseOrderPageName');
            this.cdRef.detectChanges();
        });
      },
    };
    this.gridApi.setDatasource(dataSource);
}
}
