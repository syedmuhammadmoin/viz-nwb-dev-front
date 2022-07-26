import { Component, Injector, OnInit } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { ProfitLossService} from "../service/profit-loss.service";
import { AppComponentBase} from "../../../../shared/app-component-base";
import { ActivatedRoute} from "@angular/router";

@Component({
  selector: 'kt-print-profit-n-loss',
  templateUrl: './print-profit-n-loss.component.html',
  styleUrls: ['./print-profit-n-loss.component.scss']
})

export class PrintProfitNLossComponent extends AppComponentBase implements OnInit {

  isLoading = true;
  from: string;
  to: string;
  account: string;
  businessPartner: string; 
  campus: string;
  store: string; 
  profitnlossReport: any[] = [];
  rowData: any = [];
  netProfit = 0;


  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private profitLossService: ProfitLossService,
    public sanitizer: DomSanitizer,
  ) {
    super(injector)
  }

  ngOnInit(): void {
    this.profitLossService.currentProfitNLossPrintData.subscribe((res) => {
        if (res.length > 0) {
          this.rowData = this.groupBy(res, item => item.nature);
          this.calculateNetProfit(this.rowData);
          this.isLoading = false;
        }
       
    })

    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.from = params.get('from');
      this.to = params.get('to');
      this.account = params.get('account');
      this.businessPartner = params.get('businessPartner');
      this.campus = params.get('campus');
      this.store = params.get('store');
    })
  }

  calculateNetProfit(res) {
    const income = this.calculateTotal(res.get('Income'), 'balance').balance;
    const expense = this.calculateTotal(res.get('Expenses'), 'balance').balance;
    
    this.netProfit = ((income) - (expense));
  }
}



