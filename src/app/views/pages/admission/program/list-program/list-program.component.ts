import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent} from 'ag-grid-community';
import {MatDialog} from '@angular/material/dialog'
import {CustomTooltipComponent} from '../../../../shared/components/custom-tooltip/custom-tooltip.component';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {Permissions} from 'src/app/views/shared/AppEnum';
import {ProgramService} from '../service/program.service';
import {PROGRAM} from 'src/app/views/shared/AppRoutes';
import {IProgram} from '../models/IProgram';
import {isEmpty} from 'lodash';

@Component({
  selector: 'kt-list-program',
  templateUrl: './list-program.component.html',
  styleUrls: ['./list-program.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListProgramComponent extends AppComponentBase implements OnInit {

  // Injecting dependencies
  constructor(
    private programService: ProgramService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    injector: Injector
  ) {
    super(injector);
    this.gridOptions = ((
      {
        context: {componentParent: this}
      }
    ) as GridOptions);
  }

  defaultColDef: ColDef;
  gridOptions: any;
  ProgramList: IProgram[];
  
  tooltipData = 'double click to view detail'
  public permissions = Permissions
  components: any;
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  // Declaring AgGrid data
  columnDefs = [
    {
      headerName: 'Program',
      cellRenderer: "loadingCellRenderer",
      field: 'name',
      tooltipField: 'name',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['equals'],
        suppressAndOrCondition: true,
      }
    },
    {
      headerName: 'Degree',
      field: 'degree',
      tooltipField: 'name',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['equals'],
        suppressAndOrCondition: true,
      }
    },
    {
      headerName: 'Academic Department',
      field: 'academicDepartment',
      tooltipField: 'name',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['equals'],
        suppressAndOrCondition: true,
      }
    },
    {
      headerName: 'Total Semesters',
      field: 'totalSemesters',
      filter: 'agNumberColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['equals'],
        suppressAndOrCondition: true,
      }
    },
  ];


  dataSource = {
    getRows: (params: any) => {
      this.programService.getRecords(params).subscribe((data) => {
        if(isEmpty(data.result)) {
          this.gridApi.showNoRowsOverlay()
        } else {
          this.gridApi.hideOverlay();
        }
        params.successCallback(data.result || 0, data.totalRecords);
        this.paginationHelper.goToPage(this.gridApi, 'ProgramPageName')
        this.cdRef.detectChanges();
      });
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
      customTooltip: CustomTooltipComponent,
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
    this.router.navigate(['/' + PROGRAM.ID_BASED_ROUTE('details', event.data.id)])
  }

  openDialog(id?: number): void {
    this.router.navigate(['/' + PROGRAM.CREATE]);
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }
}
