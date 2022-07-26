import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
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

  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private balanceSheetService: BalanceSheetService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.balanceSheetService.currentBalanceSheetPrintData.subscribe((res) => {
      if (res.length > 0) {
        this.rowData = this.groupBy(res, item => item.nature);
        console.log('map: ', this.rowData);
        this.isLoading = false;
      }
    });

    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.date = param.get('date');
      this.campus = param.get('campus');
    });
  }


  calculateNetProfit(res: any[]) {
    // Assets
    this.asset = this.valueFormatter(res.find(x => x.nature === 'ASSETS').totalBalance || 0)
    // Liability
    const liablity = res.find(x => x.nature.toString().toLowerCase().replace(/ /g, '') === 'liabilities').totalBalance || 0;
    // Equity
    const equity = res.find(x => x.nature.toString().toLowerCase().replace(/ /g, '') === 'accumulatedfund').totalBalance || 0;
    /*// Deficit / Surplus
    const netProfit = res.find(x => x.nature.toString().toLowerCase().replace(/ /g, '') === 'deficit/surplus').totalBalance || 0;*/
    // this.netProfit = netProfit
    this.equityNLiability = this.valueFormatter((equity) + (liablity))
    // console.log((equity) + (liablity) + (netProfit));
  }
}
