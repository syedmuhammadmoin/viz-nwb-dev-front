import { BILL } from '../../../../shared/AppRoutes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnApi, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { VendorBillService } from '../services/vendor-bill.service';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { AppComponentBase } from "../../../../shared/app-component-base";
import { IVendorBill } from '../model/IVendorBill';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { isEmpty } from 'lodash';


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
  public permissions = Permissions
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

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
    { 
      headerName: 'Bill #', 
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
    { headerName: 'Vendor Name', 
      field: 'vendorName', 
      tooltipField: 'status',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Bill Date',
      field: 'billDate',
      tooltipField: 'status',
      filter: 'agDateColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['equals'],
          suppressAndOrCondition: true,
        },
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      },
    },
    {
      headerName: 'Due Date',
      field: 'dueDate',
      tooltipField: 'status',
      filter: 'agDateColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['equals'],
          suppressAndOrCondition: true,
        },
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      },
    },
    {
      headerName: 'Total', 
      field: 'totalAmount', 
      tooltipField: 'status',
      suppressMenu: true,
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

  ngOnInit() {
    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 35,
      headerHeight: 35,
      context: "double click to view detail",
    };

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};
 
    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 150,
      filter: 'agSetColumnFilter',
      resizable: true,
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
    this.router.navigate(['/'+ BILL.CREATE]);
  }

  onRowDoubleClicked(event: any) {
    this.router.navigate(['/'+ BILL.ID_BASED_ROUTE('details',event.data.id) ]);
  }

  agingReport() {
    this.router.navigate(['/'+ BILL.AGING_REPORT]);
  }

  onGridReady(params: GridReadyEvent) {

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

        var dataSource = {
          getRows: (params: any) => {
            this.vendorBillService.getRecords(params).subscribe((data) => {
              if(isEmpty(data.result)) {  
                this.gridApi.showNoRowsOverlay() 
              } else {
                this.gridApi.hideOverlay();
              }
              params.successCallback(data.result || 0, data.totalRecords);
              this.paginationHelper.goToPage(this.gridApi, 'billPageName')
              this.cdRef.detectChanges()
          });
          },
       };
    params.api.setDatasource(dataSource)
  }

  // onGridReady(params: GridReadyEvent) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   params.api.setDatasource(this.dataSource);
  // }

  // async getBills(params: any): Promise<IPaginationResponse<IVendorBill[]>> {
  //   const result = await this.vendorBillService.getVendorBills(params).toPromise()
  //   return result
  // }

  // dataSource = {
  //   getRows: async (params: any) => {
  //    const res = await this.getBills(params);

  //    if(isEmpty(res.result)) {  
  //     this.gridApi.showNoRowsOverlay() 
  //   } else {
  //    this.gridApi.hideOverlay();
  //   }
  //    //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
  //    params.successCallback(res.result || 0, res.totalRecords);
  //    this.paginationHelper.goToPage(this.gridApi, 'billPageName')
  //    this.cdRef.detectChanges();
  //  },
  // };
}


