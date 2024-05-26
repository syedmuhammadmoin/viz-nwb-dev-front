import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog'
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
  gridOptions: any;
  disposalList: IDisposal[];
  FilteredData: any[]=[];
  tooltipData: string = "double click to view detail"
  public permissions = Permissions
  components: any;
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  // Injecting dependencies
  constructor(
    private disposalService: DisposalService,
    private cdRef: ChangeDetectorRef,
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
      field: 'docNo',
      tooltipField: 'name',
      cellRenderer: "loadingCellRenderer",
    },
    {
      headerName: 'Disposal Date',
      field: 'disposalDate',
      tooltipField: 'name',
      suppressHeaderMenuButton: true,
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    {
      headerName: 'Asset Account',
      field: 'fixedAsset',
      tooltipField: 'name',
    },
    {
      headerName: 'Book Value',
      field: 'bookValue',
      tooltipField: 'name',
      valueFormatter: (params : ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }

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
      context: "double click to view detail",
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
      this.gridApi.setGridOption('datasource', this.dataSource);
      this.cdRef.detectChanges();
    });
  }

  dataSource = {
    getRows: (params: any) => {
      this.disposalService.getRecords(params).subscribe((data) => {
        if(isEmpty(data.result)) {
          this.gridApi.showNoRowsOverlay()
        } else {
          this.FilteredData = data.result
          this.gridApi.hideOverlay();
        }
        params.successCallback(this.FilteredData || 0, data.totalRecords);
        this.paginationHelper.goToPage(this.gridApi, 'disposalPageName')
        this.cdRef.detectChanges();
      });
    },
  };



  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }

  
  fetchData(x: any) {           
    const dataSource = {
      getRows: (params: any) => {        
        this.disposalService.getRecordByYearMonth(x.startDate ,x.endDate )
          .subscribe((data) => {
            if (isEmpty(data.result)) {
              this.gridApi.showNoRowsOverlay();
            } else {
              this.gridApi.hideOverlay();             
              this.FilteredData = data.result;
            }
            params.successCallback(this.FilteredData || 0 ,data.totalRecords);
            this.paginationHelper.goToPage(this.gridApi, 'purchaseOrderPageName');
            this.cdRef.detectChanges();
        });
      },
    };
    this.gridApi.setDatasource(dataSource);
}

}
