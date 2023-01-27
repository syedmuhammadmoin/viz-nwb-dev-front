import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params} from "@angular/router";
import { GridOptions} from "ag-grid-community";
import { DomSanitizer} from "@angular/platform-browser";
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IRequisition } from '../model/IRequisition';
import { IRequisitionLines } from '../model/IRequisitionLines';
import { RequisitionService } from '../service/requisition.service';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';

@Component({
  selector: 'kt-print-requisition',
  templateUrl: './print-requisition.component.html',
  styleUrls: ['./print-requisition.component.scss']
})

export class PrintRequisitionComponent implements OnInit {

  gridOptions: GridOptions;
  requisitionMaster: IRequisition | any;
  requisitionLines: IRequisitionLines[];
  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;
  className : any;

  constructor( private requisitionService: RequisitionService,
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
    this.requisitionService.getRequisitionById(id).subscribe((res: IApiResponse<IRequisition>) => {
        this.requisitionMaster = res.result;
        this.requisitionLines = res.result.requisitionLines;
        this.cdRef.markForCheck();
      })
  }
}



