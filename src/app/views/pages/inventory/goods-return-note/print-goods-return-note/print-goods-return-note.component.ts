import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import { DomSanitizer } from '@angular/platform-browser';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IGoodsReturnNote } from '../model/IGoodsReturnNote';
import { IGoodsReturnNoteLines } from '../model/IGoodsReturnNoteLines';
import { GridOptions } from 'ag-grid-community';
import { GoodsReturnNoteService } from '../service/goods-return-note.service';

@Component({
  selector: 'kt-print-goods-return-note',
  templateUrl: './print-goods-return-note.component.html',
  styleUrls: ['./print-goods-return-note.component.scss']
})

export class PrintGoodsReturnNoteComponent extends AppComponentBase implements OnInit {

    gridOptions: GridOptions;
    goodsReturnNoteMaster: IGoodsReturnNote | any;
    goodsReturnNoteLines: IGoodsReturnNoteLines;

    constructor( private goodsReturnNoteService : GoodsReturnNoteService,
                 private activatedRoute: ActivatedRoute,
                 private cDRef: ChangeDetectorRef,
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
  }

 









