import { ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import { ActivatedRoute, Params} from "@angular/router";
import { GridOptions} from "ag-grid-community";
import { DomSanitizer} from "@angular/platform-browser";
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IBudgetResponse } from '../model/IBudgetResponse';
import { IBudgetLines } from '../model/IBudgetLines';
import { BudgetService } from '../service/budget.service';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';

@Component({
  selector: 'kt-print-budget',
  templateUrl: './print-budget.component.html',
  styleUrls: ['./print-budget.component.scss']
})

export class PrintBudgetComponent extends AppComponentBase implements OnInit {
 
  gridOptions: any;
  budgetMaster: IBudgetResponse;
  budgetLines: IBudgetLines[] | any;
  totalAmount: number = 0;
  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;
  className : any;

  constructor( private _budgetService: BudgetService,
               private activatedRoute: ActivatedRoute,
               private cdRef: ChangeDetectorRef,
               public sanitizer: DomSanitizer,
               public dynamicColorChanging : DynamicColorChangeService,
               injector: Injector
             ) { super(injector) }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if(id){
        this.getBudgetData(id);
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

  getBudgetData(id: number){
    this._budgetService.getBudgetById(id).subscribe((res: IApiResponse<IBudgetResponse>) =>{
        this.budgetMaster = res.result;
        this.budgetLines = res.result.budgetLines;
        this.budgetLines.forEach((line: any) => {
          this.totalAmount += line.amount;
        })
        this.cdRef.markForCheck();
      })
  }
  printForm(){
    window.print();
  }
}
