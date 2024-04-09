import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridOptions, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { INVOICE } from 'src/app/views/shared/AppRoutes';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IInvoice } from '../model/IInvoice';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'kt-aging-report',
  templateUrl: './aging-report.component.html',
  styleUrls: ['./aging-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AgingReportComponent extends AppComponentBase implements OnInit {

  public defaultColDef: ColDef;
  public autoGroupColumnDef: ColDef;
  public agingReportList: IInvoice[];
  
  gridOptions: any;;
  tooltipData: string = "double click to view detail"

  constructor(
    private cdRef: ChangeDetectorRef,
    private invoiceService: InvoiceService,
    private route: Router,
    injector: Injector
  ) { super(injector) }

  columnDefs: any = [
    {
      field: 'customerName',
      rowGroup: true,
      hide: true,
    },
    {
      headerName: 'Invoice #',
      field: 'docNo',
      tooltipField: 'docNo',
    },
    {
      field: 'invoiceDate',
      tooltipField: 'docNo',
      valueGetter: (params: ICellRendererParams) => {
        if (params.data) {
          const date = params.data.invoiceDate != null ? params.data.invoiceDate : null;
          return date == null || this.transformDate(date, 'MMM d, y');
        }
      }
    },
    {
      headerName: '1 - 30 Days',
      field: 'invoiceDate',
      aggFunc: 'sum',
      tooltipField: 'docNo',
      valueGetter: (params: ICellRendererParams) => {
        if (params.data) {
          const days = this.getDays(params.data.invoiceDate);
          if (days <= 30) { return this.valueFormatter(params.data.pendingAmount); };

        }
      },
    },
    {
      headerName: '31 - 60 Days',
      field: 'invoiceDate',
      aggFunc: 'sum',
      tooltipField: 'docNo',
      valueGetter: (params: ICellRendererParams) => {
        if (params.data) {
          const days = this.getDays(params.data.invoiceDate);
          if (days > 30 && days <= 60) { return this.valueFormatter(params.data.pendingAmount); };
        }
      }
    },
    {
      headerName: '61 - 90 Days',
      field: 'invoiceDate',
      aggFunc: 'sum',
      tooltipField: 'docNo',
      valueGetter: (params: ICellRendererParams) => {
        if (params.data) {
          const days = this.getDays(params.data.invoiceDate);
          if (days > 60 && days <= 90) { return this.valueFormatter(params.data.pendingAmount); };
        }
      }
    },
    {
      headerName: 'Above 90 Days',
      field: 'invoiceDate',
      aggFunc: 'sum',
      valueGetter: (params: ICellRendererParams) => {
        if (params.data) {
          const days = this.getDays(params.data.invoiceDate);
          if (days > 90) { return this.valueFormatter(params.data.pendingAmount) };
        }
      }
    },
    {
      headerName: 'Outstanding Amount',
      field: 'pendingAmount',
      valueFormatter: (params: ValueFormatterParams) => { return this.valueFormatter(params.value) },
      aggFunc: 'sum',
    },
  ];

  ngOnInit() {

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 150,
      sortable: false,
      resizable: true,
    };

    

    this.gridOptions = {
      context: "double click to view detail",
    }

    this.autoGroupColumnDef = {
      headerName: 'Customer',
      minWidth: 200,
      cellRendererParams: {
        suppressCount: true,
        checkbox: false,
      },
    }
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    if (event.data) this.route.navigate(['/' + INVOICE.ID_BASED_ROUTE('details', event.data.id)]);
  }

  getDays(date: Date) {
    const invoiceDate = new Date(this.transformDate(date, 'MMM d, y'));
    const currentDate = new Date(new Date().toJSON().slice(0, 10).replace(/-/g, '/'));
    const Time = currentDate.getTime() - invoiceDate.getTime();
    const Days = Time / (1000 * 3600 * 24);
    return Days;
  }

  onGridReady() {
    this.invoiceService.getAgingReport().subscribe((data: IApiResponse<any[]>) => {
      //this.agingReportList = data.result.filter((x: any) => x.state == DocumentStatus.Unpaid || x.state == DocumentStatus.Partial);
      console.log(data.result)
      this.agingReportList = data.result;
      this.cdRef.detectChanges();
    });
  }
}
