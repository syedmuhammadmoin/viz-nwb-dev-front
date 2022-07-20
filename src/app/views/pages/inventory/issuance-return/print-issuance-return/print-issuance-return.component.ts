import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import { GridOptions } from "ag-grid-community";
import { DomSanitizer } from '@angular/platform-browser';
import { IIssuanceReturn } from '../model/IissuanceReturn';
import { IIssuanceReturnLines } from '../model/IissuanceReturnLines';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IssuanceReturnService } from '../service/issuance-return.service';

@Component({
  selector: 'kt-print-issuance-return',
  templateUrl: './print-issuance-return.component.html',
  styleUrls: ['./print-issuance-return.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})

export class PrintIssuanceReturnComponent extends AppComponentBase  implements OnInit {

    gridOptions: GridOptions;
    issuanceReturnMaster: IIssuanceReturn | any;
    issuanceReturnLines: IIssuanceReturnLines;

    constructor( private issuanceReturnService : IssuanceReturnService,
                 private activatedRoute: ActivatedRoute,
                 private cDRef: ChangeDetectorRef,
                 public  sanitizer: DomSanitizer,
                 injector: Injector
               ) { super(injector) }

    ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params => {
        const id = +params.get('id');
        if(id){
          this.getIssuanceReturnData(id);
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

    getIssuanceReturnData(id: number){
      this.issuanceReturnService.getIssuanceReturnById(id).subscribe(res =>
        {
        this.issuanceReturnMaster = res.result;
        this.issuanceReturnLines = res.result.issuanceReturnLines;
          this.cDRef.markForCheck();
        })
    }
  }

 









