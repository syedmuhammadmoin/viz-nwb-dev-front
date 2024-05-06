import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';
import { PayrollReportsService } from '../service/payroll-reports.service';

@Component({
  selector: 'kt-print-bank-advice',
  templateUrl: './print-bank-advice.component.html',
  styleUrls: ['./print-bank-advice.component.scss']
})
export class PrintBankAdviceComponent extends AppComponentBase implements OnInit {

  isLoading = true;
  masterData: any;
  campus: string;
  month: string;
  year: string;
  totalAmount: number;
  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;
  className : any;



  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private payrollReportService: PayrollReportsService,
    private cdRef: ChangeDetectorRef,
    public dynamicColorChanging : DynamicColorChangeService,
  ) {
    super(injector);
  }

  ngOnInit(): void {

    this.payrollReportService.currentBankAdvicePrintData.subscribe((res) => {
        this.masterData = res;
        this.totalAmount = res.reduce((accumulator: any, currentValue: any) => accumulator + currentValue.amount,0);
        this.isLoading = false;
    });

    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.campus = param.get('campus');
      this.year = param.get('year');
      this.month = param.get('month').replace(/"/g, "");
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

  printForm(){
    window.print();
  }
}





