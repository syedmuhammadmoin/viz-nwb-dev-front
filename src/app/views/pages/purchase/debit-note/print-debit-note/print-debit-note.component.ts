import { ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import { DebitNoteService} from "../service/debit-note.service";
import { GridOptions} from "ag-grid-community";
import { DomSanitizer } from '@angular/platform-browser';
import { IDebitNoteLines } from '../model/IDebitNoteLines';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';

@Component({
  selector: 'kt-print-debit-note',
  templateUrl: './print-debit-note.component.html',
  styleUrls: ['./print-debit-note.component.scss']
})

export class PrintDebitNoteComponent extends AppComponentBase implements OnInit {

    gridOptions: GridOptions;
    debitNoteMaster: any;
    debitNoteLines: any
    totalBeforeTax: number;
    totalTax: number;
    totalAmount: number;
    edinfini : boolean;
    sbbu : boolean;
    vizalys : boolean;
    localsto : any ;
    className : any;
  
    constructor( private debitNoteService: DebitNoteService,
                 private activatedRoute: ActivatedRoute,
                 private cdRef: ChangeDetectorRef,
                 public dynamicColorChanging : DynamicColorChangeService,
                 public  sanitizer: DomSanitizer,
                 injector: Injector
             ) { super(injector) }
  
    ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params => {
        const id = +params.get('id');
        if(id){
          this.getDebitNoteMasterData(id);
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
  
    getDebitNoteMasterData(id: number){
      this.debitNoteService.getDebitNoteById(id).subscribe(res => {
        this.debitNoteMaster = res.result;
        this.debitNoteLines = res.result.debitNoteLines;
        this.totalAmount = this.debitNoteMaster.totalAmount;
        this.totalBeforeTax = this.debitNoteLines.reduce((total: number, obj: IDebitNoteLines) => (obj.quantity * obj.cost) + total, 0);
        this.totalTax = this.debitNoteLines.reduce((total: number, obj: IDebitNoteLines) => (obj.quantity * obj.cost * obj.tax) / 100 + total, 0);
        this.cdRef.markForCheck();
        })
    }

    printForm(){
      window.print();
    }
  }
  
  
  

