import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';
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
  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;
  className : any;


  constructor(
    injector: Injector,
    private trialBalanceService: TrialBalanceService,
    public dynamicColorChanging : DynamicColorChangeService,
    private cdRef: ChangeDetectorRef,
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
}



