import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { TrialBalanceService } from '../service/trial-balance.service';

@Component({
  selector: 'kt-print-trial-balance',
  templateUrl: './print-trial-balance.component.html',
  styleUrls: ['./print-trial-balance.component.scss']
})
export class PrintTrialBalanceComponent extends AppComponentBase implements OnInit {
  from: string;
  to: string;
  account: string;
  campus: string;
  isLoading: boolean = true;
  groupRowData: Map<any, any> = new Map<any, any>();
  rowData: any
  totals: any;


  constructor(
    injector: Injector,
    // public sanitizer: DomSanitizer,
    private trialBalanceService: TrialBalanceService,
    private activatedRoute: ActivatedRoute
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.trialBalanceService.currentTrialBalancePrintData.subscribe((res) => {
        this.rowData = res;
        this.groupRowData = this.groupBy(res, value => value.nature)
        this.totals = this.calculateTotal(this.rowData, 'credit', 'debit', 'creditOB', 'creditCB', 'debitOB', 'debitCB');
        this.isLoading = false;
    });

    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.from = param.get('from');
      this.to = param.get('to');
      this.account = param.get('account');
      this.campus = param.get('campus');
    });
  }
}



