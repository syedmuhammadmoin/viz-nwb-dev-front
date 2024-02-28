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
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';



@Component({
  selector: 'kt-payment-invoice',
  templateUrl: './payment-invoice.component.html',
  styleUrls: ['./payment-invoice.component.scss']
})

export class PaymentInvoiceComponent implements OnInit, OnDestroy {

  gridOptions: GridOptions;
  paymentMaster: any;
  selectedDocumented: any
  documents = AppConst.Documents
  paymentMasterData: any;
  formName: any;
  docType = DocType;
  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  localsto : any ;
  className : any;


  //subscription
  subscription$: Subscription

  //Injecting dependencies
  constructor(
    private paymentService: PaymentService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    public dynamicColorChanging : DynamicColorChangeService,
    private ref: ChangeDetectorRef,
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

      this.ref.detectChanges()
    })
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
      this.cdRef.markForCheck();
    })
  }

  ngOnDestroy() {
    if (this.subscription$) this.subscription$.unsubscribe()
  }
  printForm(){
    window.print();
  }
}


