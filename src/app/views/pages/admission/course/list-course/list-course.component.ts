import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent} from 'ag-grid-community';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {CustomTooltipComponent} from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import {CreateCourseComponent} from '../create-course/create-course.component';
import {ICourse} from '../model/ICourse';
import {isEmpty} from 'lodash';
import {IPaginationResponse} from '../../../../shared/IPaginationResponse';
import {CourseService} from '../service/course.service';

@Component({
  selector: 'kt-list-course',
  templateUrl: './list-course.component.html',
  styleUrls: ['./list-course.component.scss']
})
export class ListCourseComponent extends AppComponentBase implements OnInit {

// Injecting Dependencies
  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private courseService: CourseService,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ((
      {
        context: {componentParent: this}
      }
    ) as GridOptions);
  }

// Loader
  isLoading: boolean;

// For AG Grid..
  FacultyList: ICourse[];
  gridOptions: GridOptions;
  defaultColDef: ColDef;
  public permissions = Permissions;
  frameworkComponents: { [p: string]: unknown };
  tooltipData = 'double click to view detail'
  components: { loadingCellRenderer(params: any): unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';


// Defining AG Grid Columns

  columnDefs = [
    {
      headerName: 'Sr.No',
      field: 'index',
      cellRenderer: 'loadingCellRenderer',
      suppressMenu: true,
    },
    {
      headerName: 'Course',
      field: 'name',
      tooltipField: 'course',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    /*{
      headerName: 'Course Code',
      field: 'courseCode',
      tooltipField: 'course',
      cellRenderer: 'loadingCellRenderer',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },*/
    /*{
      headerName: 'Credit Hour',
      field: 'creditHour',
      tooltipField: 'course',
      cellRenderer: 'loadingCellRenderer',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },*/
    /*{
      headerName: 'Total Marks',
      field: 'totalMarks',
      tooltipField: 'course',
      cellRenderer: 'loadingCellRenderer',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    }*/
  ];

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getCourses(params);
      if (isEmpty(res.result)) {
        this.gridApi.showNoRowsOverlay()
      } else {
        this.gridApi.hideOverlay();
      }
      if (res.result) res.result.map((data: any, i: number) => data.index = i + 1);
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'CoursePageName');
      this.cdRef.detectChanges();
    },
  };

  ngOnInit() {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: 'infinite',
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      context: 'double click to view detail',
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
      loadingCellRenderer(params: any) {
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
    this.openDialog(event.data.id)
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateCourseComponent, {
      width: '800px',
      data: id
    });
    // Getting Updated Warehouse
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setDatasource(this.dataSource)
      this.cdRef.detectChanges();
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getCourses(params: any): Promise<IPaginationResponse<ICourse[]>> {
    const result = await this.courseService.getRecords(params).toPromise()
    return result
  }

}
