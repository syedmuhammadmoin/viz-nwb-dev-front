import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { isEmpty } from 'lodash';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { EMPLOYEE } from 'src/app/views/shared/AppRoutes';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { EmployeeService } from '../service/employee.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'kt-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.scss']
})

export class ListEmployeeComponent extends AppComponentBase implements OnInit {

  employeeList: [];
  defaultColDef: ColDef;
  
  gridOptions: any;
  tooltipData: string = "double click to view detail"
  components: any;
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  constructor(
    private employeeService: EmployeeService,
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

  //Defining Employee Columns
  columnDefs = [
    {
      headerName: 'Name',
      field: 'name',
      cellRenderer: "loadingCellRenderer",
      tooltipField: 'name',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Cnic',
      field: 'cnic',
      tooltipField: 'name',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
     },
    {
      headerName: 'Designation',
      field: 'designationName',
      tooltipField: 'name',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Department',
      field: 'departmentName',
      tooltipField: 'name',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Bank Name',
      field: 'bankName',
      tooltipField: 'name',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
        valueFormatter: (params: ValueFormatterParams) => {
          return (params.value) ?? "N/A"
        }
    },
    { headerName: 'Faculty', field: 'faculty', suppressHeaderMenuButton: true, tooltipField: 'name' },
    { headerName: 'Shift', field: 'dutyShift', suppressHeaderMenuButton: true, tooltipField: 'name' },
    {
      headerName: 'Active',
      field: 'isActive',
      tooltipField: 'name',
      filter: 'agSetColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          values: ['Yes', 'No'],
          defaultToNothingSelected: true,
          suppressAndOrCondition: true,
        },
      valueFormatter: (params: ValueFormatterParams) => {
        return (params.value) ? "Yes" : "No"
      }
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
      context: "double click to view detail",
      paginationPageSizeSelector: false
    };

    

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 150,
      filter: 'agSetColumnFilter',
      sortable: false,
      resizable: true
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

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(['/' + EMPLOYEE.ID_BASED_ROUTE('details', event.data.id)]);
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getEmployees(params);
     if(isEmpty(res.result)) {
      this.gridApi.showNoRowsOverlay()
    } else {
      this.gridApi.hideOverlay();
    }
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'employeePageName');
     this.cdRef.detectChanges();
   },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }

  async getEmployees(params: any): Promise<IPaginationResponse<[]>> {
    const result = await firstValueFrom(this.employeeService.getRecords(params));
    return result
  }
}
