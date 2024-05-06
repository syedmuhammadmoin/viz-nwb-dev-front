import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import { PurchaseOrderService } from "../service/purchase-order.service";
import { GridOptions } from "ag-grid-community";
import { DomSanitizer } from '@angular/platform-browser';
import { IPurchaseOrder } from '../model/IPurchaseOrder';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DocumentStatus } from 'src/app/views/shared/AppEnum';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';

@Component({
  selector: 'kt-print-purchase-order',
  templateUrl: './print-purchase-order.component.html',
  styleUrls: ['./print-purchase-order.component.scss']
})

export class PrintPurchaseOrderComponent extends AppComponentBase implements OnInit {

    gridOptions: GridOptions;
    purchaseOrderMaster: IPurchaseOrder | any;
    purchaseOrderLines: any;
    showReceived: boolean = false;
    edinfini : boolean;
    sbbu : boolean;
    vizalys : boolean;
    localsto : any ;
    className : any;

      constructor( private purchaseOrderService: PurchaseOrderService,
                   private activatedRoute: ActivatedRoute,
                   private cDRef: ChangeDetectorRef,
                   public sanitizer: DomSanitizer,
               public dynamicColorChanging : DynamicColorChangeService,
                   injector: Injector
                 ) { super(injector) }

    ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params => {
        const id = +params.get('id');
        if(id){
          this.getPurchaseOrderMaster(id);
        }
      });

      this.dynamicColorChanging.global_color.subscribe((res: any) => {

        if (localStorage.getItem('global_color')) {
          this.localsto = JSON.parse(localStorage.getItem('global_color'))
          this.edinfini = this.localsto.edinfini_true;
          this.vizalys = this.localsto.vizalys_true;
          this.sbbu = this.localsto.nawabshah_true;
        }
        else {
          this.localsto = res;
          this.edinfini = this.localsto.edinfini_true;
          this.vizalys = this.localsto.vizalys_true;
          this.sbbu = this.localsto.nawabshah_true;
        }
  
        if(this.edinfini){
          this.className = 'edinfini row'
        }
        else if(this.sbbu){
          this.className = 'sbbu row'
        }
        else if(this.vizalys){
          this.className = 'vizalys row'
        }
  
        this.cDRef.detectChanges()
      })
    }

    printDiv(divName : any) {
      const printContents = document.getElementById(divName).innerHTML;
      window.document.body.innerHTML = printContents
      window.document.append('<link rel="stylesheet" href="print-bill.component.scss">')
      window.print();
      window.document.close();
    }

    getPurchaseOrderMaster(id: number){
      this.purchaseOrderService.getPurchaseOrderById(id).subscribe(res => {
        this.purchaseOrderMaster = res.result;
          this.purchaseOrderLines = res.result.purchaseOrderLines;
         
          if([DocumentStatus.Draft , DocumentStatus.Rejected , DocumentStatus.Submitted].includes(this.purchaseOrderMaster.state)) {
            this.showReceived = false;
          }
          else {
            this.showReceived = true;
          }
          this.cDRef.markForCheck();
        })
    }

    printForm(){
      window.print();
    }
  }

 



