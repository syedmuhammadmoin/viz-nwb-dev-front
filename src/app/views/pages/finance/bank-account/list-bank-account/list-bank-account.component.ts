import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { CustomTooltipComponent } from '../../../../shared/components/custom-tooltip/custom-tooltip.component';
import { BankAccountService }          from '../service/bankAccount.service';
import { CreateBankAccountComponent } from '../create-bank-account/create-bank-account.component';
import { IBankAccount } from '../model/IBankAccount';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { isEmpty } from 'lodash';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'kt-list-bankaccount',
  templateUrl: './list-bank-account.component.html',
  styleUrls: ['./list-bank-account.component.scss']
})

export class ListBankAccountComponent extends AppComponentBase implements OnInit {

  bankAccountList: IBankAccount[];
  gridOptions : GridOptions;
  defaultColDef: ColDef;
  
  tooltipData : string = "double click to edit"
  public permissions = Permissions
  components: any;
  gridApi!: GridApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
  
  //Injecting Dependencies
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

  //Defining AG Grid Columns
  columnDefs = [
    {
      headerName: 'Account Title', 
      field: 'accountTitle', 
      tooltipField: 'accountNumber', 
      cellRenderer: "loadingCellRenderer",
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {headerName: 'Account Number', suppressHeaderMenuButton: true, field: 'accountNumber', tooltipField: 'accountNumber'},
    {
      headerName: 'Bank Name', 
      field: 'bankName',
      tooltipField: 'accountNumber',
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {
      headerName: 'Branch Name', 
      field: 'branch', 
      tooltipField: 'accountNumber',
      suppressHeaderMenuButton: true,
      valueFormatter: (params : ValueFormatterParams) => {
        return params.value || 'N/A'
      }
    },
    {
      headerName: 'Opening Balance',
      field: 'openingBalance',
      tooltipField: 'accountNumber',
      cellStyle: { 'text-align': "right" },
      suppressHeaderMenuButton: true,
      valueFormatter: (params : ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Campus', 
      field: 'campusName', 
      tooltipField: 'accountNumber',
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
      paginationPageSizeSelector: false,
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
        } 
        else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },
    };

    if(!this.permission.isGranted(this.permissions.BANKACCOUNT_EDIT)) {
      this.gridOptions.context = 'double click to view detail'
    }
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
    //Get updated bank Account Data
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setGridOption('datasource', this.dataSource);
      this.cdRef.detectChanges();
    });
  }

  dataSource = {
    getRows: async (params: any) => {
     const res = await this.getBankAccounts(params);
     if(isEmpty(res.result)) {  
      this.gridApi.showNoRowsOverlay() 
    } else {
      this.gridApi.hideOverlay();
    }
     params.successCallback(res.result || 0, res.totalRecords);
     this.paginationHelper.goToPage(this.gridApi, 'bankAccountPageName');
     this.cdRef.detectChanges();
   },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }

  async getBankAccounts(params: any): Promise<IPaginationResponse<IBankAccount[]>> {
    const result = await firstValueFrom(this._bankAccountService.getRecords(params));
    return result
  }
}

 
 


  
 
 






