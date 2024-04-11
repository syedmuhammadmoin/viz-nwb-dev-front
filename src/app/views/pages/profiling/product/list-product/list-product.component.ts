import { ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import { ProductService} from '../service/product.service';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, RowDoubleClickedEvent, ValueFormatterParams} from 'ag-grid-community';
import { MatDialog} from '@angular/material/dialog'
import { CustomTooltipComponent} from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { AppConst} from "src/app/views/shared/AppConst";
import { CreateProductComponent } from '../create-product/create-product.component';
import { IProduct } from '../model/IProduct';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { isEmpty } from 'lodash';

@Component({
  selector: 'kt-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})

export class ListProductComponent extends AppComponentBase implements OnInit {

  productList: IProduct[];
  
  gridOptions: any;
  defaultColDef: ColDef;
  tooltipData: string = "double click to edit"
  components: any;
  public permissions = Permissions
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span style="padding: 8px; border-radius: 5px; border: 1px solid #D3D3D3; background: white;">No Rows !</span>';

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ((
      {
        context: {componentParent: this}
      }
    ) as GridOptions);
  }

  //Defining Product Columns
  columnDefs = [
    {
      headerName: 'Name', 
      field: 'productName', 
      tooltipField: 'salesTax', 
      cellRenderer: "loadingCellRenderer",
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
    },
    {headerName: 'Product Type', field: 'productType', suppressHeaderMenuButton: true, tooltipField: 'salesTax',
      cellRenderer: (params: ICellRendererParams) => AppConst.ProductType[params.value]},
    {headerName: 'Category', field: 'categoryName', suppressHeaderMenuButton: true, tooltipField: 'salesTax'},
    {
      headerName: 'Sale Price', 
      field: 'salesPrice', 
      suppressHeaderMenuButton: true,
      tooltipField: 'salesTax',
      valueFormatter: (params : ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Purchase Price', 
      field: 'purchasePrice', 
      suppressHeaderMenuButton: true,
      tooltipField: 'salesTax',
      valueFormatter: (params : ValueFormatterParams) => {
        return this.valueFormatter(params.value)
      }
    },
    {
      headerName: 'Sales Tax (%)', 
      field: 'salesTax', 
      suppressHeaderMenuButton: true,
      tooltipField: 'salesTax',
      valueFormatter: (params : ValueFormatterParams) => {
        return this.valueFormatter(params.value) + ' %'
      }
    }
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

    if(!this.permission.isGranted(this.permissions.PRODUCT_EDIT)) {
      this.gridOptions.context = 'double click to view detail'
    }
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.openDialog(event.data.id)
  }

  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreateProductComponent, {
      width: '800px',
      data: id
    });
    //Getting Update Data
    dialogRef.afterClosed().subscribe(() => {
      this.gridApi.setDatasource(this.dataSource)
      this.cdRef.detectChanges();
    });
  }

  dataSource = {
    getRows: async (params: any) => {
      const res = await this.getProducts(params);
      if(isEmpty(res.result)) {  
        this.gridApi.showNoRowsOverlay() 
      } else {
        this.gridApi.hideOverlay();
      }
      params.successCallback(res.result || 0, res.totalRecords);
      this.paginationHelper.goToPage(this.gridApi, 'productPageName');
      this.cdRef.detectChanges();
    },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setDatasource(this.dataSource);
  }

  async getProducts(params: any): Promise<IPaginationResponse<IProduct[]>> {
    const result = await this.productService.getRecords(params).toPromise()
    return result
  }
}
