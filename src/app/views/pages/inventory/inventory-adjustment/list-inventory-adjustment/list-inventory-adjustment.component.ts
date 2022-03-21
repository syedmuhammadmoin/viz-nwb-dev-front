import { INVENTORY_ADJUSTMENT } from './../../../../shared/AppRoutes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { InventoryAdjustmentService } from '../service/inventory-adjustment.service';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';

@Component({
  selector: 'kt-list-inventory-adjustment',
  templateUrl: './list-inventory-adjustment.component.html',
  styleUrls: ['./list-inventory-adjustment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListInventoryAdjustmentComponent extends AppComponentBase implements OnInit {
  
    adjustmentList : any;
    defaultColDef: any;
    frameworkComponents : any;
    gridOptions : GridOptions;
    tooltipData : string = "double click to view detail"
  
    constructor( private IAdjustmentService: InventoryAdjustmentService,
                 private cdRef: ChangeDetectorRef,
                 private router : Router,
                 injector : Injector) {
                   super(injector)
                   this.gridOptions = <GridOptions>(    { context : { componentParent : this } } );
                 }
    
    columnDefs = [
      {headerName: 'User', field: 'employee', sortable: true, filter: true , tooltipField: 'contact'},
      {headerName: 'Adjustment Date', field: 'adjustmentDate', sortable: true, filter: true , tooltipField: 'contact',
        cellRenderer: (params : any) => {
          const date = params.data.adjustmentDate != null ? params.data.adjustmentDate : null;
          return date == null || this.transformDate(date, 'MMM d, y');
        }
      },
      {headerName: 'Contact', field: 'contact', sortable: true, filter: true ,tooltipField: 'contact'},
      {
        headerName: 'Adjustment Nature',field: 'adjustmentNature', sortable: true,filter: true , tooltipField: 'contact',
        // cellRenderer: (params : any) => { 
        //   return (params.data.adjustmentNature === 0) ? "Negative" : "Positive" 
        // }
      },
      { headerName: 'Status', field: 'status', sortable: true, filter: true, tooltipField: 'contact', },
    ];
    
      
    ngOnInit() {
      this.gridOptions.rowHeight = 40;
      this.gridOptions.headerHeight = 35;
  
      this.defaultColDef = {
        tooltipComponent: 'customTooltip'
      }
      this.frameworkComponents = { customTooltip: CustomTooltipComponent };
  
      this.loadIAdjustmentList();
    }
  
    onFirstDataRendered(params : any) {
      params.api.sizeColumnsToFit();
    }
  
    addInventoryAdjustment() {
      this.router.navigate(['/'+INVENTORY_ADJUSTMENT.CREATE]);
    }
  
    onRowDoubleClicked(event : any) {
      this.router.navigate(['/'+INVENTORY_ADJUSTMENT.ID_BASED_ROUTE('details',event.data.id)]);
    }
  
    loadIAdjustmentList() {
      this.IAdjustmentService.getInventoryAdjustments().subscribe(
        (res) => {
          this.adjustmentList = res.result;
          console.log("adjustment",res.result)
          this.cdRef.markForCheck();
        },
        (err : any) => { console.log(err) })
    }
  }
    
    
    
  
  
  


