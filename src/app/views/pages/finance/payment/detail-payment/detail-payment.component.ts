import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params} from '@angular/router';
import { Subscription } from 'rxjs';
import { PaymentService } from '../service/payment.service';
import { ActionButton, DocumentStatus , DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { CreatePaymentComponent } from '../create-payment/create-payment.component';
import { BILL, INVOICE, PAYMENT, PAYROLL_TRANSACTION } from 'src/app/views/shared/AppRoutes';
import { IPayment } from '../model/IPayment';
import { finalize, take } from 'rxjs/operators';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import { CustomUploadFileComponent } from 'src/app/views/shared/components/custom-upload-file/custom-upload-file.component';


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

  permissions = Permissions

  //for Routing
  public PAYMENT = PAYMENT
  public BILL = BILL
  public INVOICE = INVOICE
  public PAYROLL_TRANSACTION = PAYROLL_TRANSACTION
  
  docStatus = DocumentStatus

  //for busy loading
  isLoading: boolean

  action = ActionButton;
  docType = DocType;

  printRoute: any;
  selectedFormType: any;
  formName: string;
  documents = AppConst.Documents

  //show Buttons
  showButtons: boolean = true;

  paidAmountList: any = []

  // need for routing
  paymentId: number;

  //Showing Remarks
  remarksList: string[] = [];

    constructor( private paymentService: PaymentService,
                 private route: ActivatedRoute,
                 public  dialog: MatDialog,
                 private cdRef: ChangeDetectorRef,
                 injector: Injector
               ) {
                   super(injector)
                   this.selectedFormType = this.route.snapshot.data.docType;
                   this.formName = this.documents.find(x=> x.id === this.selectedFormType).value;
                   this.printRoute = this.documents.find(x=> x.id === this.selectedFormType).route;
                 }
  
    ngOnInit() {
      this.route.paramMap.subscribe((params: Params) => {
        const id = +params.get('id');
        if (id) {
          this.isLoading = true;
          this.getPaymentData(id);
          this.paymentId = id;
          this.cdRef.markForCheck();
        }
      });

      (this.selectedFormType === 0) ? this.showButton(this.permission.isGranted(this.permissions.PAYMENT_EDIT)) :
      (this.selectedFormType === 15) ? this.showButton(this.permission.isGranted(this.permissions.RECEIPT_EDIT)) :
        (this.selectedFormType === 17) ? this.showButton(this.permission.isGranted(this.permissions.PAYROLL_PAYMENT_EDIT)) : null
    }

    showButton (permission: boolean) { this.showButtons = (permission) ? true : false; }
  
    //Getting Payment Master data
    getPaymentData(id: number) {
      this.subscription$ = this.paymentService.getPaymentById(id, this.documents.find(x=>x.id === this.selectedFormType).value)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
      .subscribe(
        (res) => {
          this.paymentMaster = res.result;
          this.paidAmountList = this.paymentMaster.paidAmountList;
          this.remarksList = this.paymentMaster.remarksList ?? [] 
          
          // this.status = AppConst.ConsileOrReconcile[this.paymentMaster.bankReconStatus]
          // this.paymentType = AppConst.paymentType[this.paymentMasterList.paymentType]
          // this.registerType = AppConst.paymentRegisterType[this.paymentMasterList.paymentRegisterType]
          // this.salesTax = this.paymentMasterList.salesTax;
          // this.incomeTax = this.paymentMasterList.incomeTax;
          // this.grossAmount = this.paymentMasterList.grossPayment ?? 0;
          // const grossPayment = this.paymentMasterList.grossAmount;
          // const tax = res.result.salesTax + res.result.incomeTax
          this.cdRef.markForCheck();
        })
  }

  addPaymentDialog(id?: number): void {
    const dialogRef = this.dialog.open(CreatePaymentComponent, {
      width: '760px',
      data: {id, docType: this.selectedFormType}
    });
    // Recalling getInvoiceMasterData function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.getPaymentData(this.paymentId)
    });
  }

  //Get Remarks From User
  remarksDialog(action: any): void {
    const dialogRef = this.dialog.open(CustomRemarksComponent, {
      width: '740px'
    });
    //sending remarks data after dialog closed
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.workflow(action, res.data)
      }
    })
  }

  workflow(action: number, remarks: string) {
    this.isLoading = true;
    const body: IWorkflow = {docId: this.paymentMaster.id, action, remarks}
    this.paymentService.paymentWorkflow(body, this.formName)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      this.getPaymentData(this.paymentId);
      this.cdRef.detectChanges();
      this.toastService.success('' + res.message, '' + this.formName);
    })
  }

  //upload File
  openFileUploadDialog() {
    this.dialog.open(CustomUploadFileComponent, {
      width: '740px',
      data: {
        response: this.paymentMaster,
        serviceClass: this.paymentService,
        functionName: 'uploadFile',
        name: this.formName,
        docType: this.documents.find(x=>x.id === this.selectedFormType).value
      },
    }).afterClosed().subscribe(() => {
      this.getPaymentData(this.paymentId)
      this.cdRef.detectChanges()
    })
  }

  ngOnDestroy () {
    if(this.subscription$) this.subscription$.unsubscribe()
  }
}
