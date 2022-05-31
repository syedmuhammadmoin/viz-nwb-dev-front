import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/Dialog'
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { ICampus } from '../model/ICampus';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { CampusService } from '../service/campus.service';
import { CreateCampusComponent } from '../create-campus/create-campus.component';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { isEmpty } from 'lodash';

@Component({
  selector: 'kt-list-campus',
  templateUrl: './list-campus.component.html',
  styleUrls: ['./list-campus.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListCampusComponent extends AppComponentBase implements OnInit {

  campusList : ICampus[]
  frameworkComponents : {[p: string]: unknown};
  gridOptions : GridOptions;
  defaultColDef : ColDef;
  components: any;
  gridApi: GridApi;
  gridColumnApi: any;
  public permissions = Permissions
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
   //tooltipData : string = "double click to edit"
   
  // constructor
  constructor(
    public dialog: MatDialog,
    public campusService: CampusService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) { super(injector);
      this.gridOptions = <GridOptions>(
        {
          context : { componentParent : this }
        }
      );
    }

// defaults columns
  columnDefs = [
    { 
      headerName: 'Name', 
      field: 'name', 
      sortable: true, 
      filter: true, 
      tooltipField: 'name',
      cellRenderer: "loadingCellRenderer",
     },
  ];
// implimentation of ng OnInit
  ngOnInit() { 

    // this.getCampuses()
   
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      context: "double click to edit",
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
  }
// data rendering on first
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }
// called when double clicked on record
  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.openDialog(event.data.id)
  }
// open modal funtion
  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateCampusComponent, {
      width: '800px',
      data: id
    });
    // Recalling getCampuses function on dialog close
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

  async getCampuses(params: any): Promise<IPaginationResponse<ICampus[]>> {
    const result = await this.campusService.getCampuses(params).toPromise()
    return result
  }

  dataSource = {
    getRows: async (params: any) => {
    const res = await this.getCampuses(params);

    if(isEmpty(res.result)) {  
       this.gridApi.showNoRowsOverlay() 
     } else {
      this.gridApi.hideOverlay();
     }
     //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'campusPageName')
     this.cdRef.detectChanges();
   },
  };

  // getCampuses () : void {
  //   this.campusService.getCampuses().subscribe((res: IPaginationResponse<ICampus[]>) => {
  //     this.campusList = res.result;
  //     this.cdRef.detectChanges()
  //   })
  // }
}


