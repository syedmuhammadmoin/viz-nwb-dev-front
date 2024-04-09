import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import { GridOptions } from "ag-grid-community";
import { DomSanitizer } from '@angular/platform-browser';
import { IIssuanceReturn } from '../model/IIssuanceReturn';
import { IIssuanceReturnLines } from '../model/IIssuanceReturnLines';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IssuanceReturnService } from '../service/issuance-return.service';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';

@Component({
  selector: 'kt-print-issuance-return',
  templateUrl: './print-issuance-return.component.html',
  styleUrls: ['./print-issuance-return.component.scss']
})

export class PrintIssuanceReturnComponent extends AppComponentBase  implements OnInit {

    gridOptions: any;;
    issuanceReturnMaster: IIssuanceReturn | any;
    issuanceReturnLines: IIssuanceReturnLines[] | any;
    edinfini : boolean;
    sbbu : boolean;
    vizalys : boolean;
    localsto : any ;
    className : any;

    constructor( private issuanceReturnService : IssuanceReturnService,
                 private activatedRoute: ActivatedRoute,
                 private cDRef: ChangeDetectorRef,
               public dynamicColorChanging : DynamicColorChangeService,
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

    printForm(){
      window.print();
    }
  }

 









