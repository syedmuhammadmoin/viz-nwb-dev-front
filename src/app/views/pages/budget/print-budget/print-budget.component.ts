import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params} from "@angular/router";
import { GridOptions} from "ag-grid-community";
import { DomSanitizer} from "@angular/platform-browser";
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IBudgetResponse } from '../model/IBudgetResponse';
import { IBudgetLines } from '../model/IBudgetLines';
import { BudgetService } from '../service/budget.service';

@Component({
  selector: 'kt-print-budget',
  templateUrl: './print-budget.component.html',
  styleUrls: ['./print-budget.component.scss']
})

export class PrintBudgetComponent implements OnInit {

  gridOptions: GridOptions;
  budgetMaster: IBudgetResponse;
  budgetLines: IBudgetLines[];
  totalAmount: number;

  constructor( private _budgetService: BudgetService,
               private activatedRoute: ActivatedRoute,
               private cdr: ChangeDetectorRef,
               public sanitizer: DomSanitizer
             ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if(id){
        this.getBudgetData(id);
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

  getBudgetData(id: number){
    this._budgetService.getBudgetById(id).subscribe((res: IApiResponse<IBudgetResponse>) =>{
        console.log(res.result)
        this.budgetMaster = res.result;
        this.budgetLines = res.result.budgetLines;
        this.budgetLines.forEach((line: any) => {
          this.totalAmount += line.amount;
        })
        this.cdr.markForCheck();
      })
  }
}
