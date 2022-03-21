import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ProductService} from '../service/product.service';
import {ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, RowDoubleClickedEvent} from 'ag-grid-community';
import {MatDialog} from '@angular/material/Dialog'
import {CustomTooltipComponent} from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import {AppConst} from "src/app/views/shared/AppConst";
import { CreateProductComponent } from '../create-product/create-product.component';
import { IProduct } from '../model/IProduct';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';

@Component({
  selector: 'kt-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListProductComponent implements OnInit {

  productList: IProduct[];
  frameworkComponents: {[p: string]: unknown};
  gridOptions: GridOptions;
  defaultColDef: ColDef;
  tooltipData: string = "double click to edit"

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {
    this.gridOptions = ((
      {
        context: {componentParent: this}
      }
    ) as GridOptions);
  }

  columnDefs = [
    {headerName: 'Name', field: 'productName', sortable: true, filter: true, tooltipField: 'cost'},
    {headerName: 'purchase or Sold', field: 'purchasedOrSold', sortable: true, filter: true, tooltipField: 'cost',
      cellRenderer: (params: ICellRendererParams) => AppConst.PurchasedOrSold[params.value]},
    {headerName: 'Type', field: 'productType', sortable: true, filter: true, tooltipField: 'cost',
      cellRenderer: (params: ICellRendererParams) => AppConst.ConsumableOrService[params.value]},
    {headerName: 'Category', field: 'categoryName', sortable: true, filter: true, tooltipField: 'cost'},
    {headerName: 'Sale Price', field: 'salesPrice', sortable: true, filter: true, tooltipField: 'cost'},
    {headerName: 'Cost', field: 'cost', sortable: true, filter: true, tooltipField: 'cost'},
    {headerName: 'sales Tax', field: 'salesTax', sortable: true, filter: true, tooltipField: 'cost'}
  ];

  ngOnInit() {

    this.getProducts()

    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }

    this.frameworkComponents = {customTooltip: CustomTooltipComponent};
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
    // Recalling getProducts function on dialog close
    dialogRef.afterClosed().subscribe(() => {
     this.getProducts()
    });
  }

  getProducts() : void {
    this.productService.getProducts().subscribe((res: IPaginationResponse<IProduct[]>) => {
      this.productList = res.result;
      this.cdRef.detectChanges();
    })
  }
}
