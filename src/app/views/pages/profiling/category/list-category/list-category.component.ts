import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { CategoryService } from '../service/category.service';
import { MatDialog } from '@angular/material/dialog'
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { CreateCategoryComponent } from '../create-category/create-category.component';
import { ICategory } from '../model/ICategory';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { isEmpty } from 'lodash';

@Component({
  selector: 'kt-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})

export class ListCategoryComponent extends AppComponentBase implements OnInit {

  categoryList : ICategory[]
  gridOptions : GridOptions;
  defaultColDef : ColDef;
  tooltipData : string = "double click to edit"
  components: any;
  public permissions = Permissions
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span style="padding: 8px; border-radius: 5px; border: 1px solid #D3D3D3; background: white;">No Rows !</span>';

  // constructor
  constructor( 
               private categoryService: CategoryService,
               public dialog: MatDialog,
               private cdRef: ChangeDetectorRef,
               injector: Injector
             ) {
               super(injector)
                this.gridOptions = <GridOptions>({ context : { componentParent : this } } );
               }

  //Defining Category columns
  columnDefs = [
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
    { headerName: 'Asset Account', field: 'inventoryAccount', suppressHeaderMenuButton: true, tooltipField: 'name' },
    { headerName: 'Revenue Account', field: 'revenueAccount', suppressHeaderMenuButton: true, tooltipField: 'name' },
    { headerName: 'Cost Account', field: 'costAccount', suppressHeaderMenuButton: true },
    { headerName: 'Fixed Asset', field: 'isFixedAsset', suppressHeaderMenuButton: true,
     valueFormatter: (params: ValueFormatterParams) => {
      if(params.value){
        return 'Yes'
      }
      else{
        return 'No'
      }
      // return params.value ?? 'N/A'
    }}
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
        } else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },
    };

    if(!this.permission.isGranted(this.permissions.CATEGORIES_EDIT)) {
      this.gridOptions.context = 'double click to view detail'
    }
  }
// data rendering on first
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

// called when double clicked on record
  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.openDialog(event.data.id)
  }

// open modal funtion
  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateCategoryComponent, {
      width: '800px',
      data: id
    });
    // Recalling getCategories function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setDatasource(this.dataSource)
      this.cdRef.detectChanges();
    });
  }

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getCategories(params);
      if(isEmpty(res.result)) {  
        this.gridApi.showNoRowsOverlay() 
      } else {
        this.gridApi.hideOverlay();
      }
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'categoryPageName');
      this.cdRef.detectChanges();
    },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getCategories(params: any): Promise<IPaginationResponse<ICategory[]>> {
    const result = await this.categoryService.getRecords(params).toPromise()
    return result
  }
}



