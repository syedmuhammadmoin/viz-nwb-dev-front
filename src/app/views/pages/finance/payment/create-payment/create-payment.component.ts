import { NgxsCustomService } from '../../../../shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, Inject, Optional, ViewChild, OnDestroy} from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import { IPayment} from '../model/IPayment';
import { PaymentService} from '../service/payment.service';
import { ActivatedRoute, Router} from '@angular/router';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { BehaviorSubject, Subscription } from 'rxjs';
import { finalize, take} from 'rxjs/operators';
import { CashAccountService} from '../../cash-account/service/cashAccount.service';
import { BankAccountService} from '../../bank-account/service/bankAccount.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConst } from 'src/app/views/shared/AppConst';
import { DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ICashAccount } from '../../cash-account/model/ICashAccount';
import { IBankAccount } from '../../bank-account/model/IBankAccount';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'kt-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.scss']
})

export class CreatePaymentComponent extends AppComponentBase implements OnInit, OnDestroy {

  // for permissions 
  public permissions = Permissions;
  // doc type enum
  docType = DocType

  formName: string = ''
  
  // for document type app constant
  documents = AppConst.Documents
  // Declaring form variable
  paymentForm: FormGroup;

  // Limit Date
  maxDate = new Date();

  // payment Model
  paymentModel: IPayment = {} as IPayment;

  // subscription
  subscription$: Subscription;

  isPayrollPayment : boolean;
  isReceipt: boolean;

  propertyValue: string;
  propertyName: string;
  bankAccountList: BehaviorSubject<ICashAccount[] | IBankAccount[] | []> = new BehaviorSubject<ICashAccount[] | IBankAccount[] | []>([]);
  netPayment: number = 0;
  
  //for Busy Loading
  isLoading: boolean;
  paymentMaster: any;

  title: string = 'Create '

  dateLimit: Date = new Date()

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;


  // validation messages
  validationMessages = {
    date: {
      required: 'Payment Date is required.'
    },
    description: {
      required: 'Description is required.'
    },
    businessPartner: {
      required: 'Business Partner is required.'
    },
    account: {
      required: 'COA is required.'
    },
    bankAccount: {
      required: 'Bank Account is required.'
    },
    grossPayment: {
      required: 'Gross Payment is required.',
      min: 'Please insert correct value.'
    },
    deduction: {
      min: 'Please insert correct value.'
    },
    deductionAccountId: {
      required: 'Deduction Account is required.',
    },
    campusId: {
      required: 'Campus is required.'
    },
    salesTax: {
      min: 'Percentage % range (0 - 100).',
      max: 'Percentage % range (0 - 100).'
    },
    incomeTax: {
      min: 'Percentage % range (0 - 100).',
      max: 'Percentage % range (0 - 100).'
    },
    SRBTax: {
      min: 'Percentage % range (0 - 100).',
      max: 'Percentage % range (0 - 100).'
    },
  }

  // Error keys
  formErrors: any = {
    date: '',
    description: '',
    businessPartner: '',
    account: '',
    bankAccount: '',
    grossPayment: '',
    deduction: '',
    deductionAccountId: '',
    campusId: '',
    salesTax: '',
    incomeTax: '',
    SRBTax: ''
  }


  //Injecting dependencies
  constructor(
    private cashAccountService: CashAccountService,
    private bankAccountService: BankAccountService,  
    private fb: FormBuilder,
    public addButtonService:AddModalButtonService,
    private paymentService: PaymentService,
    public activatedRoute: ActivatedRoute,
    public ngxsService:NgxsCustomService,
    private route: Router,
    private cdRef: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreatePaymentComponent>,
    injector: Injector
  ) {
    super(injector)

    this.formName = this.documents.find(x => x.id === this.data.docType).value;
    this.isPayrollPayment = (this.data.docType === this.docType.PayrollPayment) ? true : false;
    this.isReceipt =  (this.data.docType === this.docType.Receipt) ? true : false;
  }

  groups = [
    {id: 0, viewValue: 'Inflow'},
    {id: 1, viewValue: 'Outflow'}
  ];

