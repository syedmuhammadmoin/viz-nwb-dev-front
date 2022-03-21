import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { WarehouseService} from '../services/warehouse.service';
import { ColDef, FirstDataRenderedEvent, GridOptions, RowDoubleClickedEvent} from 'ag-grid-community';
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
    {headerName: 'Name', field: 'name', sortable: true, filter: true , tooltipField: 'name'},
    {headerName: 'Country', field: 'country', sortable: true, filter: true, tooltipField: 'name'},
    {headerName: 'State', field: 'state', sortable: true, filter: true, tooltipField: 'name'},
    {headerName: 'City', field: 'city', sortable: true, filter: true, tooltipField: 'name'},
    {headerName: 'Manager', field: 'manager', sortable: true, filter: true, tooltipField: 'name'},
    {headerName: 'Department', field: 'departmentName', sortable: true, filter: true, tooltipField: 'name'},
  ];

  ngOnInit() {

    this.getWarehouses()

    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};
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
     this.getWarehouses()
    });
  }

  getWarehouses() : void {
    this.warehouseService.getWarehouses().subscribe((res: IPaginationResponse<IWarehouse[]>) => {
      this.warehouseList = res.result;
      this.cdRef.detectChanges()
    })
  }
}
