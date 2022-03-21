import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, RowDoubleClickedEvent } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BANK_STATEMENT } from 'src/app/views/shared/AppRoutes';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { CustomTooltipComponent } from "../../../../shared/components/custom-tooltip/custom-tooltip.component";
import { IBankStatement } from '../model/IBankStatement';
import { BankStatementService } from '../service/bank-statement.service';

@Component({
  selector: 'kt-list-bank-statement',
  templateUrl: './list-bank-statement.component.html',
  styleUrls: ['./list-bank-statement.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})

export class ListBankStatementComponent extends AppComponentBase implements OnInit {
  
    bankStatementList: IBankStatement[];
    gridOptions: GridOptions = ({} as GridOptions);
    frameworkComponents : {[p: string]: unknown};
    defaultColDef : ColDef;
    tooltipData : string = 'double click to edit'

    constructor( private bankStatementService : BankStatementService,
                 private router: Router,
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
      {headerName: 'Bank Account', field: 'bankAccount.bankName', sortable: true, filter: true, tooltipField: 'description'},
      {headerName: 'Description', field: 'description', sortable: true, filter: true ,tooltipField: 'description'},
      {
        headerName: 'Opening Balance', 
        field: 'openingBalance', 
        sortable: true, 
        filter: true ,
        tooltipField: 'description',
        cellRenderer: (params : ICellRendererParams) => {
          return params.data.openingBalance.toLocaleString(undefined , {maximumFractionDigits: 2})
        }
      }
    ];
  
    ngOnInit() {

      this.getBankStatements()

      this.gridOptions.rowHeight = 40;
      this.gridOptions.headerHeight = 35;

      this.defaultColDef = {
        tooltipComponent: 'customTooltip'
      }

      this.frameworkComponents = {customTooltip: CustomTooltipComponent};
    }

    addBankStatement(){
      this.router.navigate(['/' + BANK_STATEMENT.CREATE]);
    }

    onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.sizeColumnsToFit();
    }

    onRowDoubleClicked(event: RowDoubleClickedEvent){
      this.router.navigate(['/' + BANK_STATEMENT.ID_BASED_ROUTE('edit' ,  event.data.id )]);
    }

    getBankStatements() {
      this.bankStatementService.getBankStatements().subscribe((res: IPaginationResponse<IBankStatement[]>) => {
      this.bankStatementList = res.result;
      this.cdRef.markForCheck();
    })
  }
}






   
 
  

 
 


  
 
 







  


