import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import { PurchaseOrderService } from "../service/purchase-order.service";
import { GridOptions } from "ag-grid-community";
import { DomSanitizer } from '@angular/platform-browser';
import { IPurchaseOrder } from '../model/IPurchaseOrder';
import { AppComponent } from 'src/app/app.component';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DocumentStatus } from 'src/app/views/shared/AppEnum';

@Component({
  selector: 'kt-print-purchase-order',
  templateUrl: './print-purchase-order.component.html',
  styleUrls: ['./print-purchase-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PrintPurchaseOrderComponent extends AppComponentBase implements OnInit {

    gridOptions: GridOptions;
    purchaseOrderMaster: IPurchaseOrder | any;
    purchaseOrderLines: any;
    showReceived: boolean = false;
  
    // totalBeforeTax: number;
    // totalTax: number;

      constructor( private purchaseOrderService: PurchaseOrderService,
                   private activatedRoute: ActivatedRoute,
                   private cDRef: ChangeDetectorRef,
                   public sanitizer: DomSanitizer,
                   injector: Injector
                 ) { super(injector) }

    ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params => {
        const id = +params.get('id');
        if(id){
          this.getPurchaseOrderMaster(id);
        }
      });
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
          // this.totalBeforeTax = this.purchaseOrderLines.reduce((total, obj) => (obj.quantity * obj.cost) + total, 0);
          // this.totalTax = this.purchaseOrderLines.reduce((total, obj) => (obj.quantity * obj.cost * obj.tax) / 100 + total, 0);

          if([DocumentStatus.Draft , DocumentStatus.Rejected , DocumentStatus.Submitted].includes(this.purchaseOrderMaster.state)) {
            this.showReceived = false;
          }
          else {
            this.showReceived = true;
          }
          this.cDRef.markForCheck();
        })
    }
  }

 



