import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { PayrollItemType, PayrollType } from 'src/app/views/shared/AppEnum';
import { PAYROLL_ITEM } from 'src/app/views/shared/AppRoutes';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IPayrollItem } from '../model/IPayrollItem';
import { PayrollItemService } from '../service/payroll-item.service';

@Component({
  selector: 'kt-list-payroll-item',
  templateUrl: './list-payroll-item.component.html',
  styleUrls: ['./list-payroll-item.component.scss']
})

export class ListPayrollItemComponent extends AppComponentBase implements OnInit {

  payrollItemList: IPayrollItem[];
  defaultColDef: ColDef;
  frameworkComponents: {[p: string]: unknown};
  gridOptions: GridOptions;
  tooltipData: string = "double click to edit"
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  constructor(
    private payrollItemService: PayrollItemService,
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
    { headerName: 'Item Name', field: 'name', sortable: true, filter: true, tooltipField: 'name', cellRenderer: "loadingCellRenderer" },
    { headerName: 'Item Code', field: 'itemCode', sortable: true, filter: true, tooltipField: 'name' },
    { 
      headerName: 'Payroll Type', 
      field: 'payrollType', 
      sortable: true, 
      filter: true, 
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => { 
        return PayrollType[params.value];
      }
     },
    { 
      headerName: 'Item Type', 
      field: 'payrollItemType', 
      sortable: true, 
      filter: true, 
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => { 
        return PayrollItemType[params.value];
      }
     },
    {
      headerName: 'Account',
      field: 'accountName',
      sortable: true,
      filter: true,
      tooltipField: 'name'
    },
    {
      headerName: 'Value',
      field: 'value',
      sortable: true,
      filter: true,
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => { 
        return this.valueFormatter(params.value);
      }
    },
    {
      headerName: 'Remarks', field: 'remarks', sortable: true, filter: true
    },
    { 
      headerName: 'Active', 
      field: 'isActive', 
      sortable: true, 
      filter: true, 
      valueFormatter: (params: ValueFormatterParams) => {
         return (params.value === true) ? 'Yes' : "No"
      }
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

  addPayrollItem() {
    this.router.navigate(['/' + PAYROLL_ITEM.CREATE]);
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/' + PAYROLL_ITEM.ID_BASED_ROUTE('edit', event.data.id)]);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getPayrollItems(params: any): Promise<IPaginationResponse<IPayrollItem[]>> {
    const result = await this.payrollItemService.getPayrollItems(params).toPromise()
    return result
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getPayrollItems(params);

     if (!res.result) { 
      this.gridApi.showNoRowsOverlay() 
    } else {
     this.gridApi.hideOverlay();
    }
     //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'payrollItemPageName')
     this.cdRef.detectChanges();
   },
  };
}






