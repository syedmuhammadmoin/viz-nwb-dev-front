import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/Dialog'
import { CustomTooltipComponent } from '../../../../shared/components/custom-tooltip/custom-tooltip.component';
import { Router } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import {  Permissions } from 'src/app/views/shared/AppEnum';
import { IDisposal } from '../model/IDisposal';
// import { CwipService } from '../service/cwip.service';
// import { CWIP } from 'src/app/views/shared/AppRoutes';
import { isEmpty } from 'lodash';
import { DisposalService } from '../service/disposal.service';
import { DISPOSAL } from 'src/app/views/shared/AppRoutes';
import { CreateDisposalComponent } from '../create-disposal/create-disposal.component';
// import { CreateCwipComponent } from '../create-cwip/create-cwip.component';


@Component({
  selector: 'kt-list-disposal',
  templateUrl: './list-disposal.component.html',
  styleUrls: ['./list-disposal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListDisposalComponent extends AppComponentBase implements OnInit {

  defaultColDef: ColDef;
  gridOptions: GridOptions;
  disposalList: IDisposal[];
  frameworkComponents: {[p: string]: unknown};
  tooltipData: string = "double click to view detail"
  public permissions = Permissions
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
  
  // Injecting dependencies
  constructor(
    private disposalService: DisposalService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    injector: Injector
  ) {
    super(injector);
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  // Declaring AgGrid data
  columnDefs = [
    { 
      headerName: 'Doc No', 
      field: 'cwipCode', 
      tooltipField: 'name', 
      cellRenderer: "loadingCellRenderer",
    },
    { 
      headerName: 'Acquisition Date', 
      field: 'dateOfAcquisition', 
      tooltipField: 'name', 
      suppressMenu: true,
      valueFormatter: (params: ValueFormatterParams) => { 
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    { 
      headerName: 'Asset Cost', 
      field: 'costOfAsset', 
      tooltipField: 'name',
      valueFormatter: (params : ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      } 
      
    },
    {
      headerName: 'Asset Account',
      field: 'assetAccount',
      tooltipField: 'name',
    },
    {
      headerName: 'Quantinty',
      field: 'quantinty',
      tooltipField: 'name',
      valueFormatter: (params : ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Salvage Value',
      field: 'salvageValue',
      tooltipField: 'name',
      valueFormatter: (params : ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Dep Applicability',
      field: 'depreciationApplicability',
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value){
          return 'Applicable'
        }
        else{
          return 'Not Applicable'
        }
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      tooltipField: 'name',
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
      context: "double click to view detail",
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
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event : RowDoubleClickedEvent){
    this.router.navigate(['/' + DISPOSAL.ID_BASED_ROUTE('details' , event.data.id)])
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateDisposalComponent, {
      width: '800px',
      data: id
    });

    // Recalling getBusinessPartners function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setDatasource(this.dataSource)
      this.cdRef.detectChanges();
    });
  }

  dataSource = {
    getRows: (params: any) => {
      // this.disposalService.getRecords(params).subscribe((data) => {
      //   if(isEmpty(data.result)) {  
      //     this.gridApi.showNoRowsOverlay() 
      //   } else {
      //     this.gridApi.hideOverlay();
      //   }
      //   params.successCallback(data.result || 0, data.totalRecords);
      //   this.paginationHelper.goToPage(this.gridApi, 'disposalPageName')
      //   this.cdRef.detectChanges();
      // });
    },
  };

  

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }
  
}
















