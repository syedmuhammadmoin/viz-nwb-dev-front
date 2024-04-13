import { BILL } from '../../../../shared/AppRoutes';
import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent, ValueFormatterParams } from 'ag-grid-community';
import { VendorBillService } from '../services/vendor-bill.service';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { AppComponentBase } from "../../../../shared/app-component-base";
import { Permissions } from 'src/app/views/shared/AppEnum';
import { isEmpty } from 'lodash';


@Component({
  selector: 'kt-list-vendor-bill',
  templateUrl: './list-vendor-bill.component.html',
  styleUrls: ['./list-vendor-bill.component.scss']
})

export class ListVendorBillComponent extends AppComponentBase implements OnInit {

  vendorBillList: any;
  gridOptions: any;
  
  defaultColDef: any;
  tooltipData: string = "double click to view detail"
  components: any;
  public permissions = Permissions
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  constructor(
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

  //Defining Bill Columns
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
    { headerName: 'Vendor',
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
      headerClass: 'custom_left',
      cellStyle: { 'text-align': "right" },
      tooltipField: 'status',
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

  ngOnInit() {
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
       params.api.setGridOption('datasource', dataSource);
  }
}
