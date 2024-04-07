import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params} from "@angular/router";
import { GridOptions} from "ag-grid-community";
import { DomSanitizer} from "@angular/platform-browser";
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';
import { IRequestRequisition } from '../model/IRequestRequisition';
import { IRequestRequisitionLines } from '../model/IRequestRequisitionLine';
import { RequestRequisitionService } from '../service/request-requisition.service';

@Component({
  selector: 'kt-print-request-requisition',
  templateUrl: './print-request-requisition.component.html',
  styleUrls: ['./print-request-requisition.component.scss']
})
export class PrintRequestRequisitionComponent implements OnInit {

  gridOptions: GridOptions;
  requestRequisitionMaster: IRequestRequisition | any;
  requestRequisitionLines: IRequestRequisitionLines[] | any;
  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;
  className : any;

  constructor( private requestRequisitionService: RequestRequisitionService,
               private activatedRoute: ActivatedRoute,
               private cdRef: ChangeDetectorRef,
               public dynamicColorChanging : DynamicColorChangeService,
               public sanitizer: DomSanitizer
             ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if(id){
        this.getRequisitionData(id);
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

      this.cdRef.detectChanges()
    })
  }  

  printDiv(divName : any) {
    const printContents = document.getElementById(divName).innerHTML;
    window.document.body.innerHTML = printContents
    window.document.append('<link rel="stylesheet" href="print-invoice.component.scss">')
    window.print();
    window.document.close();
  }

  getRequisitionData(id: number){
    this.requestRequisitionService.getRequestRequisitionById(id).subscribe((res: IApiResponse<IRequestRequisition>) => {
        this.requestRequisitionMaster = res.result;
        this.requestRequisitionLines = res.result.requestLines;
        this.cdRef.markForCheck();
      })
  }

  printForm(){
    window.print();
  }
}



