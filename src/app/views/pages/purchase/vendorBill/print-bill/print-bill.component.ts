import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {VendorBillService} from "../services/vendor-bill.service";
import {GridOptions} from "ag-grid-community";
import {DomSanitizer} from "@angular/platform-browser";
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';


@Component({
  selector: 'kt-print-bill',
  templateUrl: './print-bill.component.html',
  styleUrls: ['./print-bill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PrintBillComponent extends AppComponentBase implements OnInit {

  gridOptions: GridOptions;
  masterData: any;
  billLines: any;
  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;
  className : any;

  constructor( private vendorBillService: VendorBillService,
               private activatedRoute: ActivatedRoute,
               private cDRef: ChangeDetectorRef,
               public dynamicColorChanging : DynamicColorChangeService,
               public sanitizer: DomSanitizer,
               injector: Injector
             ) { super(injector) }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if(id){
        this.getVendorBillMasterData(id);
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


