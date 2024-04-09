import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { MatDialog} from '@angular/material/dialog';
import { CustomTooltipComponent } from '../../../../shared/components/custom-tooltip/custom-tooltip.component';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { IAsset } from '../model/IAsset';
import { AssetService } from '../service/asset.service';
import { ASSET } from 'src/app/views/shared/AppRoutes';
import { isEmpty } from 'lodash';
import { CreateAssetComponent } from '../create-asset/create-asset.component';


@Component({
  selector: 'kt-list-asset',
  templateUrl: './list-asset.component.html',
  styleUrls: ['./list-asset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListAssetComponent extends AppComponentBase implements OnInit {

  defaultColDef: ColDef;
  gridOptions: any;;
  assetList: IAsset[];
  
  tooltipData: string = "double click to view detail"
  public permissions = Permissions
  components: any;
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  // Injecting dependencies
  constructor(
    private assetService: AssetService,
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
      field: 'assetCode',
      tooltipField: 'name',
      cellRenderer: "loadingCellRenderer",
      // filter: 'agTextColumnFilter',
      // menuTabs: ['filterMenuTab'],
      //   filterParams: {
      //     filterOptions: ['contains'],
      //     suppressAndOrCondition: true,
      //   },
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
      headerName: 'Employee',
      field: 'employee',
      tooltipField: 'name',
      suppressHeaderMenuButton: true
      // filter: 'agTextColumnFilter',
      // menuTabs: ['filterMenuTab'],
      //   filterParams: {
      //     filterOptions: ['contains'],
      //     suppressAndOrCondition: true,
      //   },
    },
    {
      headerName: 'Acquisition Date',
      field: 'dateofAcquisition',
      tooltipField: 'dateofAcquisition',
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
      headerName: 'Product',
      field: 'product',
      tooltipField: 'product',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Store',
      field: 'warehouse',
      tooltipField: 'warehouse',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Total Active Days',
      field: 'totalActiveDays',
      tooltipField: 'warehouse',
      filter: 'agNumberColumnFilter',
      menuTabs: ['filterMenuTab'],
      filterParams: {
        filterOptions: ['contains'],
        suppressAndOrCondition: true,
      },
    },
    {
      headerName: 'Dep Applicability',
      field: 'depreciationApplicability',
      tooltipField: 'depreciationApplicability',
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value){
          return 'Applicable'
        }
        else{
          return 'Not Applicable'
        }
      },
    },
    {
      headerName: 'Status',
      field: 'status',
      tooltipField: 'name',
      // valueFormatter: (params: ValueFormatterParams) => {
      //   if(params.value){
      //     return 'Applicable'
      //   }
      //   else{
      //     return 'Not Applicable'
      //   }
      // }
      // filter: 'agDateColumnFilter',
      // menuTabs: ['filterMenuTab'],
      //   filterParams: {
      //     filterOptions: ['equals'],
      //     suppressAndOrCondition: true,
      //   }
    },
    {
      headerName: 'Disposed',
      field: 'isDisposed',
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value){
          return 'Yes'
        }
        else{
          return 'No'
        }
      },
      // filter: 'agDateColumnFilter',
      // menuTabs: ['filterMenuTab'],
      //   filterParams: {
      //     filterOptions: ['equals'],
      //     suppressAndOrCondition: true,
      //   }
    },
    {
      headerName: 'Held For Disposal',
      field: 'isHeldforSaleOrDisposal',
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value){
          return 'Yes'
        }
        else{
          return 'No'
        }
      },
      // filter: 'agDateColumnFilter',
      // menuTabs: ['filterMenuTab'],
      //   filterParams: {
      //     filterOptions: ['equals'],
      //     suppressAndOrCondition: true,
      //   }
    },
    {
      headerName: 'Issued',
      field: 'isIssued',
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value){
          return 'Yes'
        }
        else{
          return 'No'
        }
      },
      // filter: 'agDateColumnFilter',
      // menuTabs: ['filterMenuTab'],
      //   filterParams: {
      //     filterOptions: ['equals'],
      //     suppressAndOrCondition: true,
      //   }
    },
    {
      headerName: 'Reserved',
      field: 'isReserved',
      tooltipField: 'name',
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value){
          return 'Yes'
        }
        else{
          return 'No'
        }
      },
      // filter: 'agDateColumnFilter',
      // menuTabs: ['filterMenuTab'],
      //   filterParams: {
      //     filterOptions: ['equals'],
      //     suppressAndOrCondition: true,
      //   }
    },
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
    this.router.navigate(['/' + ASSET.ID_BASED_ROUTE('details' , event.data.id)])
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateAssetComponent, {
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
      this.assetService.getRecords(params).subscribe((data) => {
        if(isEmpty(data.result)) {
          this.gridApi.showNoRowsOverlay()
        } else {
          this.gridApi.hideOverlay();
        }
        params.successCallback(data.result || 0, data.totalRecords);
        this.paginationHelper.goToPage(this.gridApi, 'assetPageName')
        this.cdRef.detectChanges();
      });
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
