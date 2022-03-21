import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, RowDoubleClickedEvent } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DocumentStatus } from 'src/app/views/shared/AppEnum';
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
    { headerName: 'Invoice #', field: 'docNo', sortable: true, filter: true, tooltipField: 'docNo', },
    { headerName: 'Customer', field: 'customerName', sortable: true, filter: true, tooltipField: 'docNo', },
    {
      headerName: 'Invoice Date',
      field: 'invoiceDate',
      sortable: true,
      filter: true,
      tooltipField: 'docNo',
      cellRenderer: (params: ICellRendererParams) => {
        const date = params.data.invoiceDate != null ? params.data.invoiceDate : null;
        return date == null || this.transformDate(date, 'MMM d, y');
      }
    },
    {
      headerName: 'Due Data',
      field: 'dueDate',
      sortable: true,
      filter: true,
      tooltipField: 'docNo',
      cellRenderer: (params: ICellRendererParams) => {
        const date = params.data.dueDate != null ? params.data.dueDate : null;
        return date == null || this.transformDate(date, 'MMM d, y');
      }
    },
    {
      headerName: 'Total', field: 'totalAmount', sortable: true, filter: true, tooltipField: 'docNo',
      cellRenderer: (params: ICellRendererParams) => {
        return this.valueFormatter(params.data.totalAmount);
      }
    },
    { 
      headerName: 'Status', 
      field: 'status', 
      sortable: true, 
      filter: true, 
      tooltipField: 'docNo', 
      cellRenderer: (params: ICellRendererParams) => {
        return DocumentStatus[params.data.status]
      }
    },
  ];

  ngOnInit() {
    
    this.getInvoiceList()

    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }

    this.frameworkComponents = { customTooltip: CustomTooltipComponent };
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

  getInvoiceList() {
    this.invoiceService.getInvoices().subscribe((res: IPaginationResponse<IInvoice[]>) => {
        this.invoiceList = res.result;
        this.cdRef.markForCheck();
      })
  }

  agingReport() {
    this.router.navigate(['/' + INVOICE.AGING_REPORT]);
  }
}



