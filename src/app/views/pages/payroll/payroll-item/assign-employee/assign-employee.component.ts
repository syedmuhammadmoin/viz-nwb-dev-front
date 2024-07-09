import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { PayrollItemService } from '../service/payroll-item.service';
import { EmployeeService } from '../../employee/service/employee.service'
import { isEmpty } from 'lodash';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'kt-assign-employee',
  templateUrl: './assign-employee.component.html',
  styleUrls: ['./assign-employee.component.scss']
})

export class AssignEmployeeComponent extends AppComponentBase implements OnInit {

  //Loader
  isLoading: boolean

  title: string = 'Select Employee'

  //for toggle checkbox selection on all employees
  isAllEmployeesSelected: boolean = false;

  //all employee button content
  employeeSelection: string = 'Select All'


  constructor(
    public payrollItemService: PayrollItemService,
    private employeeService: EmployeeService,
    public route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    @Optional() public dialogRef: MatDialogRef<AssignEmployeeComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    injector: Injector
  ) {
    super(injector);
    this.gridOptions = <GridOptions>(
      {
        context : { componentParent : this }
      }
    );
  }

  ngOnInit() {
    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 150,
      filter: 'agSetColumnFilter',
      sortable: false,
      resizable: true,
      checkboxSelection: function(params) {
        const displayedColumns = params.api.getAllDisplayedColumns();
        return displayedColumns[0] === params.column;
    },
    }

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      context: "click to select employee",
      paginationPageSizeSelector: false
    };

    this.components = {
      customTooltip: CustomTooltipComponent,
      loadingCellRenderer: function (params) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },
    };

    if (this._id) {
      this.isLoading = true
    }
  }
  
  
  onSubmit() {
    this.dialogRef.close(this.gridApi.getSelectedRows());
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }

  gridOptions: any;
  defaultColDef : ColDef;
  components: any;
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
   

  //Defining Employee Columns
  columnDefs = [
    { 
      headerName: 'Name', 
      field: 'name', 
      tooltipField: 'name',
      cellRenderer: "loadingCellRenderer",
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
     },
     { 
      headerName: 'Father Name', 
      field: 'fatherName', 
      suppressHeaderMenuButton: true,
      tooltipField: 'name',
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
        }
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
        }
     },
     { 
      headerName: 'Faculty', 
      field: 'faculty',
      suppressHeaderMenuButton: true,
     },
     { 
      headerName: 'Shift', 
      field: 'dutyShift', 
      suppressHeaderMenuButton: true
     }
  ];

  // data rendering on first
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
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

  employeesSelectionToggle(isChecked : boolean) {
    if(isChecked) {
      this.gridApi.forEachNode(node => (node.setSelected(true) , this.employeeSelection = 'Un-Select All'))
    }
    else {
      this.gridApi.forEachNode(node => (node.setSelected(false) , this.employeeSelection = 'Select All'))
    }
  }
}
