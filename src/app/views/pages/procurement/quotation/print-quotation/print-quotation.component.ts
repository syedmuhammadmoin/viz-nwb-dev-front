import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import { ActivatedRoute, Params} from "@angular/router";
import { QuotationService} from "../service/quotation.service";
import { GridOptions} from "ag-grid-community";
import { DomSanitizer} from "@angular/platform-browser";
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IQuotation } from '../model/IQuotation';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';

@Component({
  selector: 'kt-print-quotation',
  templateUrl: './print-quotation.component.html',
  styleUrls: ['./print-quotation.component.scss']
})

export class PrintQuotationComponent extends AppComponentBase implements OnInit {

  gridOptions: GridOptions;
  quotationMaster: any;
  quotationLines: any;
  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;
  className : any;

  constructor( private quotationService: QuotationService,
               private activatedRoute: ActivatedRoute,
               private cdRef: ChangeDetectorRef,
               public dynamicColorChanging : DynamicColorChangeService,
               public sanitizer: DomSanitizer,
               injector: Injector
             ) { super(injector) }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if(id){
        this.getQuotationData(id);
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
    window.document.append('<link rel="stylesheet" href="src/styles.scss">')
    window.print();
    window.document.close();
  }

  getQuotationData(id: number){
    this.quotationService.getQuotationById(id).subscribe((res: IApiResponse<IQuotation>) => {
        this.quotationMaster = res.result;
        this.quotationLines = res.result.quotationLines;
        this.cdRef.markForCheck();
      })
  }
}
