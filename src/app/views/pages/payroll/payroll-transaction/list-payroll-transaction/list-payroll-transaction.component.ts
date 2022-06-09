import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { isEmpty } from 'lodash';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { PAYROLL_TRANSACTION } from 'src/app/views/shared/AppRoutes';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IPayrollTransaction } from '../model/IPayrollTransaction';
import { PayrollTransactionService } from '../service/payroll-transaction.service';

@Component({
  selector: 'kt-list-payroll-transaction',
  templateUrl: './list-payroll-transaction.component.html',
  styleUrls: ['./list-payroll-transaction.component.scss']
})

export class ListPayrollTransactionComponent extends AppComponentBase implements OnInit {

  payrollTransactionList: [];
  defaultColDef: ColDef;
  frameworkComponents: {[p: string]: unknown};
  gridOptions: GridOptions;
  tooltipData: string = "double click to view detail"
  components: { loadingCellRenderer (params: any ) : unknown };
  public permissions = Permissions
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  constructor(
    private payrollTransactionService: PayrollTransactionService,
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
    {
      headerName: 'DocNo ',
      field: 'docNo',
      tooltipField: 'docNo',
      cellRenderer: 'loadingCellRenderer',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Employee Name ',
      field: 'employee',
      tooltipField: 'docNo',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    // {
    //   headerName: 'CNIC',
    //   field: 'cnic',
    //   tooltipField: 'employee',
    //   // filter: 'agTextColumnFilter',
    //   // menuTabs: ['filterMenuTab'],
    //   // filterParams: {
    //   //   filterOptions: ['contains'],
    //   //   suppressAndOrCondition: true,
    //   // },
    // },
    {
      headerName: 'Month',
      field: 'month',
      tooltipField: 'docNo',
      suppressMenu: true,
      // filter: 'agTextColumnFilter',
      // menuTabs: ['filterMenuTab'],
      // filterParams: {
      //   filterOptions: ['contains'],
      //   suppressAndOrCondition: true,
      // },
      valueFormatter: (params: any) => {
        return (params.value) ? AppConst.Months.find(x => x.value === params.value).name : 'N/A';
        //return AppConst.Months.find(x => x.value === params.value).name
      },
    },
    {
      headerName: 'Year',
      field: 'year',
      tooltipField: 'docNo',
      suppressMenu: true,
      // filter: 'agTextColumnFilter',
      // menuTabs: ['filterMenuTab'],
      // filterParams: {
      //   filterOptions: ['contains'],
      //   suppressAndOrCondition: true,
      // },
    },
    {
      headerName: 'Designation',
      field: 'designation',
      tooltipField: 'docNo',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Department',
      field: 'department',
      tooltipField: 'docNo',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    // {
    //   headerName: 'Transaction Date',
    //   field: 'transDate',
    //   tooltipField: 'docNo',
    //   // filter: 'agDateColumnFilter',
    //   // menuTabs: ['filterMenuTab'],
    //   // filterParams: {
    //   //   filterOptions: ['equals'],
    //   //   suppressAndOrCondition: true,
    //   // },
    //   valueFormatter: (params: any) => {
    //     return this.dateHelperService.transformDate(params.value, 'MMM d, y');
    //   },
    // },
    {
      headerName: 'Basic Salary',
      field: 'basicSalary',
      suppressMenu: true,
      tooltipField: 'employee',
      valueFormatter: (params: any) => {
        return params.value ? this.valueFormatter(params.value) : null;
      },
    },
    {
      headerName: 'Allowance',
      field: 'totalAllowances',
      suppressMenu: true,
      tooltipField: 'docNo',
      valueFormatter: (params: any) => {
        return params.value ? this.valueFormatter(params.value) : null;
      },
    },
    {
      headerName: 'Gross Pay',
      field: 'grossPay',
      suppressMenu: true,
      tooltipField: 'docNo',
      valueFormatter: (params: any) => {
        return params.value ? this.valueFormatter(params.value) : null;
      },
    },
    {
      headerName: 'Deductions',
      field: 'totalDeductions',
      suppressMenu: true,
      tooltipField: 'docNo',
      valueFormatter: (params: any) => {
        return params.value ? this.valueFormatter(params.value) : null;
      },
    },
    // {
    //   headerName: 'Tax',
    //   field: 'taxDeduction',
    //   suppressMenu: true,
    //   tooltipField: 'employee',
    //   valueFormatter: (params: any) => {
    //     return params.value ? this.valueFormatter(params.value) : null;
    //   },
    // },
    {
      headerName: 'Net Pay',
      field: 'netSalary',
      suppressMenu: true,
      tooltipField: 'docNo',
      valueFormatter: (params: any) => {
        return params.value ? this.valueFormatter(params.value) : null;
      },
    },

    {
      headerName: 'Status',
      field: 'status',
      filter: 'agSetColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        values: ['Draft', 'Rejected', 'Unpaid', 'Partial','Paid','Submitted','Reviewed'],
        defaultToNothingSelected: true,
        suppressSorting: true,
        suppressSelectAll: true,
        suppressAndOrCondition: true,
      },
    }
  ];

  ngOnInit() {
    
    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 40,
      headerHeight: 35,
      context: "double click to view Detail",
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

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  addPayrollTransaction() {
    this.router.navigate(["/" + PAYROLL_TRANSACTION.CREATE])
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/' + PAYROLL_TRANSACTION.ID_BASED_ROUTE('details', event.data.id)]);
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getPayrollTransactions(params);
     if(isEmpty(res.result)) {  
      this.gridApi.showNoRowsOverlay() 
    } else {
      this.gridApi.hideOverlay();
    }
    // if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'payrollTransactionPageName');
     this.cdRef.detectChanges();
   },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getPayrollTransactions(params: any): Promise<IPaginationResponse<IPayrollTransaction[]>> {
    const result = await this.payrollTransactionService.getRecords(params).toPromise()
    return result
  }

  // onGridReady(params: GridReadyEvent) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   params.api.setDatasource(this.dataSource);
  // }

  // async getPayrollTransactions(params: any): Promise<IPaginationResponse<IPayrollTransaction[]>> {
  //   const result = await this.payrollTransactionService.getPayrollTransactions(params).toPromise()
  //   return result
  // }

  // dataSource = {
  //   getRows: async (params: any) => {
  //    const res = await this.getPayrollTransactions(params);

  //    if(isEmpty(res.result)) { 
  //     this.gridApi.showNoRowsOverlay() 
  //   } else {
  //    this.gridApi.hideOverlay();
  //   }
  //    //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
  //    params.successCallback(res.result || 0, res.totalRecords);
  //    this.paginationHelper.goToPage(this.gridApi, 'payrollTransactionPageName')
  //    this.cdRef.detectChanges();
  //  },
  // };
}









