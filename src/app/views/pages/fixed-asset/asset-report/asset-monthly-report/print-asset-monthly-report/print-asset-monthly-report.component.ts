import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from '../../../../../shared/app-component-base';
import {IFixedAssetReport} from '../../model/IFixedAssetReport';
import {ActivatedRoute} from '@angular/router';
import {FixedAssetReportService} from '../../services/fixed-asset-report.service';
import {DynamicColorChangeService} from '../../../../../shared/services/dynamic-color/dynamic-color-change.service';

@Component({
  selector: 'kt-print-asset-monthly-report',
  templateUrl: './print-asset-monthly-report.component.html',
  styleUrls: ['./print-asset-monthly-report.component.scss']
})
export class PrintAssetMonthlyReportComponent extends AppComponentBase implements OnInit {

  isLoading = true;
  masterData: IFixedAssetReport[] = [];
  fromDate: string;
  toDate: string;
  fixedAsset: string;
  warehouse: string;
  edinfini: boolean;
  sbbu: boolean;
  vizalys: boolean;
  localsto: any;
  className: any;


  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private assetReportService: FixedAssetReportService,
    private cdRef: ChangeDetectorRef,
    public dynamicColorChanging: DynamicColorChangeService,
  ) {
    super(injector)
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.fromDate = param.get('fromDate');
      this.toDate = param.get('toDate');
      this.fixedAsset = param.get('fixedAsset');
      this.warehouse = param.get('warehouse');
    });

    this.assetReportService.currentFixedAssetMonthlyPrintData
      .subscribe((res) => {
        this.masterData = res;
        this.isLoading = false;
      })

    this.dynamicColorChanging.global_color.subscribe((res: any) => {

      if (localStorage.getItem('global_color')) {
        this.localsto = JSON.parse(localStorage.getItem('global_color'))
        this.edinfini = this.localsto.edinfini_true;
        this.vizalys = this.localsto.vizalys_true;
        this.sbbu = this.localsto.nawabshah_true;
      } else {
        this.localsto = res;
        this.edinfini = this.localsto.edinfini_true;
        this.vizalys = this.localsto.vizalys_true;
        this.sbbu = this.localsto.nawabshah_true;
      }

      if (this.edinfini) {
        this.className = 'edinfini row'
      } else if (this.sbbu) {
        this.className = 'sbbu row'
      } else if (this.vizalys) {
        this.className = 'vizalys row'
      }

      this.cdRef.detectChanges()
    })

  }
printForm(){
  window.print();
}
}
