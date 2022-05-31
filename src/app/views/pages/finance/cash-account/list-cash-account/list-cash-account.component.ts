import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { CustomTooltipComponent } from '../../../../shared/components/custom-tooltip/custom-tooltip.component';
import { CashAccountService } from '../service/cashAccount.service';
import { CreateCashAccountComponent } from '../create-cash-account/create-cash-account.component';
import { ICashAccount } from '../model/ICashAccount';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { isEmpty } from 'lodash';


@Component({
  selector: 'kt-list-cashAccount',
  templateUrl: './list-cash-account.component.html',
  styleUrls: ['./list-cash-account.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})

export class ListCashAccountComponent extends AppComponentBase implements OnInit {

  cashAccountList: ICashAccount[];
  gridOptions : GridOptions;
  defaultColDef: ColDef;
  frameworkComponents: {[p: string] : unknown};
  tooltipData : string = "double click to edit"
  public permissions = Permissions
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
  
  constructor( private cashAccountService: CashAccountService,
               public  dialog: MatDialog,
               private cdRef: ChangeDetectorRef,
               injector: Injector
             ) {
                super(injector)
                this.gridOptions = <GridOptions>(
                 { 
                  context : { componentParent : this } 
                 }
                );
               } 

  columnDefs = [
    {
      
      headerName: 'Cash Account Name', 
      field: 'cashAccountName', 
      sortable: true, 
      filter: true, 
      tooltipField: 'handler',
      cellRenderer: "loadingCellRenderer"
    },
    {
      headerName: 'Manager / Handler', 
      field: 'handler', 
      sortable: true, 
      filter: true ,
      tooltipField: 'handler',
      valueFormatter: (params: ValueFormatterParams) => {
        return (params.value) || 'N/A'
      }
    },
    {
      headerName: 'Opening Balance', 
      field: 'openingBalance' , 
      sortable: true, 
      filter: true ,
      tooltipField: 'handler',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value) || 'N/A'
      }
    },
    {headerName: 'Campus', field: 'campusName', sortable: true, filter: true, tooltipField: 'handler'},
  ];

  ngOnInit() {

    this.gridOptions = {
      cacheBlockSize: 20,
      rowModelType: "infinite",
      paginationPageSize: 10,
      pagination: true,
      rowHeight: 40,
      headerHeight: 35,
      context: "double click to edit",
    };

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
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

  onFirstDataRendered(params : FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event : RowDoubleClickedEvent){
    this.openDialog(event.data.id)
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateCashAccountComponent, {
      width: '800px',
      data: id
    });
    // Recalling getCashAccounts function on dialog close
    dialogRef.afterClosed().subscribe( () => {
      this.gridApi.setDatasource(this.dataSource)
      this.cdRef.detectChanges();
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getCashAccounts(params: any): Promise<IPaginationResponse<ICashAccount[]>> {
    const result = await this.cashAccountService.getCashAccounts(params).toPromise()
    return result
  }

  dataSource = {
    getRows: async (params: any) => {
      console.log(params)
     const res = await this.getCashAccounts(params);

    // if(res.result) { 
    //   this.gridApi.showNoRowsOverlay() 
    // } else {
    //  this.gridApi.hideOverlay();
    // }
    if(isEmpty(res.result)) { 
      this.gridApi.showNoRowsOverlay() 
    } else {
      this.gridApi.hideOverlay();
    }
     //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'cashAccountPageName')
     this.cdRef.detectChanges();
   },
  };

  // getCashAccounts() {
  //   this.cashAccountService.getCashAccounts().subscribe((res: IPaginationResponse<ICashAccount[]>) => {
  //     this.cashAccountList = res.result;
  //     this.cdRef.markForCheck();
  //   })
  // }
}






















  
 
 







