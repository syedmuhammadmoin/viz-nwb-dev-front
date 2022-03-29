import { BILL } from '../../../../shared/AppRoutes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnApi, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { VendorBillService } from '../services/vendor-bill.service';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { AppComponentBase } from "../../../../shared/app-component-base";
import { IVendorBill } from '../model/IVendorBill';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';


@Component({
  selector: 'kt-list-vendor-bill',
  templateUrl: './list-vendor-bill.component.html',
  styleUrls: ['./list-vendor-bill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListVendorBillComponent extends AppComponentBase implements OnInit {

  vendorBillList: any;
  gridOptions: GridOptions;
  frameworkComponents: any;
  defaultColDef: any;
  tooltipData: string = "double click to view detail"
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;

  constructor(private router: Router,
    private vendorBillService: VendorBillService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  columnDefs = [
    { headerName: 'Bill #', field: 'docNo', sortable: true, filter: true, tooltipField: 'status', cellRenderer: "loadingCellRenderer" },
    { headerName: 'Vendor Name', field: 'vendorName', sortable: true, filter: true, tooltipField: 'status' },
    {
      headerName: 'Bill Date',
      field: 'billDate',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      },
    },
    {
      headerName: 'Due Date',
      field: 'dueDate',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      },
    },
    {
      headerName: 'Total', field: 'totalAmount', sortable: true, filter: true, tooltipField: 'status',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    { 
      headerName: 'Status', 
      field: 'status', 
      sortable: true, 
      filter: true, 
      tooltipField: 'status', 
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

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  addVendorBill() {
    this.router.navigate(['/'+BILL.CREATE]);
  }

  onRowDoubleClicked(event: any) {
    this.router.navigate(['/'+BILL.ID_BASED_ROUTE('details',event.data.id) ]);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getBills(params: any): Promise<IPaginationResponse<IVendorBill[]>> {
    const result = await this.vendorBillService.getVendorBills().toPromise()
    return result
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getBills(params);
     //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.cdRef.detectChanges();
   },
  };

  // loadVendorBillList() {
  //   this.vendorBillService.getVendorBills().subscribe(
  //     (res) => {
  //       this.vendorBillList = res.result;
  //       this.cdRef.markForCheck();
  //     },
  //     (err) => {
  //       console.log(err)
  //     }
  //   )
  // }

  // agingReport() {
  //   this.router.navigate(['/'+BILL.AGING_REPORT]);
  // }
}