  public currentClient : any ={}
  ngOnInit() {
    this.currentClient = AppConst.ClientConfig.config
    this.paymentForm = this.fb.group({
      date: ['', [Validators.required]],
      description: ['', [Validators.required]],
      businessPartner: ['', [Validators.required]],
      account: ['', [Validators.required]],
      campusId: (AppConst.ClientConfig.config.isCampus) ?  ['',  [Validators.required]] : [null,[Validators.nullValidator]],
      bankAccount: ['', [Validators.required]],
      grossPayment: ['',[Validators.required , Validators.min(1)]],
      deduction: [0,[Validators.min(0)]],
      deductionAccountId: [''],
      chequeNo: ['', [Validators.nullValidator]],
      salesTax: [0,[Validators.min(0) , Validators.max(100)]],
      incomeTax: [0,[Validators.min(0) , Validators.max(100)]],
      SRBTax: [0,[Validators.min(0) , Validators.max(100)]],
    });

    this.loadAccountList({value: 2})

    // initializing payment model
    if (this.data.id) {
      this.title = 'Edit '
      this.isLoading = true;
      this.getPayment(this.data.id);
      this.cdRef.markForCheck();
    }

    if(this.data.docType !== this.docType.PayrollPayment) {
      this.calculatingNetPayment();
    }

    //Get Data From Store
    this.ngxsService.getBusinessPartnerFromState();
    this.ngxsService.getAllBusinessPartnerFromState();
    this.ngxsService.getEmployeePaymentsFromState();
    this.ngxsService.getAccountLevel4FromState();
    this.ngxsService.getCampusFromState()
  }

  //Update deduction account validation
  updateValueValidators(event: any) {
    const value = event?.target?.value;
    if(value > 0) {
      this.paymentForm.get('deductionAccountId').setValidators([Validators.required])
      this.paymentForm.get('deductionAccountId').updateValueAndValidity();
    }
    else if (value < 1) {
      this.paymentForm.get('deductionAccountId').clearValidators();
      this.paymentForm.get('deductionAccountId').updateValueAndValidity();
    }
    this.logValidationErrors(this.paymentForm, this.formErrors , this.validationMessages)
  }

  getPayment(id: number) {
    this.paymentService.getPaymentById(id, this.documents.find(x => x.id === this.data.docType).value)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe(
        (payment: IApiResponse<IPayment>) => {
          this.paymentMaster = payment.result;
          this.editPayment(payment.result);
          this.paymentModel = payment.result;
          this.netPayment = this.paymentMaster.netPayment;
        }
      );
  }

  editPayment(payment: IPayment) {
    this.paymentForm.patchValue({
      date: payment.paymentDate,
      description: payment.description,
      businessPartner: payment.businessPartnerId,
      account: payment.accountId,
      bankAccount: payment.paymentRegisterId,
      grossPayment: payment.grossPayment,
      campusId: payment.campusId,
      deduction: payment.deduction,
      chequeNo: payment.chequeNo,
      deductionAccountId: payment.deductionAccountId,
      salesTax: payment.salesTax,
      SRBTax : payment.srbTax || 0,
      incomeTax: payment.incomeTax,
    });

    this.loadAccountList({value: payment.paymentRegisterType}, payment.paymentRegisterId)
    if(this.data.docType === this.docType.PayrollPayment) {
      this.disableFields(this.paymentForm , 'date', 'businessPartner', 'account', 'grossPayment', 'salesTax', 'incomeTax', 'SRBTax', 'campusId')
    }
  }

  // unsubscribe Observable
  ngOnDestroy() {
    if (this.subscription$) this.subscription$.unsubscribe()
  }

