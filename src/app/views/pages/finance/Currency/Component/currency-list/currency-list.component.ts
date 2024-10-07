import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { lastValueFrom, firstValueFrom } from 'rxjs';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { ICurrency } from '../../model/ICurrency';
import { CurrencyService } from '../../service/currency.service';
import { Permissions, TaxType } from 'src/app/views/shared/AppEnum';
import { CURRENCY } from 'src/app/views/shared/AppRoutes';
import { isEmpty } from 'lodash';

@Component({
  selector: 'vl-currency-list',
  standalone: false,
  templateUrl: './currency-list.component.html',
  styleUrl: './currency-list.component.scss'
})
export class CurrencyListComponent extends AppComponentBase implements OnInit {

  CurrencyList : ICurrency[]
  gridOptions : GridOptions;
  public rowData : any[] = [];
  defaultColDef : ColDef;
  selectedRowCount : number;
  deleteBtn : boolean;
  domLayout: any;
  components: any;
  public permissions = Permissions
  gridApi: GridApi; 
  overlayNoRowsTemplate = '<span style="padding: 8px; border-radius: 5px; border: 1px solid #D3D3D3; background: white;">No Rows !</span>';

  // constructor
  constructor( 
               private currencyService: CurrencyService,               
               private cdRef: ChangeDetectorRef,
               injector: Injector
             ) {
               super(injector)
                this.gridOptions = <GridOptions>({ context : { componentParent : this } } );
               }

  //Defining Currency Columns
  columnDefs = [
    { width: 20, checkboxSelection: true , headerCheckboxSelection: true },
    { 
      headerName: 'Code', 
      field: 'code', 
      tooltipField: 'Code',
      cellRenderer: "loadingCellRenderer",
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
     },
    { 
      headerName: 'Symbol', 
      field: 'symbol', 
      suppressHeaderMenuButton: true, 
      tooltipField: 'Symbol',
      

    },
    { headerName: 'Name', 
      field: 'name', 
      suppressHeaderMenuButton: true, 
      tooltipField: 'name',
    },
    { headerName: 'Last Update', 
      field: 'lastUpdate', 
      suppressHeaderMenuButton: true, 
      tooltipField: 'Last Update',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.transformDate(params.value, 'MMM d, y') || null;
      }
    },
    { headerName: 'Unit Per USD', 
      field: 'unitPerUSD', 
      suppressHeaderMenuButton: true, 
      tooltipField: 'USD Per Unit',
    },
    { headerName: 'USD Per Unit', 
      field: 'usdPerUnit', 
      suppressHeaderMenuButton: true, 
      tooltipField: 'USD Per Unit',
    },
  ];


  ngOnInit() { 
    this.domLayout = "autoHeight";
    this.gridOptions = {
      rowSelection: 'multiple',    
      //rowModelType: "infinite",           
      // rowHeight: 30,
      // headerHeight: 35,      
      context: "double click to view detail",
      defaultColDef: {
        editable: true,
        filter: true, // Enable filtering
      },
    };

    

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      flex: 1,
      minWidth: 20,
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

    if(!this.permission.isGranted(this.permissions.CURRENCY_EDIT)) {
      this.gridOptions.context = 'double click to view detail'
    }
    this.loadGridData();
  }

  loadGridData(): void {   
    lastValueFrom(this.currencyService.getCurrencyes()).then(res => {
      if(res){
        this.rowData = res.result;
      this.gridApi?.setGridOption('rowData', this.rowData)
      this.cdRef.detectChanges();
      }
    })
  }
// data rendering on first
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }
 CreateCurrency(){
  
  this.router.navigate(['/' + CURRENCY.CREATE]);
 }
// called when double clicked on record
  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(
      ['/' + CURRENCY.ID_BASED_ROUTE('edit', event.data.id)], 
      { queryParams: { q: event.data.id, isCurrency: true } }
    );
  }


  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getCurrencyes(params);
      if(isEmpty(res.result)) {  
        this.gridApi.showNoRowsOverlay() 
      } else {
        this.rowData = res.result;
        this.gridApi.hideOverlay();
      }
      params.successCallback(this.rowData || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'CurrencyPageName');
      this.cdRef.detectChanges();
    },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }

  async getCurrencyes(params: any): Promise<IPaginationResponse<ICurrency[]>> {
    const result = await firstValueFrom(this.currencyService.getRecords(params));
    return result
  }
  onRowSelected(event: any) {
    const selectedRows = event.api.getSelectedRows();
    this.selectedRowCount = selectedRows.length;
    this.deleteBtn = selectedRows.length > 0;
  
  }
  
  DeleteRows(){
    const selectedRows = this.gridApi.getSelectedRows();
    const selectedIds = selectedRows.map(row => row.id);   
    this.toastService.info("Deleting Records ,Please Wait!")
   lastValueFrom(this.currencyService.deleteCurrencyes(selectedIds)).then(res => {
    if(res){
      this.gridApi.deselectAll();
      this.rowData = this.rowData.filter(row => !selectedRows.includes(row));
      this.gridApi.setGridOption('rowData',this.rowData); 
      this.toastService.success("Deleted Successfully");
    }
    
   })       
  };
  DeselectRows() {
    this.gridApi.deselectAll();
  }
}






