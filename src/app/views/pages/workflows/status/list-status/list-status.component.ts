import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { isEmpty } from 'lodash';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { CreateStatusComponent } from '../create-status/create-status.component';
import { IStatus } from '../model/IStatus';
import { StatusService } from '../service/status.service';

@Component({
  selector: 'kt-list-status',
  templateUrl: './list-status.component.html',
  styleUrls: ['./list-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
  
export class ListStatusComponent extends AppComponentBase implements OnInit {

  gridOptions: any;
  defaultColDef: any;
  tooltipData: string = "double click to edit"
  statusList: IStatus[] = [];
  frameworkComponents: any;
  components: { loadingCellRenderer (params: any ) : unknown };
  public permissions = Permissions
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  columnDefs = [
    //{ headerName: "S.No", valueGetter: 'node.rowIndex + 1', tooltipField: 'status', cellRenderer: "loadingCellRenderer" },
    { headerName: 'Status', field: 'status', sortable: true, filter: true, tooltipField: 'status', cellRenderer: "loadingCellRenderer" },
    {
      headerName: 'State',
      field: 'state',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      valueFormatter: (params: ValueFormatterParams) => { 
        return (params.value) ? AppConst.DocStatus[params.value].viewValue : null
       }
    },
  ]


  constructor(
    injector: Injector,
    private statusService: StatusService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    super(injector)
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  ngOnInit() {
    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 40,
      headerHeight: 35,
      context: "double click to edit",
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

  getAllStatus() {
    this.statusService.getStatusesDropdown().subscribe((res) => {
      this.statusList = res.result;
      this.cdRef.detectChanges()
    });
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.addStatusDialog(event.data.id)
  }

  addStatusDialog(id?: number) {
    const dialogRef = this.dialog.open(CreateStatusComponent, {
      width: '740px',
      data: id
    });
    // Recalling getStates function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setDatasource(this.dataSource)
      this.cdRef.detectChanges();
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getStatuses(params: any): Promise<IPaginationResponse<IStatus[]>> {
    const result = await this.statusService.getStatuses(params).toPromise()
    return result
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getStatuses(params);

     if(isEmpty(res.result)) {  
      this.gridApi.showNoRowsOverlay() 
    } else {
     this.gridApi.hideOverlay();
    }
     //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'statusPageName')
     this.cdRef.detectChanges();
   },
  };

}
