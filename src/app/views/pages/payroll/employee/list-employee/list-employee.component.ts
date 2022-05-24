import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { EMPLOYEE } from 'src/app/views/shared/AppRoutes';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { EmployeeService } from '../service/employee.service';

@Component({
  selector: 'kt-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.scss']
})

export class ListEmployeeComponent extends AppComponentBase implements OnInit {

  employeeList: [];
  defaultColDef: ColDef;
  frameworkComponents: {[p: string]: unknown};
  gridOptions: GridOptions;
  tooltipData: string = "double click to view detail"
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  constructor(
    private employeeService: EmployeeService,
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
    { headerName: 'Name', field: 'name', sortable: true, filter: true,  cellRenderer: "loadingCellRenderer" , tooltipField: 'name' },
    { headerName: 'Cnic', field: 'cnic', sortable: true, filter: true, tooltipField: 'name' },
    { headerName: 'Designation', field: 'designationName', sortable: true, filter: true, tooltipField: 'name' },
    { headerName: 'Department', field: 'departmentName', sortable: true, filter: true, tooltipField: 'name' },
    { headerName: 'Faculty', field: 'faculty', sortable: true, filter: true, tooltipField: 'name' },
    { headerName: 'Shift', field: 'dutyShift', sortable: true, filter: true, tooltipField: 'name' },
    {
      headerName: 'Active',
      field: 'status',
      sortable: true,
      filter: true,
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => { 
        return (params.value === 'active') ? "Yes" : "No"
      }
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
      context: "double click to view detail",
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

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/' + EMPLOYEE.ID_BASED_ROUTE('details', event.data.id)]);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getEmployees(params: any): Promise<IPaginationResponse<[]>> {
    const result = await this.employeeService.getEmployees(params).toPromise()
    return result
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getEmployees(params);

     if (!res.result) { 
      this.gridApi.showNoRowsOverlay() 
    } else {
     this.gridApi.hideOverlay();
    }
     //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'employeePageName')
     this.cdRef.detectChanges();
   },
  };
}






