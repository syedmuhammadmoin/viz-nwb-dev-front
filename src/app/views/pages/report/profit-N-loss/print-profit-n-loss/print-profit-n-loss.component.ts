import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { ProfitLossService} from "../service/profit-loss.service";
import { AppComponentBase} from "../../../../shared/app-component-base";
import { ActivatedRoute} from "@angular/router";
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';

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
  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;
  className : any;


  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private profitLossService: ProfitLossService,
    private cdRef: ChangeDetectorRef,
    public dynamicColorChanging : DynamicColorChangeService,
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

  calculateNetProfit(res) {
    const income = (res.get('Income') ? (this.calculateTotal(res.get('Income'), 'balance').balance) : 0);
    const expense = (res.get('Expenses') ? (this.calculateTotal(res.get('Expenses'), 'balance').balance) : 0);
    
    this.netProfit = ((income) - (expense));
  }
}



