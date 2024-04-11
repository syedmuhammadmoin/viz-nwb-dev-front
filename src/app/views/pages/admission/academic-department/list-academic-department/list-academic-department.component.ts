import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent} from 'ag-grid-community';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {CustomTooltipComponent} from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import {CreateAcademicDepartmentComponent} from '../create-academic-department/create-academic-department.component';
import {IAcademicDepartment} from '../model/IAcademicDepartment';
import { AcademicDepartmentService } from '../service/academic-department.service';
import { isEmpty } from 'lodash';

@Component({
  selector: 'kt-list-academic-department',
  templateUrl: './list-academic-department.component.html',
  styleUrls: ['./list-academic-department.component.scss']
})
export class ListAcademicDepartmentComponent extends AppComponentBase implements OnInit {


// Loader
  isLoading: boolean;

// For AG Grid..
  DepartmentList: IAcademicDepartment[];
  gridOptions: any;
  defaultColDef: ColDef;
  public permissions = Permissions;
  
  tooltipData = 'double click to view detail'
  components: any;
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

// Injecting Dependencies
  constructor(
    private academicDepartmentService:AcademicDepartmentService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ((
      {
        context: {componentParent: this}
      }
    ) as GridOptions);
  }


// Defining AG Grid Columns

  columnDefs = [
    {
      headerName: 'Name',
      field: 'name',
      tooltipField: 'faculty',
      cellRenderer: 'loadingCellRenderer',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Faculty',
      field: 'faculty',
      tooltipField: 'faculty',
      cellRenderer: 'loadingCellRenderer',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    }
  ];

  ngOnInit() {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: 'infinite',
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      paginationPageSizeSelector: false,
      context: 'double click to view detail'
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
      loadingCellRenderer (params: any) {
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
    if(event.data.state !== 1 && event.data.state !== 5){
      this.openDialog(event.data.id)
    }
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateAcademicDepartmentComponent, {
      width: '740px',
      data: id
    });

    //Getting Updated Data
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setDatasource(this.dataSource)
      this.cdRef.detectChanges();
    })
  }

dataSource = {
  getRows: async (params: any) => {
    const res = await this.getAcademicDepartment(params);
    if (isEmpty(res.result)) {
      this.gridApi.showNoRowsOverlay()
    } else {
      this.gridApi.hideOverlay();
    }
    params.successCallback(res.result || 0, res.totalRecords);
    this.paginationHelper.goToPage(this.gridApi, 'AcademicDepartmentPageName');
    this.cdRef.detectChanges();
  },
};

onGridReady(params: GridReadyEvent) {
  this.gridApi = params.api;
  this.gridColumnApi = params.columnApi;
  params.api.setDatasource(this.dataSource);
}

async getAcademicDepartment(params: any): Promise<IPaginationResponse<IAcademicDepartment[]>> {
  const result = await this.academicDepartmentService.getRecords(params).toPromise()
  return result
}

}
