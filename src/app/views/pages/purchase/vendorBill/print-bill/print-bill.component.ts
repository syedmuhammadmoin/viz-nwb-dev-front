import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {VendorBillService} from "../services/vendor-bill.service";
import {GridOptions} from "ag-grid-community";
import {DomSanitizer} from "@angular/platform-browser";


@Component({
  selector: 'kt-print-bill',
  templateUrl: './print-bill.component.html',
  styleUrls: ['./print-bill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PrintBillComponent implements OnInit {

  gridOptions: GridOptions;
  masterData: any;
  billLines: any;

  constructor( private vendorBillService: VendorBillService,
               private activatedRoute: ActivatedRoute,
               private cDRef: ChangeDetectorRef,
               public sanitizer: DomSanitizer
             ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if(id){
        this.getVendorBillMasterData(id);
      }
    });
  }

  //  totalBeforeTax: number;
  //  totalTax: number;

  printDiv(divName : any) {
    const printContents = document.getElementById(divName).innerHTML;
    window.document.body.innerHTML = printContents
    window.document.append('<link rel="stylesheet" href="print-bill.component.scss">')
    window.print();
    window.document.close();
  }

  getVendorBillMasterData(id: number){
    this.vendorBillService.getVendorBillById(id).subscribe(res =>
      {
        this.masterData = res.result;
        this.billLines = res.result.billLines;
        // this.totalBeforeTax = this.billLines.reduce((total, obj) => (obj.quantity * obj.price) + total, 0);
        // this.totalTax = this.billLines.reduce((total, obj) => (obj.quantity * obj.price * obj.tax) / 100 + total, 0);
        this.cDRef.markForCheck();
      }
      , (err: any) => console.log(err));
  }
}


