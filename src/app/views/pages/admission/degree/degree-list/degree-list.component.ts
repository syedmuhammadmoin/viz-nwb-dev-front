import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellStyle, ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { isEmpty } from 'lodash';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { CreateDegreeComponent } from '../create-degree/create-degree.component';
import { IDegree } from '../model/IDegree';
import { DegreeService } from '../service/degree.service';

@Component({
  selector: 'kt-degree-list',
  templateUrl: './degree-list.component.html',
  styleUrls: ['./degree-list.component.scss']
})
export class DegreeListComponent extends AppComponentBase implements OnInit {

  // Loader
    isLoading: boolean;
  
  // For AG Grid..
    DegreeList: IDegree[];
    gridOptions: GridOptions;
    defaultColDef: ColDef;
    public permissions = Permissions;
    frameworkComponents: { [p: string]: unknown };
    tooltipData = 'double click to view detail'
    components: { loadingCellRenderer(params: any): unknown };
    gridApi: GridApi;
    gridColumnApi: ColumnApi;
    overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
  
  // Injecting Dependencies
    constructor(
      private degreeService:DegreeService,
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
        headerName: 'Sno',
        valueGetter: 'node.rowIndex + 1',
        tooltipField: 'name',
        cellRenderer: 'loadingCellRenderer',
        filter: 'agTextColumnFilter',
        menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
      },
      {
        headerName: 'Degree',
        field: 'name',
        tooltipField: 'name',
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
        context: 'double click to view detail',
      };
  
      this.frameworkComponents = {customTooltip: CustomTooltipComponent};
  
      this.defaultColDef = {
        tooltipComponent: 'customTooltip',
        flex: 1,
        minWidth: 150,
        filter: 'agSetColumnFilter',
        resizable: true,
        cellStyle: (params: ValueFormatterParams) => {
          return (params?.data?.state === 1 || params?.data?.state === 5) ? {'pointer-events': 'none', 'color': '#87837e'} : null;
        }
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

    getAllDegree() {
      this.degreeService.getDegreeDropdown().subscribe((res) => {
        this.DegreeList = res.result;
        this.cdRef.detectChanges()
      });
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
      const dialogRef = this.dialog.open(CreateDegreeComponent, {
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
      const res = await this.getDegree(params);
      if (isEmpty(res.result)) {
        this.gridApi.showNoRowsOverlay()
      } else {
        this.gridApi.hideOverlay();
      }
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'DegreePageName');
      this.cdRef.detectChanges();
    },
  };
  
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }
  
  async getDegree(params: any): Promise<IPaginationResponse<IDegree[]>> {
    const result = await this.degreeService.getRecords(params).toPromise()
    return result
  }
  
}
  
