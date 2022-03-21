import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params} from '@angular/router';
import { Subscription } from 'rxjs';
import { PaymentService } from '../service/payment.service';
import { ActionButton, DocumentStatus , DocType } from 'src/app/views/shared/AppEnum';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { CreatePaymentComponent } from '../create-payment/create-payment.component';
import { PAYMENT } from 'src/app/views/shared/AppRoutes';
import { IPayment } from '../model/IPayment';


@Component({
  selector: 'kt-detail-payment',
  templateUrl: './detail-payment.component.html',
  styleUrls: ['./detail-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DetailPaymentComponent extends AppComponentBase implements OnInit, OnDestroy {

  paymentMaster: any;
  loader:boolean = true;

  //subscription
  subscription$: Subscription

  public paymentRoute = PAYMENT
  
  docStatus = DocumentStatus

  //for busy loading
  isLoading: boolean

  action = ActionButton;
  docType = DocType;

  // need for routing
  paymentId: number;

    constructor( private paymentService: PaymentService,
                 private route: ActivatedRoute,
                 public  dialog: MatDialog,
                 private cdr: ChangeDetectorRef,
                 injector: Injector
               ) {
                   super(injector)
                 }
  
    ngOnInit() {
      this.route.paramMap.subscribe((params: Params) => {
        const id = +params.get('id');
        if (id) {
          this.getPaymentData(id);
          this.paymentId = id;
          this.cdr.markForCheck();
        }
      });
    }
  
    //Getting Payment Master data
    getPaymentData(id: number) {
      this.subscription$ = this.paymentService.getPaymentById(id).subscribe(
        (res) => {
          this.paymentMaster = res.result;
          // this.status = AppConst.ConsileOrReconcile[this.paymentMaster.bankReconStatus]
          // this.paymentType = AppConst.paymentType[this.paymentMasterList.paymentType]
          // this.registerType = AppConst.paymentRegisterType[this.paymentMasterList.paymentRegisterType]
          // this.salesTax = this.paymentMasterList.salesTax;
          // this.incomeTax = this.paymentMasterList.incomeTax;
          // this.grossAmount = this.paymentMasterList.grossPayment ?? 0;
          // const grossPayment = this.paymentMasterList.grossAmount;
          // const tax = res.result.salesTax + res.result.incomeTax
          this.cdr.markForCheck();
        }, 
        (err) => console.log(err));
  }

  addPaymentDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreatePaymentComponent, {
      width: '760px',
      data: id
    });
    // Recalling getInvoiceMasterData function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.getPaymentData(this.paymentId)
    });
  }
  
  workflow(action: number) {
    this.isLoading = true;
    const body: IWorkflow = {docId: this.paymentMaster.id, action}
    this.paymentService.paymentWorkflow(body).subscribe((res) => {
      this.getPaymentData(this.paymentId);
      this.cdr.detectChanges();
      this.isLoading = false;
      this.toastService.success('' + res.message, 'Payment');
    }, (err) => {
      this.isLoading = false
      this.cdr.detectChanges();
      this.toastService.error('' + err.error.message, 'Payment');
    })
  }

  ngOnDestroy () {
    if(this.subscription$) this.subscription$.unsubscribe()
  }
}
