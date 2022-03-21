import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, RowDoubleClickedEvent } from 'ag-grid-community';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { CustomTooltipComponent } from '../../../../shared/components/custom-tooltip/custom-tooltip.component';
import { BankAccountService }          from '../service/bankAccount.service';
import { CreateBankAccountComponent } from '../create-bank-account/create-bank-account.component';
import { IBankAccount } from '../model/IBankAccount';


@Component({
  selector: 'kt-list-bankAccount',
  templateUrl: './list-bank-account.component.html',
  styleUrls: ['./list-bank-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListBankAccountComponent implements OnInit {

  bankAccountList: IBankAccount[];
  gridOptions : GridOptions;
  defaultColDef: ColDef;
  frameworkComponents: {[p: string]: unknown};
  tooltipData : string = "double click to edit"

  constructor( private _bankAccountService: BankAccountService,
               public  dialog: MatDialog,
               private cdRef: ChangeDetectorRef,
             ) {
                this.gridOptions = <GridOptions>(
                 { 
                  context : { componentParent : this } 
                 }
                );
               } 

  columnDefs = [
    {headerName: 'Account Number', field: 'accountNumber', sortable: true, filter: true, tooltipField: 'accountNumber'},
    {headerName: 'Bank', field: 'bankName', sortable: true, filter: true ,tooltipField: 'accountNumber'},
    {headerName: 'Branch', field: 'branch', sortable: true, filter: true ,tooltipField: 'accountNumber'},
    {
      headerName: 'Opening Balance',
      field: 'openingBalance',
      sortable: true, 
      filter: true ,
      tooltipField: 'accountNumber',
      cellRenderer: (params : ICellRendererParams) => {
        return params.data.openingBalance.toLocaleString()
      }
    }
  ];
 
  ngOnInit() {

    this.getBankAccounts()

    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};
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
        this.getBankAccounts()
    });
  }

  getBankAccounts() : void {
    this._bankAccountService.getBankAccounts().subscribe((res: IPaginationResponse<IBankAccount[]>) => {
      this.bankAccountList = res.result;
      this.cdRef.detectChanges();
    })
  }
}

 
 


  
 
 






