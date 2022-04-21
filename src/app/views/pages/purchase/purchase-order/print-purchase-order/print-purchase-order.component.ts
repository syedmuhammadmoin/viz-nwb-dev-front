import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import { PurchaseOrderService } from "../service/purchase-order.service";
import { GridOptions } from "ag-grid-community";
import { DomSanitizer } from '@angular/platform-browser';
import { IPurchaseOrder } from '../model/IPurchaseOrder';

@Component({
  selector: 'kt-print-purchase-order',
  templateUrl: './print-purchase-order.component.html',
  styleUrls: ['./print-purchase-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PrintPurchaseOrderComponent implements OnInit {

    gridOptions: GridOptions;
    masterData: IPurchaseOrder | any;
    purchaseOrderLines: any;
  
    totalBeforeTax: number;
    totalTax: number;

      constructor( private purchaseOrderService: PurchaseOrderService,
                   private activatedRoute: ActivatedRoute,
                   private cDRef: ChangeDetectorRef,
                   public sanitizer: DomSanitizer
                 ) { }

    ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params => {
        const id = +params.get('id');
        if(id){
          this.getPurchaseOrderMasterData(id);
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

    getPurchaseOrderMasterData(id: number){
      this.purchaseOrderService.getPurchaseOrderById(id).subscribe(res => {
        this.masterData = res.result;
        console.log(res.result)
          this.purchaseOrderLines = res.result.purchaseOrderLines;
          this.totalBeforeTax = this.purchaseOrderLines.reduce((total, obj) => (obj.quantity * obj.cost) + total, 0);
          this.totalTax = this.purchaseOrderLines.reduce((total, obj) => (obj.quantity * obj.cost * obj.tax) / 100 + total, 0);
          this.cDRef.markForCheck();
        },
        (err: any) => {
          console.log(err);
        })
    }
  }

 



