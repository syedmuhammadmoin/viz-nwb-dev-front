import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { GridOptions } from 'ag-grid-community';
import { PaymentService } from '../service/payment.service';
import { Subscription } from 'rxjs';
import { IPayment } from '../model/IPayment';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { DocType } from 'src/app/views/shared/AppEnum';
import { AppConst } from 'src/app/views/shared/AppConst';


@Component({
  selector: 'kt-payment-invoice',
  templateUrl: './payment-invoice.component.html',
  styleUrls: ['./payment-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PaymentInvoiceComponent implements OnInit, OnDestroy {

  gridOptions: GridOptions;
  paymentMaster: any;
  selectedDocumented: any
  documents = AppConst.Documents
  paymentMasterData: any;
  formName: any;
  docType = DocType;


  //subscription
  subscription$: Subscription

  //Injecting dependencies
  constructor(
    private paymentService: PaymentService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public sanitizer: DomSanitizer
  ) {
    this.selectedDocumented = this.documents.find(x => x.id === this.activatedRoute.snapshot.data.docType).value
    this.formName = this.selectedDocumented === 'Payment' ? 'Payment Voucher' : this.selectedDocumented 
   }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.getPaymentMaster(id);
      }
    });
  }

  printDiv(divName: any) {
    const printContents = document.getElementById(divName).innerHTML;
    window.document.body.innerHTML = printContents
    window.document.append('<link rel="stylesheet" href="print-invoice.component.scss">')
    window.print();
    window.document.close();
  }

  getPaymentMaster(id: number) {
    this.paymentService.getPaymentById(id, this.selectedDocumented).subscribe((res: IApiResponse<IPayment>) => {
      this.paymentMaster = res.result;
     // this.netPayment = (res.result.grossPayment - res.result.discount - res.result.incomeTax - res.result.salesTax);
      this.cdr.markForCheck();
    })
  }

  ngOnDestroy() {
    if (this.subscription$) this.subscription$.unsubscribe()
  }
}


