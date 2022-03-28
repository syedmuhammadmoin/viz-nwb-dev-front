import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { WarehouseService} from '../services/warehouse.service';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent} from 'ag-grid-community';
import { MatDialog} from "@angular/material/dialog";
import { CreateWarehouseComponent} from "../create-warehouse/create-warehouse.component";
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IWarehouse } from '../model/IWarehouse';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';

@Component({
  selector: 'kt-list-warehouse',
  templateUrl: './list-warehouse.component.html',
  styleUrls: ['./list-warehouse.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})

export class ListWarehouseComponent implements OnInit {

  warehouseList : IWarehouse[];
  frameworkComponents : {[p: string]: unknown};
  gridOptions : GridOptions;
  defaultColDef : ColDef;
  tooltipData : string = "double click to edit"
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;

  constructor( private warehouseService: WarehouseService,
               public dialog: MatDialog,
               private cdRef: ChangeDetectorRef
             ) {
                this.gridOptions = <GridOptions>(
                  { 
                    context : { componentParent : this } 
                  }
                 );
               } 

  columnDefs = [
    {
      headerName: 'Name', 
      field: 'name', 
      sortable: true, 
      filter: true , 
      tooltipField: 'name',
      cellRenderer: "loadingCellRenderer"
    },
    // {headerName: 'Country', field: 'country', sortable: true, filter: true, tooltipField: 'name'},
    // {headerName: 'State', field: 'state', sortable: true, filter: true, tooltipField: 'name'},
    // {headerName: 'City', field: 'city', sortable: true, filter: true, tooltipField: 'name'},
    {headerName: 'Manager', field: 'manager', sortable: true, filter: true, tooltipField: 'name'},
    {headerName: 'Campus', field: 'campusName', sortable: true, filter: true, tooltipField: 'name'},
  ];

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

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event : RowDoubleClickedEvent) {
    this.openDialog(event.data.id)
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateWarehouseComponent, {
      width: '800px',
      data: id
    });
    // Recalling getWarehouses function on dialog close
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

  async getWarehouses(params: any): Promise<IPaginationResponse<IWarehouse[]>> {
    const result = await this.warehouseService.getWarehouses().toPromise()
    return result
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getWarehouses(params);
     //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.cdRef.detectChanges();
   },
  };

  // getWarehouses() : void {
  //   this.warehouseService.getWarehouses().subscribe((res: IPaginationResponse<IWarehouse[]>) => {
  //     this.warehouseList = res.result;
  //     this.cdRef.detectChanges()
  //   })
  // }
}
