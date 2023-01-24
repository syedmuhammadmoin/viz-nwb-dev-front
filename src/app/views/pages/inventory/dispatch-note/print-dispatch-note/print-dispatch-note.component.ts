import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import { GridOptions } from "ag-grid-community";
import { DomSanitizer } from '@angular/platform-browser';
import { DispatchNoteService } from '../service/dispatch-note.service';

@Component({
  selector: 'kt-print-dispatch-note',
  templateUrl: './print-dispatch-note.component.html',
  styleUrls: ['./print-dispatch-note.component.scss']
})

export class PrintDispatchNoteComponent implements OnInit {

    gridOptions: GridOptions;
    gdnMaster: any;
    gdnLines :any;

    constructor( private dispatchNoteService : DispatchNoteService,
                 private activatedRoute: ActivatedRoute,
                 private cDRef: ChangeDetectorRef,
                 public  sanitizer: DomSanitizer
               ) { }

    ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params => {
        const id = +params.get('id');
        if(id){
          this.getDispatchNoteMasterData(id);
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

    getDispatchNoteMasterData(id: number){
      this.dispatchNoteService.getDispatchNoteMasterById(id).subscribe(res =>
        {
        this.gdnMaster = res.result;
        this.gdnLines = res.result.gdnLines;
          this.cDRef.markForCheck();
        })
    }
  }

 









