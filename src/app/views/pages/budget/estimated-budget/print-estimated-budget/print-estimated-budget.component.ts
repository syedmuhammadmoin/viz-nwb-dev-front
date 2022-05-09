import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params} from "@angular/router";
import { GridOptions} from "ag-grid-community";
import { DomSanitizer} from "@angular/platform-browser";
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IEstimatedBudget } from '../model/IEstimatedBudget';
import { IEstimatedBudgetLines } from '../model/IEstimatedBudgetLines';
import { EstimatedBudgetService } from '../service/estimated-budget.service';
import { CalculationType } from 'src/app/views/shared/AppEnum';

@Component({
  selector: 'kt-print-estimated-budget',
  templateUrl: './print-estimated-budget.component.html',
  styleUrls: ['./print-estimated-budget.component.scss']
})
export class PrintEstimatedBudgetComponent implements OnInit {

  gridOptions: GridOptions;
  estimatedBudgetMaster: IEstimatedBudget | any;
  estimatedBudgetLines: IEstimatedBudgetLines[] | any;
  calculationType = CalculationType

  constructor( private _estimatedBudgetService: EstimatedBudgetService,
               private activatedRoute: ActivatedRoute,
               private cdr: ChangeDetectorRef,
               public sanitizer: DomSanitizer
             ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if(id){
        this.getEstimatedBudgetData(id);
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

  getEstimatedBudgetData(id: number){
    this._estimatedBudgetService.getEstimatedBudgetById(id).subscribe((res: IApiResponse<IEstimatedBudget>) =>{
        this.estimatedBudgetMaster = res.result;
        this.estimatedBudgetLines = res.result.estimatedBudgetLines;
        // this.budgetLines.forEach((line: any) => {
        //   this.totalAmount += line.amount;
        // })
        this.cdr.markForCheck();
      })
  }
}



