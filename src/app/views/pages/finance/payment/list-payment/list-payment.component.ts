import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { PaymentService } from '../service/payment.service';
import { DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { MatDialog } from '@angular/material/dialog';
import { CreatePaymentComponent } from '../create-payment/create-payment.component';
import { PAYMENT } from 'src/app/views/shared/AppRoutes';
import { IPayment } from '../model/IPayment';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { AppConst } from 'src/app/views/shared/AppConst';
import { isEmpty } from 'lodash';

@Component({
  selector: 'kt-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: ['./list-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListPaymentComponent extends AppComponentBase implements OnInit, OnDestroy {

  public permissions = Permissions;
  docType = DocType
  paymentList: IPayment[];
  FormName: string;
  documents = AppConst.Documents;
  selectedDocumentType: number;
  defaultColDef: ColDef;
  frameworkComponents: {[p: string]: unknown};
  gridOptions: GridOptions;
  tooltipData: string = "double click to view detail"
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
  
  //subscription
  subscription$: Subscription

  constructor(private paymentService: PaymentService,
    private router: Router,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    injector: Injector
  ) {
    super(injector)
    this.selectedDocumentType = this.activatedRoute.snapshot.data.docType;
    console.log(this.selectedDocumentType)
    this.FormName = this.documents.find(x => x.id === this.selectedDocumentType).value
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  //ag-Grid Columns
  columnDefs = [
    { headerName: 'Doc #', field: 'docNo', sortable: true, filter: true, tooltipField: 'status', cellRenderer: "loadingCellRenderer" },
    // { headerName: 'Payment No.', field: 'docNo', sortable: true, filter: true ,tooltipField: 'status' },
    { headerName: 'Business Partner', field: 'businessPartnerName', sortable: true, filter: true, tooltipField: 'status' },
    {
      headerName: 'Payment Date',
      field: 'paymentDate',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    {
      headerName: 'Discount',
      field: 'discount',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'sales Tax',
      field: 'salesTax',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Income Tax',
      field: 'incomeTax',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Net Payment', field: 'netPayment', sortable: true, filter: true, tooltipField: 'status',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      filter: true,
      tooltipField: 'status'
    },
  ];

  ngOnInit(): void {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 40,
      headerHeight: 35,
      context: "double click to edit",
    };

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }

    this.components = {
      loadingCellRenderer: function (params: any) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },
    };
  }

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
    // Recalling getPaymets function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setDatasource(this.dataSource)
      this.cdRef.detectChanges();
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getPayments(params: any): Promise<IPaginationResponse<IPayment[]>> {
    const result = await this.paymentService.getPayments((this.documents.find(x => x.id === this.selectedDocumentType).value) , params).toPromise()
    console.log(result)
    return result
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getPayments(params);

     if(isEmpty(res.result)) {  
      this.gridApi.showNoRowsOverlay() 
    } else {
     this.gridApi.hideOverlay();
    }
     //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, this.docType[this.selectedDocumentType])
     this.cdRef.detectChanges();
   },
  };

  // getPayments() {
  //   this.subscription$ = this.paymentService.getPayments().subscribe((res: IPaginationResponse<IPayment[]>) => {
  //       this.paymentList = res.result;
  //       this.cdRef.detectChanges()
  //     })
  // }
}
