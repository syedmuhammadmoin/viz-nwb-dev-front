import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { GridOptions } from "ag-grid-community";
import { DomSanitizer } from "@angular/platform-browser";
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { BusinessPartnerService } from '../service/businessPartner.service';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';


@Component({
  selector: 'kt-print-business-partner',
  templateUrl: './print-business-partner.component.html',
  styleUrls: ['./print-business-partner.component.scss']
})
export class PrintBusinessPartnerComponent extends AppComponentBase implements OnInit {

  gridOptions: GridOptions;
  data: any;
  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;
  className : any;

  constructor( private businessPartnerService: BusinessPartnerService,
               private activatedRoute: ActivatedRoute,
               private cdRef: ChangeDetectorRef,
               public dynamicColorChanging : DynamicColorChangeService,
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

      this.cdRef.detectChanges()
    })
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













