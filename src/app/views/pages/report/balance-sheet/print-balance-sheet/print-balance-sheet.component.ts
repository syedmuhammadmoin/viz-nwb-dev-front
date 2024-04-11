import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';
import { BalanceSheetService } from '../service/balance-sheet.service';

@Component({
  selector: 'kt-print-balance-sheet',
  templateUrl: './print-balance-sheet.component.html',
  styleUrls: ['./print-balance-sheet.component.scss']
})

export class PrintBalanceSheetComponent extends AppComponentBase implements OnInit {

  isLoading = true;
  balanceSheetReport: any[] = []
  asset: any;
  equityNLiability: any;
  netProfit: any;
  rowData: any = [];
  date:string;
  campus: string;
  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;
  className : any;


  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private balanceSheetService: BalanceSheetService,
    private cdRef: ChangeDetectorRef,
    public dynamicColorChanging : DynamicColorChangeService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.balanceSheetService.currentBalanceSheetPrintData.subscribe((res) => {
      if (res.length > 0) {
        this.rowData = this.groupBy(res, item => item.nature);
        this.isLoading = false;
      }
    });

    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.date = param.get('date');
      this.campus = param.get('campus');
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


  calculateNetProfit(res: any[]) {
    // Assets
    this.asset = this.valueFormatter(res.find(x => x.nature === 'ASSETS').totalBalance || 0)
    // Liability
    const liablity = res.find(x => x.nature.toString().toLowerCase().replace(/ /g, '') === 'liabilities').totalBalance || 0;
    // Equity
    const equity = res.find(x => x.nature.toString().toLowerCase().replace(/ /g, '') === 'accumulatedfund').totalBalance || 0;
    // Deficit / Surplus
    this.equityNLiability = this.valueFormatter((equity) + (liablity))
  }

  printForm(){
    window.print();
  }
}
