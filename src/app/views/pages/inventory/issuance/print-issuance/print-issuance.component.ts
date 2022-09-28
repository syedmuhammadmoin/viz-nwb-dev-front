import { ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import { ActivatedRoute, Params} from "@angular/router";
import { GridOptions} from "ag-grid-community";
import { DomSanitizer} from "@angular/platform-browser";
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IssuanceService } from '../service/issuance.service';
import { IIssuance } from '../model/IIssuance';

@Component({
  selector: 'kt-print-issuance',
  templateUrl: './print-issuance.component.html',
  styleUrls: ['./print-issuance.component.scss']
})

export class PrintIssuanceComponent extends AppComponentBase implements OnInit {

  gridOptions: GridOptions;
  issuanceMaster: any;
  issuanceLines: any;

  constructor( private issuanceService: IssuanceService,
               private activatedRoute: ActivatedRoute,
               private cdr: ChangeDetectorRef,
               public sanitizer: DomSanitizer,
               injector: Injector
             ) { super(injector) }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if(id){
        this.getIssuanceData(id);
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

  getIssuanceData(id: number){
    this.issuanceService.getIssuanceById(id).subscribe((res: IApiResponse<IIssuance>) => {
        this.issuanceMaster = res.result;
        this.issuanceLines = res.result.issuanceLines;
        this.cdr.markForCheck();
      })
  }
}


