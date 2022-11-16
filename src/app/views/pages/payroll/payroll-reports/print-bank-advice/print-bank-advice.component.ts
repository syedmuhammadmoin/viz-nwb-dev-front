import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
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


  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private payrollReportService: PayrollReportsService,
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
  }
}