  // submit payment form
  onSubmit() {
    if (this.paymentForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValueToPaymentModel();
    if (this.paymentModel.id) {
      this.paymentService.updatePayment(this.paymentModel, this.documents.find(x => x.id === this.data.docType).value)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {
            this.toastService.success('Updated Successfully', '' + this.documents.find(x => x.id === this.data.docType).value)
            this.route.navigate(['/payment/'+ this.documents.find(x => x.id === this.data.docType).route +'/details/' + this.paymentModel.id])
            this.onCloseDialog()
          });
    } else {
      delete this.paymentModel.id;
      this.subscription$ = this.paymentService.addPayment(this.paymentModel, this.documents.find(x => x.id === this.data.docType).value)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res) => {
            this.toastService.success('Registered Successfully', '' + this.documents.find(x => x.id === this.data.docType).value)
            this.route.navigate(['/payment/'+ this.documents.find(x => x.id === this.data.docType).route +'/details/' + res.result.id])
            this.onCloseDialog();
          });
    }
  }
 
  mapFormValueToPaymentModel() {
    this.paymentModel.paymentType = (this.formName === "Payment" || this.formName === "Payroll Payment") ? 1 : 0
    this.paymentModel.paymentRegisterId = this.paymentForm.value.bankAccount;
    this.paymentModel.campusId = this.paymentForm.getRawValue().campusId;
    this.paymentModel.description = this.paymentForm.value.description;
    this.paymentModel.chequeNo = this.paymentForm.value.chequeNo;
    this.paymentModel.businessPartnerId = (!this.isPayrollPayment) ? this.paymentForm.value.businessPartner : this.paymentMaster.businessPartnerId ;
    this.paymentModel.accountId = (!this.isPayrollPayment) ? this.paymentForm.value.account : this.paymentMaster.accountId ;
    this.paymentModel.paymentDate = (!this.isPayrollPayment) ? this.transformDate(this.paymentForm.value.date, 'yyyy-MM-dd') : this.transformDate(this.paymentMaster.paymentDate, 'yyyy-MM-dd');
    this.paymentModel.grossPayment = (!this.isPayrollPayment) ? this.paymentForm.value.grossPayment : this.paymentMaster.grossPayment;
    this.paymentModel.deduction = (!this.isPayrollPayment) ? (this.paymentForm.value.deduction || 0) : this.paymentMaster.deduction;
    this.paymentModel.deductionAccountId = (!this.isPayrollPayment) ? (this.paymentForm.value.deductionAccountId || null) : null;
    this.paymentModel.salesTax = (!this.isPayrollPayment) ? (this.paymentForm.value.salesTax || 0) : this.paymentMaster.salesTax;
    this.paymentModel.incomeTax = (!this.isPayrollPayment) ? (this.paymentForm.value.incomeTax || 0) : this.paymentMaster.incomeTax;
    this.paymentModel.srbTax = (!this.isPayrollPayment) ? (this.paymentForm.value.SRBTax || 0) : this.paymentMaster.srbTax;
    this.paymentModel.paymentRegisterType = 2
    
  }

  //for save or submit
  isSubmit(val: number) {
    this.paymentModel.isSubmit = (val === 0) ? false : true;
  }

  loadAccountList($event: MatRadioChange | any, id: number = null) {
    this.paymentForm.patchValue({
      bankAccount: id
    })
    if ($event.value === 1) {
      this.cashAccountService.getCashAccountsDropdown().subscribe((res: IApiResponse<ICashAccount[]>) => {
        this.bankAccountList.next(res.result)
        this.cdRef.markForCheck();
      })
      this.propertyValue = 'chAccountId';
      this.propertyName = 'cashAccountName';
    } else {
      this.bankAccountService.getBankAccountsDropdown().subscribe((res: IApiResponse<IBankAccount[]>) => {
        this.bankAccountList.next(res.result)
        this.cdRef.markForCheck();
      })
      this.propertyValue = 'clearingAccountId';
      this.propertyName = 'accountTitle';
    }
  }
 
  // Calculating net payment amount
  calculatingNetPayment(): void {
    this.paymentForm.valueChanges.subscribe((val) => {
      this.netPayment = +((Number(val.grossPayment) - (Number(val.grossPayment) * ((Number(val.salesTax) / 100) + (Number(val.incomeTax) / 100) + (Number(val.SRBTax) / 100)))) - Number(val.deduction)).toFixed(2);
    });
  }

  // close dialog
  onCloseDialog() {
    this.dialogRef.close();
  }

  reset() {
    this.formDirective.resetForm();
  }
}



