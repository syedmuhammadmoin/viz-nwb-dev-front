import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { GeneralLedgerService } from '../service/general-ledger.service';

@Component({
  selector: 'kt-print-general-ledger',
  templateUrl: './print-general-ledger.component.html',
  styleUrls: ['./print-general-ledger.component.scss']
})
export class PrintGeneralLedgerComponent extends AppComponentBase implements OnInit {

  docType = AppConst.DocTypeValue
  isLoading = true;
  rowData: Map<any, any> = new Map<any, any>()
  account: any;
  businessPartner: any;
  from: any;
  to: any;
  campus: any;
  store: any;


  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private generalLedgerService: GeneralLedgerService,
    private cdRef: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.generalLedgerService.currentLedgerPrintData.subscribe((res) => {
      if (res.length > 0) {
        this.rowData = this.groupBy(res, item => item.accountName);
        this.isLoading = false;
      }
    });

    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.businessPartner = param.get('businessPartner');;
      this.account = param.get('account');
      this.from = param.get('from');
      this.to = param.get('to');
      this.campus = param.get('campus');
      this.store = param.get('store');
    });
  }
}



