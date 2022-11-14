import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { GridOptions } from "ag-grid-community";
import { DomSanitizer } from "@angular/platform-browser";
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BusinessPartnerService } from '../service/businessPartner.service';


@Component({
  selector: 'kt-print-business-partner',
  templateUrl: './print-business-partner.component.html',
  styleUrls: ['./print-business-partner.component.scss']
})
export class PrintBusinessPartnerComponent extends AppComponentBase implements OnInit {

  gridOptions: GridOptions;
  data: any;

  constructor( private businessPartnerService: BusinessPartnerService,
               private activatedRoute: ActivatedRoute,
               private cdRef: ChangeDetectorRef,
               public sanitizer: DomSanitizer,
               injector: Injector
             ) { super(injector) }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      if(id){
        this.getBusinessPartnerData(id);
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

  getBusinessPartnerData(id: number){
    this.businessPartnerService.getBusinessPartner(id).subscribe(res =>
      {
        this.data = res.result;
        this.cdRef.markForCheck();
      })
  }
}













