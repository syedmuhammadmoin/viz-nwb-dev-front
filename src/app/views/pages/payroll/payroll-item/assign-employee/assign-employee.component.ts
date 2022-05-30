import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { PayrollItemService } from '../service/payroll-item.service';
import { EmployeeService } from '../../employee/service/employee.service'

@Component({
  selector: 'kt-assign-employee',
  templateUrl: './assign-employee.component.html',
  styleUrls: ['./assign-employee.component.scss']
})

export class AssignEmployeeComponent extends AppComponentBase implements OnInit {

  //busy loading
  isLoading: boolean

  title: string = 'Select Employee'


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
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      checkboxSelection: function(params) {
        const displayedColumns = params.columnApi.getAllDisplayedColumns();
        return displayedColumns[0] === params.column;
    },
    }

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    this.gridOptions = {
      // getRowNodeId: (data) => data.id,
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      context: "click to select employee",
    };

    this.components = {
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

  frameworkComponents : {[p: string]: unknown};
  gridOptions : GridOptions;
  defaultColDef : ColDef;
  components: any;
  gridApi: GridApi;
  gridColumnApi: any;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
   //tooltipData : string = "double click to edit"
   

// defaults columns
  columnDefs = [
    { 
      headerName: 'Name', 
      field: 'name', 
      sortable: true, 
      filter: true, 
      tooltipField: 'name',
      cellRenderer: "loadingCellRenderer",
      // headerCheckboxSelection: true,    //not supported in infinite row model 
      // headerCheckboxSelectionFilteredOnly: true,
      // checkboxSelection: true,
     },
     { 
      headerName: 'Father Name', 
      field: 'fatherName', 
      sortable: true, 
      filter: true, 
      tooltipField: 'name',
     },
     { 
      headerName: 'Cnic', 
      field: 'cnic', 
      sortable: true, 
      filter: true, 
      tooltipField: 'name',
     },
     { 
      headerName: 'Designation', 
      field: 'designationName', 
      sortable: true, 
      filter: true, 
      tooltipField: 'name',
     },
     { 
      headerName: 'Department', 
      field: 'departmentName', 
      sortable: true, 
      filter: true, 
      tooltipField: 'name',
     },
     { 
      headerName: 'Faculty', 
      field: 'faculty', 
      sortable: true, 
      filter: true
     },
     { 
      headerName: 'Shift', 
      field: 'dutyShift', 
      sortable: true, 
      filter: true
     }
  ];

// data rendering on first
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }
  

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getEmployees(params: any): Promise<IPaginationResponse<any>> {
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
     this.cdRef.detectChanges();
   },
  };
}

// set in Grip options
// getRowNodeId: (data) => data.id,

// this.griApi.getRowNodeId(id)

// this.gridApi.forEachNode((node , index) => {
//     node.setSelected(true)
// })