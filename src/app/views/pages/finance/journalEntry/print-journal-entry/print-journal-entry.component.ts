import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IJournalEntry } from '../model/IJournalEntry';
import { IJournalEntryLines } from '../model/IJournalEntryLines';
import { JournalEntryService } from '../services/journal-entry.service';

@Component({
  selector: 'kt-print-journal-entry',
  templateUrl: './print-journal-entry.component.html',
  styleUrls: ['./print-journal-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PrintJournalEntryComponent implements OnInit {

  gridOptions: GridOptions;
  journalEntryMaster: any;
  journalEntryLines: IJournalEntryLines[];

  constructor( private journalEntryService : JournalEntryService,
               private activatedRoute: ActivatedRoute,
               private cDRef: ChangeDetectorRef,
               public  sanitizer: DomSanitizer
             ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if(id){
        this.getJournalEntryMasterData(id);
      }else{
        console.log('bong');
      }
    });
  }

  printDiv(divName : string) {
    const printContents = document.getElementById(divName).innerHTML;
    window.document.body.innerHTML = printContents
    window.document.append('<link rel="stylesheet" href="print-bill.component.scss">')
    window.print();
    window.document.close();
  }

  getJournalEntryMasterData(id: number){
    this.journalEntryService.getJournalEntryById(id).subscribe((res: IApiResponse<IJournalEntry>) =>{
        this.journalEntryMaster = res.result;
        this.journalEntryLines = res.result.journalEntryLines;
        this.cDRef.markForCheck();
      })
  }
}
