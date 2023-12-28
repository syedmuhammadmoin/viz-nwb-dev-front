import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';
import { IPettyCashEntryLines } from '../model/IPettyCashEntryLines';
import { PettyCashService } from '../service/petty-cash.service';
import { IPettyCashEntry } from '../model/IPettyCashEntry';

@Component({
  selector: 'kt-print-petty-cash',
  templateUrl: './print-petty-cash.component.html',
  styleUrls: ['./print-petty-cash.component.scss']
})
export class PrintPettyCashComponent extends AppComponentBase implements OnInit {

  gridOptions: GridOptions;
  journalEntryMaster: any;
  journalEntryLines: IPettyCashEntryLines[];
  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;
  className : any;

  //Injecting Dependencies
  constructor( private journalEntryService : PettyCashService,
               private activatedRoute: ActivatedRoute,
               private cDRef: ChangeDetectorRef,
               public dynamicColorChanging : DynamicColorChangeService,
               public  sanitizer: DomSanitizer,
               injector: Injector
             ) { super(injector) }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if(id){
        this.getJournalEntryMasterData(id);
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

  printDiv(divName : string) {
    const printContents = document.getElementById(divName).innerHTML;
    window.document.body.innerHTML = printContents
    window.document.append('<link rel="stylesheet" href="print-bill.component.scss">')
    window.print();
    window.document.close();
  }

  getJournalEntryMasterData(id: number){
    this.journalEntryService.getPettyCashEntryById(id).subscribe((res: IApiResponse<IPettyCashEntry>) =>{
        this.journalEntryMaster = res.result;
        this.journalEntryLines = res.result.pettyCashLines;
        this.cDRef.markForCheck();
      })
  }
}
