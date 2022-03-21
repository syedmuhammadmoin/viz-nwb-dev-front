import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import { GridOptions } from "ag-grid-community";
import { DomSanitizer } from '@angular/platform-browser';
import { GrnService } from '../service/grn.service';

@Component({
  selector: 'kt-print-grn',
  templateUrl: './print-grn.component.html',
  styleUrls: ['./print-grn.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})

export class PrintGrnComponent implements OnInit {

    gridOptions: GridOptions;
    grnMaster: any;
    grnLines: any;

    constructor( private grnService : GrnService,
                 private activatedRoute: ActivatedRoute,
                 private cDRef: ChangeDetectorRef,
                 public  sanitizer: DomSanitizer
               ) { }

    ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params => {
        const id = +params.get('id');
          console.log(id);
        if(id){
          this.getGrnMasterData(id);
        }else{
          console.log('bong');
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
      this.grnService.getGRNMasterById(id).subscribe(res =>
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

 






