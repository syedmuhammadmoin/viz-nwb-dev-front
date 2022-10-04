import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/Dialog'
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions, TaxType } from 'src/app/views/shared/AppEnum';
import { isEmpty } from 'lodash';
import { ITax } from '../model/ITax';
import { TaxService } from '../service/tax.service';
import { CreateTaxComponent } from '../create-tax/create-tax.component';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';

@Component({
  selector: 'kt-list-tax',
  templateUrl: './list-tax.component.html',
  styleUrls: ['./list-tax.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListTaxComponent extends AppComponentBase implements OnInit {

  taxList : ITax[]
  frameworkComponents : {[p: string]: unknown};
  gridOptions : GridOptions;
  defaultColDef : ColDef;
  tooltipData : string = "double click to edit"
  components: { loadingCellRenderer (params: any ) : unknown };
  public permissions = Permissions
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span style="padding: 8px; border-radius: 5px; border: 1px solid #D3D3D3; background: white;">No Rows !</span>';

  // constructor
  constructor( 
               private taxService: TaxService,
               public dialog: MatDialog,
               private cdRef: ChangeDetectorRef,
               injector: Injector
             ) {
               super(injector)
                this.gridOptions = <GridOptions>({ context : { componentParent : this } } );
               }
// defaults columns
  columnDefs = [
    { 
      headerName: 'Name', 
      field: 'name', 
      tooltipField: 'name',
      cellRenderer: "loadingCellRenderer",
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
     },
    { 
      headerName: 'Type', 
      field: 'taxType', 
      suppressMenu: true, 
      tooltipField: 'name',
      valueFormatter: (params : ValueFormatterParams) => {
        return TaxType[params.value]
      }

    },
    { headerName: 'Account', 
      field: 'accountName', 
      suppressMenu: true, 
      tooltipField: 'name',
      valueFormatter: (params : ValueFormatterParams) => {
        return params.value ?? ' - '
      }
    },
  ];
// implimentation of ng OnInit
  ngOnInit() { 
   
    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 30,
      headerHeight: 35,
      context: "double click to edit",
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
      loadingCellRenderer: function (params: any) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },
    };

    if(!this.permission.isGranted(this.permissions.TAXES_EDIT)) {
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
    const dialogRef = this.dialog.open(CreateTaxComponent, {
      width: '800px',
      data: id
    });
    // Recalling getTaxes function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setDatasource(this.dataSource)
      this.cdRef.detectChanges();
    });
  }

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getTaxes(params);
      if(isEmpty(res.result)) {  
        this.gridApi.showNoRowsOverlay() 
      } else {
        this.gridApi.hideOverlay();
      }
      // if (res.result) res.result.map((data: any, i: number) => data.index = i + 1)
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'taxPageName');
      this.cdRef.detectChanges();
    },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getTaxes(params: any): Promise<IPaginationResponse<ITax[]>> {
    const result = await this.taxService.getRecords(params).toPromise()
    return result
  }
}






