import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GridOptions }            from "ag-grid-community";
import { CustomTooltipComponent } from "../../../../shared/components/custom-tooltip/custom-tooltip.component";
import { StockService }           from "../service/stock.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'kt-list-stock',
  templateUrl: './list-stock.component.html',
  styleUrls: ['./list-stock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListStockComponent implements OnInit {

  stockDetailData: any;
  gridOptions = ({} as GridOptions);
  frameworkComponents: any;
  defaultColDef: any;

  columnDefs = [
    {headerName: 'Product', field: 'item.productName', sortable: true, filter: true, tooltipField: 'status'},
    {headerName: 'Available Quantity', field: 'availableQty', sortable: true, filter: true, tooltipField: 'status'},
    {headerName: 'Cost Price', field: 'costPrice', sortable: true, filter: true, tooltipField: 'status'},
    // {headerName: 'Price', field: 'price', sortable: true, filter: true, tooltipField: 'status'},
    {headerName: 'Location', field: 'location.name', sortable: true, filter: true, tooltipField: 'status'},
  ];

  constructor( private stockService : StockService,
               private router: Router,
               private cdRef: ChangeDetectorRef,
               private activatedRoute: ActivatedRoute,
             ) { }

  ngOnInit(): void {
    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
    }
    this.frameworkComponents = {customTooltip: CustomTooltipComponent};

    this.loadStockList()
  }

  onFirstDataRendered(params : any) {
    params.api.sizeColumnsToFit();
  }
  
  onRowDoubleClicked(event : any) {
    // this.router.navigate(['/stock-detail', event.data.id], {relativeTo: this.activatedRoute})
  }

  private loadStockList() {
    this.stockService.getAllStocks().subscribe((res) => {
      this.stockDetailData = res.result
      console.log(res.result)
      this.cdRef.detectChanges();
    })
  }
}



