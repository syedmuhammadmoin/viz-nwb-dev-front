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
  selector: 'kt-list-cashaccount',
  templateUrl: './list-cash-account.component.html',
  styleUrls: ['./list-cash-account.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})

export class ListCashAccountComponent extends AppComponentBase implements OnInit {

  cashAccountList: ICashAccount[];
  gridOptions : GridOptions;
  defaultColDef: ColDef;
  tooltipData : string = "double click to edit"
  public permissions = Permissions
  components: any;
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
  
  //Injecting Dependencies
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

  //Injecting Dependencies
  columnDefs = [
    {
      
      headerName: 'Cash Account Name', 
      field: 'cashAccountName', 
      tooltipField: 'handler',
      cellRenderer: "loadingCellRenderer",
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Manager / Handler', 
      field: 'handler', 
      tooltipField: 'handler',
      suppressHeaderMenuButton: true,
      valueFormatter: (params: ValueFormatterParams) => {
        return (params.value) || 'N/A'
      }
    },
    {
      headerName: 'Opening Balance', 
      field: 'openingBalance' , 
      tooltipField: 'handler',
      suppressHeaderMenuButton: true,
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value) || 'N/A'
      }
    },
    {
      headerName: 'Campus',
      field: 'campusName',
      tooltipField: 'handler',
      suppressHeaderMenuButton: true,
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
    //Get Data from Store
    dialogRef.afterClosed().subscribe( () => {
      this.gridApi.setDatasource(this.dataSource)
      this.cdRef.detectChanges();
    });
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getCashAccounts(params);
     if(isEmpty(res.result)) {  
      this.gridApi.showNoRowsOverlay() 
    } else {
      this.gridApi.hideOverlay();
    }
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'cashAccountPageName')
     this.cdRef.detectChanges();
   },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getCashAccounts(params: any): Promise<IPaginationResponse<ICashAccount[]>> {
    const result = await this.cashAccountService.getRecords(params).toPromise()
    return result
  }
}






















  
 
 







