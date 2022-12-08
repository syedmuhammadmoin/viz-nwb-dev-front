import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';
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
  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;
  className : any;



  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private payrollReportService: PayrollReportsService,
    private cdr: ChangeDetectorRef,
    public dynamicColorChanging : DynamicColorChangeService,
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

      this.cdr.detectChanges()
    })
  }
}




