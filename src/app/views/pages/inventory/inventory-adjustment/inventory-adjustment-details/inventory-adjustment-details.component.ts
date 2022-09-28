import { INVENTORY_ADJUSTMENT } from './../../../../shared/AppRoutes';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {InventoryAdjustmentService} from '../service/inventory-adjustment.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutUtilsService} from '../../../../../core/_base/crud';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import {GridOptions} from 'ag-grid-community';

@Component({
  selector: 'kt-inventory-adjustment-details',
  templateUrl: './inventory-adjustment-details.component.html',
  styleUrls: ['./inventory-adjustment-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class InventoryAdjustmentDetailsComponent  extends AppComponentBase implements OnInit {
// For Loading
isLoading: boolean; 
  //inventory adjustment master
  adjustmentMaster: any ;
  // inventory adjustment lines
  detailData:any;
  // for ag-grid
  gridOptions = ({} as GridOptions);

  constructor( private activatedRoute: ActivatedRoute,
               private adjustmentService : InventoryAdjustmentService,
               private cdRef: ChangeDetectorRef,
               private router: Router,
               injector: Injector,
               private layoutUtilService: LayoutUtilsService
             ) {  super(injector)}

// columns for inventory adjustment lines
  columnDefs = [
    {headerName: 'Item', field: 'item.productName', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Description', field: 'description', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Quantity', field: 'quantity', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
    {headerName: 'Price', field: 'price', sortable: true, filter: true, cellStyle: {'font-size': '12px'},
    valueFormatter: (params) => {
      return this.valueFormatter(params.value)
    }},
    {headerName: 'Location', field: 'location.name', sortable: true, filter: true, cellStyle: {'font-size': '12px'}},
  ];

// ng on init method implementation
  ngOnInit(): void {
    this.gridOptions.rowData = this.adjustmentMaster;
    this.gridOptions.rowStyle = {color: 'black'};
    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;

    // get data from route
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id) {       
       this.getAdjustmentMasterData(id);        
        this.cdRef.markForCheck();
      } else {
        this.layoutUtilService.showActionNotification('Cannot find record with out id parameter', null, 5000, true, false)
        this.router.navigate(['/'+INVENTORY_ADJUSTMENT.LIST])
      }
    });
  }

  onFirstDataRendered(params : any) {
    params.api.sizeColumnsToFit();
  }

 // defination of inventory adjustment method
  private getAdjustmentMasterData(id: number) {
    this.isLoading = true
    this.adjustmentService.getInventoryAdjustmentMaster(id).subscribe((res) => {
      this.adjustmentMaster = res.result;
      this.detailData= this.adjustmentMaster.inventoryAdjustmentLines
      this.isLoading = false;
      console.log("master data", this.adjustmentMaster);
      console.log("detail data", this.detailData);
      this.cdRef.markForCheck();
    }, (error => {
      console.log(error);
    }))
  } 
}



