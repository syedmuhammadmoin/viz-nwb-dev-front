import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { INVOICE } from 'src/app/views/shared/AppRoutes';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IInvoice } from '../model/IInvoice';
import { InvoiceService } from '../services/invoice.service';


@Component({
  selector: 'kt-list-invoice',
  templateUrl: './list-invoice.component.html',
  styleUrls: ['./list-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListInvoiceComponent extends AppComponentBase implements OnInit {

  invoiceList: IInvoice[];
  defaultColDef: ColDef;
  frameworkComponents: {[p: string]: unknown};
  gridOptions: GridOptions;
  tooltipData: string = "double click to view detail"
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  columnDefs = [
    { headerName: 'Invoice #', field: 'docNo', sortable: true, filter: true, tooltipField: 'docNo', cellRenderer: "loadingCellRenderer" },
    { headerName: 'Customer', field: 'customerName', sortable: true, filter: true, tooltipField: 'docNo', },
    {
      headerName: 'Invoice Date',
      field: 'invoiceDate',
      sortable: true,
      filter: true,
      tooltipField: 'docNo',
      valueFormatter: (params: ValueFormatterParams) => { 
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    {
      headerName: 'Due Data',
      field: 'dueDate',
      sortable: true,
      filter: true,
      tooltipField: 'docNo',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    {
      headerName: 'Total', field: 'totalAmount', sortable: true, filter: true, tooltipField: 'docNo',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value) || null;
      }
    },
    { 
      headerName: 'Status', 
      field: 'status', 
      sortable: true, 
      filter: true, 
      tooltipField: 'docNo',
    },
  ];

  ngOnInit() {
    
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

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  addInvoice() {
    this.router.navigate(['/' + INVOICE.CREATE]);
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/' + INVOICE.ID_BASED_ROUTE('details', event.data.id)]);
  }

  // getInvoiceList() {
  //   this.invoiceService.getInvoices().subscribe((res: IPaginationResponse<IInvoice[]>) => {
  //       this.invoiceList = res.result;
  //       this.cdRef.markForCheck();
  //     })
  // }

  agingReport() {
    this.router.navigate(['/' + INVOICE.AGING_REPORT]);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getInvoices(params: any): Promise<IPaginationResponse<IInvoice[]>> {
    const result = await this.invoiceService.getInvoices().toPromise()
    return result
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getInvoices(params);
     //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.cdRef.detectChanges();
   },
  };
}



