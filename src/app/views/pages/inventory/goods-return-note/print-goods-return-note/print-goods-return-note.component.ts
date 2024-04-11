import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import { DomSanitizer } from '@angular/platform-browser';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IGoodsReturnNote } from '../model/IGoodsReturnNote';
import { IGoodsReturnNoteLines } from '../model/IGoodsReturnNoteLines';
import { GridOptions } from 'ag-grid-community';
import { GoodsReturnNoteService } from '../service/goods-return-note.service';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';

@Component({
  selector: 'kt-print-goods-return-note',
  templateUrl: './print-goods-return-note.component.html',
  styleUrls: ['./print-goods-return-note.component.scss']
})

export class PrintGoodsReturnNoteComponent extends AppComponentBase implements OnInit {

    gridOptions: any;
    goodsReturnNoteMaster: IGoodsReturnNote | any;
    goodsReturnNoteLines: IGoodsReturnNoteLines[] | any;
    edinfini : boolean;
    sbbu : boolean;
    vizalys : boolean;
    localsto : any ;
    className : any;

    constructor( private goodsReturnNoteService : GoodsReturnNoteService,
                 private activatedRoute: ActivatedRoute,
                 private cDRef: ChangeDetectorRef,
                 public dynamicColorChanging : DynamicColorChangeService,
                 public  sanitizer: DomSanitizer,
                 injector: Injector
               ) { super(injector) }

    ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params => {
        const id = +params.get('id');
        if(id){
          this.getGoodsReturnNoteMasterData(id);
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

    printDiv(divName : any) {
      const printContents = document.getElementById(divName).innerHTML;
      window.document.body.innerHTML = printContents
      window.document.append('<link rel="stylesheet" href="print-bill.component.scss">')
      window.print();
      window.document.close();
    }

    getGoodsReturnNoteMasterData(id: number){
      this.goodsReturnNoteService.getGoodsReturnNoteById(id).subscribe(res =>
        {
        this.goodsReturnNoteMaster = res.result;
        this.goodsReturnNoteLines = res.result.goodsReturnNoteLines;
          this.cDRef.markForCheck();
        })
    }
    printForm(){
      window.print();
    }
   
  }

 









