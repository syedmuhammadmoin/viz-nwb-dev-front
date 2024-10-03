import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions, TaxScope, TaxType } from 'src/app/views/shared/AppEnum';
import { isEmpty } from 'lodash';
import { ITax } from '../model/ITax';
import { TaxService } from '../service/tax.service';
import { CreateTaxComponent } from '../create-tax/create-tax.component';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { TAX } from 'src/app/views/shared/AppRoutes';

@Component({
  selector: 'kt-list-tax',
  templateUrl: './list-tax.component.html',
  styleUrls: ['./list-tax.component.scss']
})

export class ListTaxComponent extends AppComponentBase implements OnInit {

  taxList : ITax[]
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
               private taxService: TaxService,               
               private cdRef: ChangeDetectorRef,
               injector: Injector
             ) {
               super(injector)
                this.gridOptions = <GridOptions>({ context : { componentParent : this } } );
               }

  //Defining Tax Columns
  columnDefs = [
    { width: 20, checkboxSelection: true , headerCheckboxSelection: true },
    { 
      headerName: 'Name', 
      field: 'name', 
      tooltipField: 'name',
      cellRenderer: "loadingCellRenderer",
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
     },
    { 
      headerName: 'Tax Type', 
      field: 'taxType', 
      suppressHeaderMenuButton: true, 
      tooltipField: 'name',
      valueFormatter: (params : ValueFormatterParams) => {
        return TaxType[params.value]
      }

    },
    { 
      headerName: 'Tax Scope', 
      field: 'taxScope', 
      suppressHeaderMenuButton: true, 
      tooltipField: 'name',
      valueFormatter: (params : ValueFormatterParams) => {
        return TaxScope[params.value]
      }

    },
    { headerName: 'Account', 
      field: 'accountName', 
      suppressHeaderMenuButton: true, 
      tooltipField: 'name',
      valueFormatter: (params : ValueFormatterParams) => {
        return params.value ?? ' - '
      }
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

    if(!this.permission.isGranted(this.permissions.TAXES_EDIT)) {
      this.gridOptions.context = 'double click to view detail'
    }
    this.loadGridData();
  }

  loadGridData(): void {   
    lastValueFrom(this.taxService.getTaxes()).then(res => {
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
 CreateTax(){
  console.log("Waleed ");
  
  this.router.navigate(['/' + TAX.CREATE]);
 }
// called when double clicked on record
  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate(
      ['/' + TAX.ID_BASED_ROUTE('edit', event.data.id)], 
      { queryParams: { q: event.data.id, istax: true } }
    );
  }

// open modal funtion
  // openDialog(id?: number): void {
  //   const dialogRef = this.dialog.open(CreateTaxComponent, {
  //     width: '800px',
  //     data: id
  //   });
  //   //Get Updated Tax Data
  //   dialogRef.afterClosed().subscribe(() => {
  //     this.gridApi.setGridOption('datasource', this.dataSource);
  //     this.cdRef.detectChanges();
  //   });
  // }

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getTaxes(params);
      if(isEmpty(res.result)) {  
        this.gridApi.showNoRowsOverlay() 
      } else {
        this.rowData = res.result;
        this.gridApi.hideOverlay();
      }
      params.successCallback(this.rowData || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'taxPageName');
      this.cdRef.detectChanges();
    },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.setGridOption('datasource', this.dataSource);
  }

  async getTaxes(params: any): Promise<IPaginationResponse<ITax[]>> {
    const result = await firstValueFrom(this.taxService.getRecords(params));
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
   lastValueFrom(this.taxService.deleteTaxes(selectedIds)).then(res => {
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






