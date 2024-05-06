import { ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import { ActivatedRoute, Params} from "@angular/router";
import { CreditNoteService} from "../service/credit-note.service";
import { GridOptions} from "ag-grid-community";
import { DomSanitizer } from '@angular/platform-browser';
import { ICreditNoteLines } from '../model/ICreditNoteLines';
import { ICreditNote } from '../model/ICreditNote';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';

@Component({
  selector: 'kt-print-credit-note',
  templateUrl: './print-credit-note.component.html',
  styleUrls: ['./print-credit-note.component.scss']
})

export class PrintCreditNoteComponent extends AppComponentBase implements OnInit {

    gridOptions: GridOptions;
    creditNoteMaster: ICreditNote | any;
    creditNoteLines: ICreditNoteLines | any;

    totalBeforeTax: number;
    totalTax: number;
    totalAmount: number;
    edinfini : boolean;
    sbbu : boolean;
    vizalys : boolean;
    localsto : any ;
    className : any;
  
    constructor( private creditNoteService: CreditNoteService,
                 private activatedRoute: ActivatedRoute,
                 public  sanitizer: DomSanitizer,
                 private cdRef: ChangeDetectorRef,
                 public dynamicColorChanging : DynamicColorChangeService,
                 injector: Injector
               ) {  super(injector)}
  
    ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe((params: Params) => {
        const id = +params.get('id');
        if(id){
          this.getCreditNoteData(id);
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
      window.document.append('<link rel="stylesheet" href="print-invoice.component.scss">')
      window.print();
      window.document.close();
    }
  
    getCreditNoteData(id: number){
      this.creditNoteService.getCreditNoteById(id).subscribe((res: IApiResponse<ICreditNote>) => {
        this.creditNoteMaster = res.result;
        this.creditNoteLines = res.result.creditNoteLines;
        this.totalAmount = this.creditNoteMaster.totalAmount;
        this.totalBeforeTax = this.creditNoteLines.reduce((total: number, obj: ICreditNoteLines) => (obj.quantity * obj.price) + total, 0);
        this.totalTax = this.creditNoteLines.reduce((total: number, obj: ICreditNoteLines) => (obj.quantity * obj.price * obj.tax) / 100 + total, 0);
        this.cdRef.markForCheck();
        this.cdRef.detectChanges()
        })
    }
    
    printForm(){
      window.print();
    }

    
}
  


