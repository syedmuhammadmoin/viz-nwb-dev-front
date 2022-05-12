import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { CustomTooltipComponent } from '../../../../shared/components/custom-tooltip/custom-tooltip.component';
import { BankAccountService }          from '../service/bankAccount.service';
import { CreateBankAccountComponent } from '../create-bank-account/create-bank-account.component';
import { IBankAccount } from '../model/IBankAccount';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';


@Component({
  selector: 'kt-list-bankAccount',
  templateUrl: './list-bank-account.component.html',
  styleUrls: ['./list-bank-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListBankAccountComponent extends AppComponentBase implements OnInit {

  bankAccountList: IBankAccount[];
  gridOptions : GridOptions;
  defaultColDef: ColDef;
  frameworkComponents: {[p: string]: unknown};
  tooltipData : string = "double click to edit"
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi!: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
  
  constructor( private _bankAccountService: BankAccountService,
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
    {headerName: 'Account Title', field: 'accountTitle', sortable: true, filter: true, tooltipField: 'accountNumber', cellRenderer: "loadingCellRenderer"},
    {headerName: 'Account Number', field: 'accountNumber', sortable: true, filter: true, tooltipField: 'accountNumber'},
    {headerName: 'Bank', field: 'bankName', sortable: true, filter: true ,tooltipField: 'accountNumber'},
    {
      headerName: 'Branch', 
      field: 'branch', 
      sortable: true, 
      filter: true ,
      tooltipField: 'accountNumber',
      valueFormatter: (params : ValueFormatterParams) => {
        return params.value || 'N/A'
      }
    },
    {
      headerName: 'Opening Balance',
      field: 'openingBalance',
      sortable: true, 
      filter: true ,
      tooltipField: 'accountNumber',
      valueFormatter: (params : ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {headerName: 'Campus', field: 'campusName', sortable: true, filter: true, tooltipField: 'accountNumber'},
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
    //this.gridApi.showNoRowsOverlay();

    this.components = {
      loadingCellRenderer: function (params: any) {
        if (params.value !== undefined) {
          return params.value;
        } 
        else {
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
    const dialogRef = this.dialog.open(CreateBankAccountComponent, {
      width: '800px',
      data: id
    });
    // Recalling getBankAccounts function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setDatasource(this.dataSource)
      this.cdRef.detectChanges();
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getBankAccounts(params: any): Promise<IPaginationResponse<IBankAccount[]>> {
    const result = await this._bankAccountService.getBankAccounts().toPromise()
    return result
  }

  dataSource = {
    getRows: async (params: any) => {
    const res = await this.getBankAccounts(params);
    
    if (!res.result) { 
      this.gridApi.showNoRowsOverlay() 
    } else {
     this.gridApi.hideOverlay();
    }
     //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'bankAccountPageName')
     this.cdRef.detectChanges();
   },
  };

  // getBankAccounts() : void {
  //   this._bankAccountService.getBankAccounts().subscribe((res: IPaginationResponse<IBankAccount[]>) => {
  //     this.bankAccountList = res.result;
  //     this.cdRef.detectChanges();
  //   })
  // }
}

 
 


  
 
 






