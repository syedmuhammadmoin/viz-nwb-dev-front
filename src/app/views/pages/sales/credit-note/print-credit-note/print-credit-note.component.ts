import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import { ActivatedRoute, Params} from "@angular/router";
import { CreditNoteService} from "../service/credit-note.service";
import { GridOptions} from "ag-grid-community";
import { DomSanitizer } from '@angular/platform-browser';
import { ICreditNoteLines } from '../model/ICreditNoteLines';
import { ICreditNote } from '../model/ICreditNote';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';

@Component({
  selector: 'kt-print-credit-note',
  templateUrl: './print-credit-note.component.html',
  styleUrls: ['./print-credit-note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PrintCreditNoteComponent extends AppComponentBase implements OnInit {

    gridOptions: GridOptions;
    creditNoteMaster: ICreditNote | any;
    creditNoteLines: ICreditNoteLines | any;

    totalBeforeTax: number;
    totalTax: number;
    totalAmount: number;
  
    constructor( private creditNoteService: CreditNoteService,
                 private activatedRoute: ActivatedRoute,
                 public  sanitizer: DomSanitizer,
                 private cdr: ChangeDetectorRef,
                 injector: Injector
               ) {  super(injector)}
  
    ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe((params: Params) => {
        const id = +params.get('id');
        if(id){
          this.getCreditNoteData(id);
        }
      });
    }
  
    printDiv(divName : any) {
      const printContents = document.getElementById(divName).innerHTML;
      window.document.body.innerHTML = printContents
      window.document.append('<link rel="stylesheet" href="print-invoice.component.scss">')
      window.print();
      window.document.close();
    }
  
    getCreditNoteData(id: number){
      this.creditNoteService.getCreditNoteById(id).subscribe((res: IApiResponse<ICreditNote>) =>
        {
        this.creditNoteMaster = res.result;
        this.creditNoteLines = res.result.creditNoteLines;
        this.totalAmount = this.creditNoteMaster.totalAmount;
        this.totalBeforeTax = this.creditNoteLines.reduce((total: number, obj: ICreditNoteLines) => (obj.quantity * obj.price) + total, 0);
        this.totalTax = this.creditNoteLines.reduce((total: number, obj: ICreditNoteLines) => (obj.quantity * obj.price * obj.tax) / 100 + total, 0);
        this.cdr.markForCheck();
        this.cdr.detectChanges()
        })
    }
}
  


