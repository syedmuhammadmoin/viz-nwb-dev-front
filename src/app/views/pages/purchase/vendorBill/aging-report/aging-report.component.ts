import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ICellRendererParams, RowDoubleClickedEvent } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DocumentStatus } from 'src/app/views/shared/AppEnum';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { InventoryAdjustmentService } from '../../../inventory/inventory-adjustment/service/inventory-adjustment.service';
import { InvoiceRoutingModule } from '../../../sales/invoice/invoice-routing.module';
import { IVendorBill } from '../model/IVendorBill';
import { VendorBillService } from '../services/vendor-bill.service';


@Component({
  selector: 'kt-aging-report',
  templateUrl: './aging-report.component.html',
  styleUrls: ['./aging-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AgingReportComponent extends AppComponentBase implements OnInit {

  public defaultColDef: ColDef;
  public autoGroupColumnDef: ColDef;
  public agingReportList: IVendorBill[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private billService: VendorBillService,
    private route: Router,
    injector: Injector
  ) { super(injector) }

  columnDefs = [
    {
      field: 'vendor',
      rowGroup: true,
      hide: true,
    },
    {
      headerName: 'Bill #',
      field: 'docNo',
    },
    {
      field: 'billDate',
      valueGetter: (params: ICellRendererParams) => {
        if (params.data) {
          const date = params.data.billDate != null ? params.data.billDate : null;
          return date == null || this.transformDate(date, 'MMM d, y');
        }
      }
    },
    {
      headerName: '1 - 30 Days',
      field: 'billDate',
      aggFunc: 'sum',
      valueGetter: (params: ICellRendererParams) => {
        if (params.data) {
          const days = this.getDays(params.data.billDate);
          if (days <= 30) return this.valueFormatter(params.data.pendingAmount);

        }
      },
    },
    {
      headerName: '31 - 60 Days',
      field: 'billDate',
      aggFunc: 'sum',
      valueGetter: (params: ICellRendererParams) => {
        if (params.data) {
          const days = this.getDays(params.data.billDate);
          if (days > 30 && days <= 60) return this.valueFormatter(params.data.pendingAmount);
        }
      }
    },
    {
      headerName: '61 - 90 Days',
      field: 'billDate',
      aggFunc: 'sum',
      valueGetter: (params: ICellRendererParams) => {
        if (params.data) {
          const days = this.getDays(params.data.billDate);
          if (days > 60 && days <= 90) return this.valueFormatter(params.data.pendingAmount);
        }
      }
    },
    {
      headerName: 'Above 90 Days',
      field: 'billDate',
      aggFunc: 'sum',
      valueGetter: (params: ICellRendererParams) => {
        if (params.data) {
          const days = this.getDays(params.data.billDate);
          if (days > 90) return this.valueFormatter(params.data.pendingAmount);
        }
      }
    },
    {
      headerName: 'Outstanding Amount',
      field: 'pendingAmount',
      valueFormatter: (params: ICellRendererParams) => { return this.valueFormatter(params.value) },
      aggFunc: 'sum',
    },
  ];

  ngOnInit() {
    this.defaultColDef = {
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
    };
    this.autoGroupColumnDef = {
      headerName: 'Vendor',
      minWidth: 200,
      cellRendererParams: {
        suppressCount: true,
        checkbox: false,
      },
    }
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    if (event.data) this.route.navigate(['/vendor-bill/detail/', event.data.id]);
  }

  getDays(date: Date) {
    const billDate = new Date(this.transformDate(date, 'MMM d, y'));
    const currentDate = new Date(new Date().toJSON().slice(0, 10).replace(/-/g, '/'));
    const Time = currentDate.getTime() - billDate.getTime();
    const Days = Time / (1000 * 3600 * 24);
    return Days;
  }

  onGridReady() {
    this.billService.getVendorBills('').subscribe((data: IPaginationResponse<IVendorBill[]>) => {
      // this.agingReportList = data.result.filter((x: any) => x.state == DocumentStatus.Unpaid || x.state == DocumentStatus.Partial);
      this.agingReportList = data.result
      this.cdRef.detectChanges();
    });
  }
}

