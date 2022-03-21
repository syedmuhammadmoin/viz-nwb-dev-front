import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, RowDoubleClickedEvent } from 'ag-grid-community';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { CustomTooltipComponent } from '../../../../shared/components/custom-tooltip/custom-tooltip.component';
import { CashAccountService } from '../service/cashAccount.service';
import { CreateCashAccountComponent } from '../create-cash-account/create-cash-account.component';
import { ICashAccount } from '../model/ICashAccount';


@Component({
  selector: 'kt-list-cashAccount',
  templateUrl: './list-cash-account.component.html',
  styleUrls: ['./list-cash-account.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})

export class ListCashAccountComponent implements OnInit {

  cashAccountList: ICashAccount[];
  gridOptions : GridOptions;
  defaultColDef: ColDef;
  frameworkComponents: {[p: string] : unknown};
  tooltipData : string = "double click to edit"

  constructor( private cashAccountService: CashAccountService,
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
    {headerName: 'Cash Account Name', field: 'cashAccountName', sortable: true, filter: true, tooltipField: 'handler'},
    {headerName: 'Manager Name / Handler', field: 'handler', sortable: true, filter: true ,tooltipField: 'handler'},
    {
      headerName: 'Opening Balance', 
      field: 'openingBalance' , 
      sortable: true, 
      filter: true ,
      tooltipField: 'handler',
      cellRenderer: (params : ICellRendererParams) => {
        return params.data.openingBalance.toLocaleString()
      }
    },
  ];

  ngOnInit() {

    this.getCashAccounts()

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
    const dialogRef = this.dialog.open(CreateCashAccountComponent, {
      width: '800px',
      data: id
    });
    // Recalling getCashAccounts function on dialog close
    dialogRef.afterClosed().subscribe( () => {
        this.getCashAccounts()
    });
  }

  getCashAccounts() {
    this.cashAccountService.getCashAccounts().subscribe((res: IPaginationResponse<ICashAccount[]>) => {
      this.cashAccountList = res.result;
      this.cdRef.markForCheck();
    })
  }
}






















  
 
 







