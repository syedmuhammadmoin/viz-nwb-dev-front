import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params} from "@angular/router";
import { GridOptions} from "ag-grid-community";
import { DomSanitizer} from "@angular/platform-browser";
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IEstimatedBudget } from '../model/IEstimatedBudget';
import { IEstimatedBudgetLines } from '../model/IEstimatedBudgetLines';
import { EstimatedBudgetService } from '../service/estimated-budget.service';
import { CalculationType } from 'src/app/views/shared/AppEnum';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';

@Component({
  selector: 'kt-print-estimated-budget',
  templateUrl: './print-estimated-budget.component.html',
  styleUrls: ['./print-estimated-budget.component.scss']
})
export class PrintEstimatedBudgetComponent implements OnInit {

  gridOptions: any;
  estimatedBudgetMaster: IEstimatedBudget | any;
  estimatedBudgetLines: IEstimatedBudgetLines[] | any;
  calculationType = CalculationType;
  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;
  className : any;

  //Injecting Dependencies
  constructor( private _estimatedBudgetService: EstimatedBudgetService,
               private activatedRoute: ActivatedRoute,
               public dynamicColorChanging : DynamicColorChangeService,
               private cdRef: ChangeDetectorRef,
               public sanitizer: DomSanitizer
             ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if(id){
        this.getEstimatedBudgetData(id);
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

  getEstimatedBudgetData(id: number){
    this._estimatedBudgetService.getEstimatedBudgetById(id).subscribe((res: IApiResponse<IEstimatedBudget>) =>{
        this.estimatedBudgetMaster = res.result;
        this.estimatedBudgetLines = res.result.estimatedBudgetLines;
        
        this.cdRef.markForCheck();
      })
  }
  printForm(){
    window.print();
  }
}



