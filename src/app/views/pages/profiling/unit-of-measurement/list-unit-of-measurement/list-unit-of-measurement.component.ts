import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { isEmpty } from 'lodash';
import { IUnitOfMeasurement } from '../model/IUnitOfMeasurement';
import { UnitOfMeasurementService } from '../service/unit-of-measurement.service';
import { CreateUnitOfMeasurementComponent } from '../create-unit-of-measurement/create-unit-of-measurement.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'kt-list-unit-of-measurement',
  templateUrl: './list-unit-of-measurement.component.html',
  styleUrls: ['./list-unit-of-measurement.component.scss']
})

export class ListUnitOfMeasurementComponent extends AppComponentBase implements OnInit {

  unitOfMeasurementList : IUnitOfMeasurement[];
  gridOptions : GridOptions;
  defaultColDef : ColDef;
  components: any;
  public permissions = Permissions
  gridApi: GridApi; 
  overlayNoRowsTemplate = '<span style="padding: 8px; border-radius: 5px; border: 1px solid #D3D3D3; background: white;">No Rows !</span>';

  // constructor
  constructor( 
               private unitOfMeasurementService: UnitOfMeasurementService,
               public dialog: MatDialog,
               private cdRef: ChangeDetectorRef,
               injector: Injector
             ) {
               super(injector)
                this.gridOptions = <GridOptions>({ context : { componentParent : this } } );
               }

  //Defining unit Columns
  columnDefs = [
    { 
      headerName: 'Unit', 
      field: 'name', 
      tooltipField: 'name',
      cellRenderer: "loadingCellRenderer",
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

    if(!this.permission.isGranted(this.permissions.UNIT_OF_MEASUREMENT_EDIT)) {
      this.gridOptions.context = 'double click to view detail'
    }
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
    const dialogRef = this.dialog.open(CreateUnitOfMeasurementComponent, {
      width: '500px',
      data: id
    });
    //Getting Updated Data
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setGridOption('datasource', this.dataSource);
      this.cdRef.detectChanges();
    });
  }

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getUnitOfMeasurements(params);
      if(isEmpty(res.result)) {  
        this.gridApi.showNoRowsOverlay() 
      } else {
        this.gridApi.hideOverlay();
      }
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'unitOfMeasurementPageName');
      this.cdRef.detectChanges();
    },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }

  async getUnitOfMeasurements(params: any): Promise<IPaginationResponse<IUnitOfMeasurement[]>> {
    const result = await firstValueFrom(this.unitOfMeasurementService.getRecords(params));
    return result
  }
}






