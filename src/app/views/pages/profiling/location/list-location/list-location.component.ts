import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LocationService } from '../service/location.service';
import { ColDef, FirstDataRenderedEvent, GridOptions, RowDoubleClickedEvent } from 'ag-grid-community';
import { MatDialog } from "@angular/material/dialog";
import { CreateLocationComponent } from '../create-location/create-location.component';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { ILocation } from '../model/ILocation';

@Component({
  selector: 'kt-list-location',
  templateUrl: './list-location.component.html',
  styleUrls: ['./list-location.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListLocationComponent implements OnInit {

  locationList : ILocation[];
  frameworkComponents : {[p: string]: unknown};
  gridOptions : GridOptions;
  defaultColDef : ColDef;
  tooltipData : string = "double click to edit"

  constructor(private _locationService: LocationService,
               private cdRef: ChangeDetectorRef,
               public  dialog: MatDialog
             ) {
                 this.gridOptions = <GridOptions>(
                  { 
                    context : { componentParent : this } 
                  }
                 );
               }

  columnDefs = [
    {headerName: 'Name', field: 'name', sortable: true, filter: true, tooltipField: 'name'},
    {headerName: 'Dimensions', field: 'dimensions', sortable: true, filter: true, tooltipField: 'name'},
    {headerName: 'Supervisor', field: 'supervisor', sortable: true, filter: true, tooltipField: 'name'},
    {headerName: 'Warehouse', field: 'warehouseName', sortable: true, filter: true, tooltipField: 'name'},
  ];

  ngOnInit() {

    this.getLocations()
    
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
    const dialogRef = this.dialog.open(CreateLocationComponent, {
      width: '800px',
      data: id
    });
    // Recalling getLocations function on dialog close
    dialogRef.afterClosed().subscribe(() => {
     this.getLocations()
    });
  }

  getLocations() : void {
    this._locationService.getLocations().subscribe((res: IPaginationResponse<ILocation[]>) => {
      this.locationList = res.result;
      this.cdRef.detectChanges()
    })
  }
}
