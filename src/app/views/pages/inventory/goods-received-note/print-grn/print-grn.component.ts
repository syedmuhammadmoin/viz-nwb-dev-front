import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import { GridOptions } from "ag-grid-community";
import { DomSanitizer } from '@angular/platform-browser';
import { GrnService } from '../service/grn.service';
import { IGRN } from '../model/IGRN';
import { IGRNLines } from '../model/IGRNLines';

@Component({
  selector: 'kt-print-grn',
  templateUrl: './print-grn.component.html',
  styleUrls: ['./print-grn.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})

export class PrintGrnComponent implements OnInit {

    gridOptions: GridOptions;
    grnMaster: IGRN | any;
    grnLines: IGRNLines;

    constructor( private grnService : GrnService,
                 private activatedRoute: ActivatedRoute,
                 private cDRef: ChangeDetectorRef,
                 public  sanitizer: DomSanitizer
               ) { }

    ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params => {
        const id = +params.get('id');
        if(id){
          this.getGrnMasterData(id);
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

    getGrnMasterData(id: number){
      this.grnService.getGRNById(id).subscribe(res =>
        {
        this.grnMaster = res.result;
        this.grnLines = res.result.grnLines;
          this.cDRef.markForCheck();
        },
        (err: any) => {
          console.log(err);
        })
    }
  }

 






