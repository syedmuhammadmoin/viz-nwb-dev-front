import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import { GridOptions } from "ag-grid-community";
import { DomSanitizer } from '@angular/platform-browser';
import { GrnService } from '../service/grn.service';
import { IGRN } from '../model/IGRN';
import { IGRNLines } from '../model/IGRNLines';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';

@Component({
  selector: 'kt-print-grn',
  templateUrl: './print-grn.component.html',
  styleUrls: ['./print-grn.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})

export class PrintGrnComponent extends AppComponentBase implements OnInit {

    gridOptions: GridOptions;
    grnMaster: IGRN | any;
    grnLines: IGRNLines;
    edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;
  className : any;


    constructor( private grnService : GrnService,
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
          this.getGrnMasterData(id);
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

    getGrnMasterData(id: number){
      this.grnService.getGRNById(id).subscribe(res =>
        {
        this.grnMaster = res.result;
        this.grnLines = res.result.grnLines;
          this.cDRef.markForCheck();
        })
    }
  }

 






