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
  
  gridOptions: any;
  tooltipData: string = "double click to view detail"
  components: any;
  public permissions = Permissions
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  constructor(
    private payrollTransactionService: PayrollTransactionService,
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

  //Defining Payroll Transaction Columns
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
    {
      headerName: 'Month',
      field: 'month',
      tooltipField: 'docNo',
      suppressHeaderMenuButton: true,
      valueFormatter: (params: any) => {
        return (params.value) ? AppConst.Months.find(x => x.value === params.value)?.name : 'N/A';
      },
    },
    {
      headerName: 'Year',
      field: 'year',
      tooltipField: 'docNo',
      suppressHeaderMenuButton: true
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
      headerName: 'Campus',
      field: 'campus',
      suppressHeaderMenuButton: true
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
    {
      headerName: 'Basic Salary',
      field: 'basicSalary',
      cellStyle: { 'text-align': "right" },
      suppressHeaderMenuButton: true,
      tooltipField: 'employee',
      valueFormatter: (params: any) => {
        return params.value ? this.valueFormatter(params.value) : null;
      },
    },
    {
      headerName: 'Allowance',
      field: 'totalAllowances',
      cellStyle: { 'text-align': "right" },
      suppressHeaderMenuButton: true,
      tooltipField: 'docNo',
      valueFormatter: (params: any) => {
        return params.value ? this.valueFormatter(params.value) : null;
      },
    },
    {
      headerName: 'Gross Pay',
      field: 'grossPay',
      suppressHeaderMenuButton: true,
      cellStyle: { 'text-align': "right" },
      tooltipField: 'docNo',
      valueFormatter: (params: any) => {
        return params.value ? this.valueFormatter(params.value) : null;
      },
    },
    {
      headerName: 'Deductions',
      field: 'totalDeductions',
      cellStyle: { 'text-align': "right" },
      suppressHeaderMenuButton: true,
      tooltipField: 'docNo',
      valueFormatter: (params: any) => {
        return params.value ? this.valueFormatter(params.value) : null;
      },
    },
    {
      headerName: 'Net Pay',
      field: 'netSalary',
      cellStyle: { 'text-align': "right" },
      suppressHeaderMenuButton: true,
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
      rowHeight: 30,
      headerHeight: 35,
      paginationPageSizeSelector: false,
      context: "double click to view Detail",
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
}
