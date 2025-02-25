

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog'
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
  gridOptions: any;
  cwipList: ICwip[];
  FilteredData: any[]=[];
  tooltipData: string = "double click to view detail"
  public permissions = Permissions
  components: any;
  gridApi: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';

  // Injecting dependencies
  constructor(
    private cwipService: CwipService,
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
      field: 'cwipCode',
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
      headerName: 'Acquisition Date',
      field: 'dateOfAcquisition',
      tooltipField: 'name',
      suppressHeaderMenuButton: true,
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    {
      headerName: 'Asset Cost',
      field: 'cost',
      tooltipField: 'name',
      valueFormatter: (params : ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }

    },
    {
      headerName: 'Asset Account',
      field: 'assetAccount',
      tooltipField: 'name',
      // filter: 'agDateColumnFilter',
      // menuTabs: ['filterMenuTab'],
      //   filterParams: {
      //     filterOptions: ['equals'],
      //     suppressAndOrCondition: true,
      //   }
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
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
        // return params.value ?? 'N/A'
      }
      // filter: 'agDateColumnFilter',
      // menuTabs: ['filterMenuTab'],
      //   filterParams: {
      //     filterOptions: ['equals'],
      //     suppressAndOrCondition: true,
      //   }
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
    this.router.navigate(['/' + CWIP.ID_BASED_ROUTE('details' , event.data.id)])
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateCwipComponent, {
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
      this.cwipService.getRecords(params).subscribe((data) => {
        if(isEmpty(data.result)) {
          this.gridApi.showNoRowsOverlay()
        } else {
          this.FilteredData = data.result;
          this.gridApi.hideOverlay();
        }
        params.successCallback(this.FilteredData || 0, data.totalRecords);
        this.paginationHelper.goToPage(this.gridApi, 'CWIPPageName')
        this.cdRef.detectChanges();
      });
    },
  };



  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }



  // onGridReady(params: GridReadyEvent) {
  //   this.gridApi = params.api;
  //   params.api.setGridOption('datasource', this.dataSource);
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

  
  fetchData(x: any) {           
    const dataSource = {
      getRows: (params: any) => {        
        this.cwipService.getRecordByYearMonth(x.startDate ,x.endDate )
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
