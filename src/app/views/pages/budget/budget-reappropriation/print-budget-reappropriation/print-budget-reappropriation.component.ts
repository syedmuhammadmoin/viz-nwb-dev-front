import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { CalculationType } from 'src/app/views/shared/AppEnum';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';
import { IBudget } from '../model/Ibudget';
import { IBudgetLines } from '../model/IbudgetLines';
import { BudgetReappropriationService } from '../service/budget-reappropriation.service';

@Component({
  selector: 'kt-print-budget-reappropriation',
  templateUrl: './print-budget-reappropriation.component.html',
  styleUrls: ['./print-budget-reappropriation.component.scss']
})
export class PrintBudgetReappropriationComponent implements OnInit {

  gridOptions: GridOptions;
  budgetReappropriationMaster: IBudget | any;
  budgetReapprolines: IBudgetLines[] | any;
  // calculationType = CalculationType;
  edinfini: boolean;
  sbbu: boolean;
  vizalys: boolean;
  localsto: any;
  className: any;

  //Injecting Dependencies
  constructor(private budgetReappropriationService: BudgetReappropriationService,
    private activatedRoute: ActivatedRoute,
    public dynamicColorChanging: DynamicColorChangeService,
    private cdRef: ChangeDetectorRef,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
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

      if (this.edinfini) {
        this.className = 'edinfini row'
      }
      else if (this.sbbu) {
        this.className = 'sbbu row'
      }
      else if (this.vizalys) {
        this.className = 'vizalys row'
      }

      this.cdRef.detectChanges()
    })
  }

  printDiv(divName: any) {
    const printContents = document.getElementById(divName).innerHTML;
    window.document.body.innerHTML = printContents
    window.document.append('<link rel="stylesheet" href="print-invoice.component.scss">')
    window.print();
    window.document.close();
  }

  getEstimatedBudgetData(id: number) {
    this.budgetReappropriationService.getBudgetReapproById(id).subscribe((res: IApiResponse<IBudget>) => {
      this.budgetReappropriationMaster = res.result;
      this.budgetReapprolines = res.result.budgetReappropriationLines;

      this.cdRef.markForCheck();
    })
  }
}

