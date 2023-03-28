import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/Dialog'
import { CustomTooltipComponent } from '../../../../shared/components/custom-tooltip/custom-tooltip.component';
import { Router } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DepreciationMethod, Permissions } from 'src/app/views/shared/AppEnum';
import { IDepreciation } from '../model/IDepreciation';
import { DepreciationMethodService } from '../service/depreciation-method.service';
import { CreateDepreciationComponent } from '../create-depreciation/create-depreciation.component';
import { isEmpty } from 'lodash';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';

@Component({
  selector: 'kt-list-depreciation',
  templateUrl: './list-depreciation.component.html',
  styleUrls: ['./list-depreciation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListDepreciationComponent extends AppComponentBase implements OnInit {

  defaultColDef: ColDef;
  gridOptions: GridOptions;
  depreciationList: IDepreciation[];
  frameworkComponents: {[p: string]: unknown};
  tooltipData: string = "double click to view detail"
  public permissions = Permissions
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  // Injecting dependencies
  constructor(
    private depreciationService: DepreciationMethodService,
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
      headerName: 'Model Name',
      field: 'modelName',
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
      headerName: 'UseFull Life',
      field: 'useFullLife',
      tooltipField: 'name',
      suppressMenu: true,
    },
    {
      headerName: 'Model Type',
      field: 'modelType',
      tooltipField: 'name',
      suppressMenu: true,
      valueFormatter: (params: ValueFormatterParams) => {
        return DepreciationMethod[params.value];
      }
    },
    {
      headerName: 'Declining Rate (%)',
      field: 'decliningRate',
      suppressMenu: true,
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value ?? 'N/A'
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

  addDepreciationModel() {
    this.router.navigate(['/depreciation-method/create'])
  }

  onRowDoubleClicked(event : RowDoubleClickedEvent){
    this.openDialog(event.data.id)
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateDepreciationComponent, {
      width: '800px',
      data: id
    });
    // Recalling getBankAccounts function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setDatasource(this.dataSource)
      this.cdRef.detectChanges();
    });
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getAssetCategories(params);
     if(isEmpty(res.result)) {
      this.gridApi.showNoRowsOverlay()
    } else {
      this.gridApi.hideOverlay();
    }
    // if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'depreciationPageName');
     this.cdRef.detectChanges();
   },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getAssetCategories(params: any): Promise<IPaginationResponse<IDepreciation[]>> {
    const result = await this.depreciationService.getRecords(params).toPromise()
    return result
  }

  // onGridReady(params: GridReadyEvent) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;

  //   // var dataSource = {
  //   //   getRows: (params: any) => {
  //   //     this.depreciationService.getRecords(params).subscribe((data) => {
  //   //       if(isEmpty(data.result)) {
  //   //         this.gridApi.showNoRowsOverlay()
  //   //       } else {
  //   //         this.gridApi.hideOverlay();
  //   //       }
  //   //       params.successCallback(data.result || 0, data.totalRecords);
  //   //       this.paginationHelper.goToPage(this.gridApi, 'journalEntryPageName')
  //   //       this.cdRef.detectChanges();
  //   //     });
  //   //   },
  //   // };
  //   // params.api.setDatasource(dataSource);
  // }

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
