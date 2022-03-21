import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Params} from "@angular/router";
import { SaleOrderService } from "../../service/sale-order.service";
import { GridOptions } from "ag-grid-community";
import { DomSanitizer } from '@angular/platform-browser';
import { ISalesOrder } from '../../model/ISalesOrder';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ISalesOrderLines } from '../../model/ISalesOrderLines';

    @Component({
      selector: 'kt-print-sales-order',
      templateUrl: './print-sales-order.component.html',
      styleUrls: ['./print-sales-order.component.scss'],
      changeDetection: ChangeDetectionStrategy.OnPush
    })

export class PrintSalesOrderComponent implements OnInit {

    gridOptions: GridOptions;
    masterData: any;
    salesOrderLines: any;
      
    totalBeforeTax: number;
    totalTax: number;

      constructor( private saleOrderService: SaleOrderService,
                   private activatedRoute: ActivatedRoute,
                   private cDRef: ChangeDetectorRef,
                   public sanitizer: DomSanitizer
      ) {
        this.gridOptions = ({} as GridOptions);
        }

    ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe((params: Params) => {
        const id = +params.get('id');
        if(id){
          this.getSalesOrderData(id);
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

    getSalesOrderData(id: number){
      this.saleOrderService.getSalesOrderById(id).subscribe((res: IApiResponse<ISalesOrder>) => {
          this.masterData = res.result;
          this.salesOrderLines = res.result.salesOrderLines;
          this.totalBeforeTax = this.salesOrderLines.reduce((total: number, obj: ISalesOrderLines) => (obj.quantity * obj.price) + total, 0);
          this.totalTax = this.salesOrderLines.reduce((total: number, obj: ISalesOrderLines) => (obj.quantity * obj.price * obj.tax) / 100 + total, 0);
          this.cDRef.markForCheck();
        })
    }
  }

 
