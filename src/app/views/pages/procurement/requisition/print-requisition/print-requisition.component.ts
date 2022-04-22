import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params} from "@angular/router";
import { GridOptions} from "ag-grid-community";
import { DomSanitizer} from "@angular/platform-browser";
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IRequisition } from '../model/IRequisition';
import { IRequisitionLines } from '../model/IRequisitionLines';
import { RequisitionService } from '../service/requisition.service';

@Component({
  selector: 'kt-print-requisition',
  templateUrl: './print-requisition.component.html',
  styleUrls: ['./print-requisition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PrintRequisitionComponent implements OnInit {

  gridOptions: GridOptions;
  requisitionMaster: IRequisition | any;
  requisitionLines: IRequisitionLines[];

  constructor( private requisitionService: RequisitionService,
               private activatedRoute: ActivatedRoute,
               private cdr: ChangeDetectorRef,
               public sanitizer: DomSanitizer
             ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if(id){
        this.getRequisitionData(id);
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

  getRequisitionData(id: number){
    this.requisitionService.getRequisitionById(id).subscribe((res: IApiResponse<IRequisition>) => {
        this.requisitionMaster = res.result;
        this.requisitionLines = res.result.requisitionLines;
        this.cdr.markForCheck();
      })
  }
}



