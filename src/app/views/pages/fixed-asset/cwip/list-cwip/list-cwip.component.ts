

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/Dialog'
import { CustomTooltipComponent } from '../../../../shared/components/custom-tooltip/custom-tooltip.component';
import { Router } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AssetType, Permissions } from 'src/app/views/shared/AppEnum';
import { ICwip } from '../model/ICwip';
import { CwipService } from '../service/cwip.service';
import { CWIP } from 'src/app/views/shared/AppRoutes';
import { isEmpty } from 'lodash';
import { CreateCwipComponent } from '../create-cwip/create-cwip.component';


@Component({
  selector: 'kt-list-cwip',
  templateUrl: './list-cwip.component.html',
  styleUrls: ['./list-cwip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListCwipComponent extends AppComponentBase implements OnInit {

  defaultColDef: ColDef;
  gridOptions: GridOptions;
  cwipList: ICwip[];
  frameworkComponents: {[p: string]: unknown};
  tooltipData: string = "double click to view detail"
  public permissions = Permissions
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
  
  // Injecting dependencies
  constructor(
    private cwipService: CwipService,
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
      headerName: 'Code', 
      field: 'assetCode', 
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
      headerName: 'Name', 
      field: 'name', 
      tooltipField: 'name', 
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    { 
      headerName: 'Type', 
      field: 'assetType', 
      tooltipField: 'name', 
      suppressMenu: true,
      valueFormatter: (params: ValueFormatterParams) => { 
        return AssetType[params.value];
      }
    },
    {
      headerName: 'Acquisition Date',
      field: 'acquisitionDate',
      tooltipField: 'name',
      filter: 'agDateColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['equals'],
          suppressAndOrCondition: true,
        },
      valueFormatter: (params: ValueFormatterParams) => { 
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    { 
      headerName: 'Model', 
      field: 'depreciationModelName', 
      tooltipField: 'name', 
      suppressMenu: true
    },
    { 
      headerName: 'Asset Category', 
      field: 'categoryName', 
      tooltipField: 'name', 
      suppressMenu: true
    },
    { 
      headerName: 'Useful Life', 
      field: 'usefulLife', 
      tooltipField: 'name', 
      suppressMenu: true
    },
    { 
      headerName: 'Account', 
      field: 'correspondingAccountName', 
      tooltipField: 'name', 
      suppressMenu: true
    }
  ];


  ngOnInit() {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 40,
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
    this.router.navigate(['/' + CWIP.ID_BASED_ROUTE('details' , event.data.id)])
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateCwipComponent, {
      width: '800px',
      data: id
    });
    // Recalling getBusinessPartners function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setDatasource(this.dataSource)
      this.cdRef.detectChanges();
    });
  }

  // addAsset() {
  //   this.router.navigate(['/' + INVOICE.CREATE])
  // }


  dataSource = {
    getRows: (params: any) => {
      // this.assetService.getRecords(params).subscribe((data) => {
      //   if(isEmpty(data.result)) {  
      //     this.gridApi.showNoRowsOverlay() 
      //   } else {
      //     this.gridApi.hideOverlay();
      //   }
      //   params.successCallback(data.result || 0, data.totalRecords);
      //   this.paginationHelper.goToPage(this.gridApi, 'assetPageName')
      //   this.cdRef.detectChanges();
      // });
    },
  };

  

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

 

  // onGridReady(params: GridReadyEvent) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   params.api.setDatasource(this.dataSource);
  // }

  // async getJournalEntries(params: any): Promise<IPaginationResponse<IJournalEntry[]>> {
  //   const result = await this.journalEntryService.getJournalEntries(params).toPromise()
  //   return result
  // }

  // dataSource = {
  //   getRows: async (params: any) => {
  //    const res = await this.getJournalEntries(params)

  //    if(isEmpty(res.result)) { 
  //     this.gridApi.showNoRowsOverlay() 
  //   } else {
  //    this.gridApi.hideOverlay();
  //   }
  //    //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
  //    params.successCallback(res.result || 0, res.totalRecords);
  //    this.paginationHelper.goToPage(this.gridApi, 'journalEntryPageName')
  //    this.cdRef.detectChanges();
  //  },
  // };
  
}
















