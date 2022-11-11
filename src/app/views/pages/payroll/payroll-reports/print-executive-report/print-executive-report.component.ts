import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { PayrollReportsService } from '../service/payroll-reports.service';

@Component({
  selector: 'kt-print-executive-report',
  templateUrl: './print-executive-report.component.html',
  styleUrls: ['./print-executive-report.component.scss']
})
export class PrintExecutiveReportComponent extends AppComponentBase implements OnInit {

  payrollType = AppConst.PayrollType
  isLoading = true;
  masterData: any;
  campus: string;
  months: any = [];
  monthsToShow: string = ''
  year: string;


  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private payrollReportService: PayrollReportsService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.payrollReportService.currentPayrollExecutivePrintData.subscribe((res) => {
        this.masterData = res;
        this.isLoading = false;
    });

    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.campus = param.get('campus');
      this.year = param.get('year');
      this.months = JSON.parse(param.get('months'));
      if(this.months) {
        this.months?.forEach((day: number) => {
          this.monthsToShow +=  AppConst.Months.find(x => x.value === day).name + ' '
        })
      }
    });
  }
}




