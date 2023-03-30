import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent} from 'ag-grid-community';
import { isEmpty } from 'lodash';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {CustomTooltipComponent} from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { CreateSubjectComponent } from '../create-subject/create-subject.component';
import { ISubject } from '../model/ISubject';
import { SubjectService } from '../service/subject.service';

@Component({
  selector: 'kt-list-subject',
  templateUrl: './list-subject.component.html',
  styleUrls: ['./list-subject.component.scss']
})
export class ListSubjectComponent extends AppComponentBase implements OnInit {

  // Loader
    isLoading: boolean;
  
  // For AG Grid..
    SubjectList: ISubject[];
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
      private subjectService: SubjectService,
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
        headerName: 'Subject',
        field: 'name',
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
        headerName: 'Qualification',
        field: 'qualification',
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
  
    getAllSubject() {
      this.subjectService.getSubjectDropdown().subscribe((res) => {
        this.SubjectList = res.result;
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
      const dialogRef = this.dialog.open(CreateSubjectComponent, {
        width: '740px',
        data: id
      });
  
      //Getting Updated Data
      dialogRef.afterClosed().subscribe(() => {
        this.gridApi.setDatasource(this.dataSource)
        this.cdRef.detectChanges();
      })
    };
  
  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getSubject(params);
      console.log(res, 'this is datasource');
      if (isEmpty(res.result)) {
        this.gridApi.showNoRowsOverlay()
      } else {
        this.gridApi.hideOverlay();
      }
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'SubjectPageName');
      this.cdRef.detectChanges();
    },
  };
  
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }
  
  async getSubject(params: any): Promise<IPaginationResponse<ISubject[]>> {
    const result = await this.subjectService.getRecords(params).toPromise()
    console.log(result , "this is geREcord result");
    return result
  }
  
  }
  
