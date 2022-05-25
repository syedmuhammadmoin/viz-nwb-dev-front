import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
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
    public permissions = Permissions
    components: { loadingCellRenderer (params: any ) : unknown };
    gridApi: GridApi;
    gridColumnApi: ColumnApi;
    overlayNoRowsTemplate = '<span class="ag-noData">No Rows !</span>';
    
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
      {headerName: 'Bank Account', field: 'bankAccountName', sortable: true, filter: true, tooltipField: 'description'},
      {headerName: 'Description', field: 'description', sortable: true, filter: true ,tooltipField: 'description'},
      {
        headerName: 'Opening Balance', 
        field: 'openingBalance', 
        sortable: true, 
        filter: true ,
        tooltipField: 'description',
        valueFormatter: (params : ValueFormatterParams) => {
          return this.valueFormatter(params.value) || null
        }
      }
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

    addBankStatement(){
      this.router.navigate(['/' + BANK_STATEMENT.CREATE]);
    }

    onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.sizeColumnsToFit();
    }

    onRowDoubleClicked(event: RowDoubleClickedEvent){
      this.router.navigate(['/' + BANK_STATEMENT.ID_BASED_ROUTE('edit' ,  event.data.id )]);
    }

    onGridReady(params: GridReadyEvent) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      params.api.setDatasource(this.dataSource);
    }
  
    async getBankStatements(params: any): Promise<IPaginationResponse<IBankStatement[]>> {
      const result = await  this.bankStatementService.getBankStatements(params).toPromise()
      return result
    }
  
    dataSource = {
      getRows: async (params: any) => {
       const res = await this.getBankStatements(params)

       if (!res.result) { 
        this.gridApi.showNoRowsOverlay() 
      } else {
       this.gridApi.hideOverlay();
      }
       //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
       params.successCallback(res.result || 0, res.totalRecords);
       this.paginationHelper.goToPage(this.gridApi, 'bankStatementPageName')
       this.cdRef.detectChanges();
     },
    };

  //   getBankStatements() {
  //     this.bankStatementService.getBankStatements().subscribe((res: IPaginationResponse<IBankStatement[]>) => {
  //     this.bankStatementList = res.result;
  //     this.cdRef.markForCheck();
  //   })
  // }
}






   
 
  

 
 


  
 
 







  


