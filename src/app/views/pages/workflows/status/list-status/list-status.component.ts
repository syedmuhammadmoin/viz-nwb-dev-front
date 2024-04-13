import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { isEmpty } from 'lodash';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { CreateStatusComponent } from '../create-status/create-status.component';
import { IStatus } from '../model/IStatus';
import { StatusService } from '../service/status.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'kt-list-status',
  templateUrl: './list-status.component.html',
  styleUrls: ['./list-status.component.scss']
})
  
export class ListStatusComponent extends AppComponentBase implements OnInit {

  gridOptions: any;
  defaultColDef: any;
  tooltipData: string = "double click to edit"
  statusList: IStatus[] = [];
  
  components: any;
  public permissions = Permissions
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  columnDefs = [
    { 
      headerName: 'Status', 
      field: 'status', 
      tooltipField: 'status', 
      cellRenderer: "loadingCellRenderer",
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
     },
    {
      headerName: 'State',
      field: 'state',
      suppressHeaderMenuButton: true,
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
      rowHeight: 30,
      headerHeight: 35,
      paginationPageSizeSelector: false,
      context: "double click to edit",
    };

    

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 150,
      filter: 'agSetColumnFilter',
      sortable: false,
      resizable: true,
      cellStyle: (params: ICellRendererParams) => {
        return (params?.data?.state === 1 || params?.data?.state === 5) ? {'pointer-events': 'none', 'color': '#87837e'} : null;
      }
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

    if(!this.permission.isGranted(this.permissions.STATUS_EDIT)) {
      this.gridOptions.context = 'Status'
    }
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
    if(this.permission.isGranted(this.permissions.STATUS_EDIT)) {
      if(event.data.state !== 1 && event.data.state !== 5){
        this.addStatusDialog(event.data.id)
      }
    }
  }

  addStatusDialog(id?: number) {
    const dialogRef = this.dialog.open(CreateStatusComponent, {
      width: '740px',
      data: id
    });
    //Getting Updated Data
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setGridOption('datasource', this.dataSource);
      this.cdRef.detectChanges();
    })
  }

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getStatuses(params);
      if(isEmpty(res.result)) {  
        this.gridApi.showNoRowsOverlay() 
      } else {
        this.gridApi.hideOverlay();
      }
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'statusPageName');
      this.cdRef.detectChanges();
    },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }

  async getStatuses(params: any): Promise<IPaginationResponse<IStatus[]>> {
    const result = await firstValueFrom(this.statusService.getRecords(params));
    return result
  }
}
