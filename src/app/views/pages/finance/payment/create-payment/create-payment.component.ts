import { NgxsCustomService } from '../../../../shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, OnInit, Inject, Optional} from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
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
import { PAYMENT, RECEIPT } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ICashAccount } from '../../cash-account/model/ICashAccount';
import { IBankAccount } from '../../bank-account/model/IBankAccount';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'kt-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.scss']
})

export class CreatePaymentComponent extends AppComponentBase implements OnInit {

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
  paymentModel: IPayment;

  // subscription
  subscription$: Subscription;

  propertyValue: string;
  propertyName: string;
  paymentRegisterList: BehaviorSubject<ICashAccount[] | IBankAccount[] | []> = new BehaviorSubject<ICashAccount[] | IBankAccount[] | []>([]);
  netPayment: number;
  
  //for Busy Loading
  isLoading: boolean;
  paymentMaster: any;

  title: string = 'Create '

  dateLimit: Date = new Date()


  // validation messages
  validationMessages = {
    registerType: {
      required : 'Register Type is required'
    },
    // paymentType: {
    //   required: 'Payment Type is required'
    // },
    date: {
      required: 'Date is required'
    },
    description: {
      required: 'Description is required'
    },
    businessPartner: {
      required: 'Business Partner is required'
    },
    account: {
      required: 'Account is required'
    },
    paymentRegister: {
      required: 'Payment Register is required'
    },
    grossPayment: {
      required: 'Gross Payment is required',
      min: 'Please insert correct Payment !'
    },
    campusId: {
      required: 'Campus is required'
    },
    discount: {
      min: 'Please insert correct value.'
    },
    salesTax: {
      min: 'Please insert correct value.'
    },
    incomeTax: {
      min: 'Please insert correct value.'
    },
    SRBTax: {
      min: 'Please insert correct value.'
    },
  }

  // Error keys
  formErrors = {
    registerType: '',
   // paymentType: '',
    date: '',
    description: '',
    businessPartner: '',
    account: '',
    paymentRegister: '',
    grossPayment: '',
    campusId: '',
    discount: '',
    salesTax: '',
    incomeTax: '',
    SRBTax: ''
  }

  // Injecting dependencies
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
    this.formName = this.documents.find(x => x.id === this.data.docType).value
  }

  groups = [
    {id: 0, viewValue: 'Inflow'},
    {id: 1, viewValue: 'Outflow'}
  ];

  ngOnInit() {
    this.paymentForm = this.fb.group({
      registerType: ['', [Validators.required]],
      //paymentType: ['', [Validators.required]],
      date: ['', [Validators.required]],
      description: ['', [Validators.required]],
      businessPartner: ['', [Validators.required]],
      account: ['', [Validators.required]],
      campusId: ['', [Validators.required]],
      paymentRegister: ['', [Validators.required]],
      grossPayment: ['',[Validators.required , Validators.min(0)]],
      discount: [0 ,[Validators.min(0)]],
      salesTax: [0,[Validators.min(0)]],
      incomeTax: [0,[Validators.min(0)]],
      SRBTax: [0,[Validators.min(0)]],
    });

    this.paymentForm.get('registerType').setValue(2)
    this.loadAccountList({value: 2})

    // initializing payment model
    if (this.data.id) {
      this.title = 'Edit '
      this.isLoading = true;
      this.getPayment(this.data.id);
      this.cdRef.markForCheck();
    } else {
      // initializing payment model
      this.paymentModel = {
        paymentRegisterType: null,
        id: null,
        paymentType: null,
        businessPartnerId: null,
        accountId: null,
        paymentDate: null,
        paymentRegisterId: null,
        campusId: null,
        description: '',
        grossPayment: null,
        discount: null,
        salesTax: null,
        incomeTax: null,
        srbTax : null
        //documentTransactionId: null,
      }
    };    
    this.calculatingNetPayment();
    this.ngxsService.getBusinessPartnerFromState();
    this.ngxsService.getAccountLevel4FromState();
    this.ngxsService.getCampusFromState()
    // //get business partner list from service
    // this.addButtonService.getBusinessPartnerTypes();
  }

  getPayment(id: number) {
    this.paymentService.getPaymentById(id, this.documents.find(x => x.id === this.data.docType).value)
      .subscribe(
        (payment: IApiResponse<IPayment>) => {
          this.paymentMaster = payment.result;
          this.editPayment(payment.result);
          this.paymentModel = payment.result;
          this.isLoading = false;
          this.calculatingNetPayment();
        },
        (err) => console.log(err)
      );
  }

  editPayment(payment: IPayment) {
    //console.log(payment.srbTax)
    this.paymentForm.patchValue({
      registerType: 2,
      paymentType: payment.paymentType,
      date: payment.paymentDate,
      description: payment.description,
      businessPartner: payment.businessPartnerId,
      account: payment.accountId,
      paymentRegister: payment.paymentRegisterId,
      grossPayment: payment.grossPayment,
      campusId: payment.campusId,
      discount: payment.discount,
      salesTax: payment.salesTax,
      SRBTax : payment.srbTax || 0,
      incomeTax: payment.incomeTax,
    });
    this.loadAccountList({value: payment.paymentRegisterType}, payment.paymentRegisterId)
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
    console.log(this.paymentModel)
    if (this.paymentModel.id) {
      this.paymentService.updatePayment(this.paymentModel, this.documents.find(x => x.id === this.data.docType).value)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(() => {
            this.toastService.success('Updated Successfully', '' + this.documents.find(x => x.id === this.data.docType).value)
            this.route.navigate(['/payment/'+ this.documents.find(x => x.id === this.data.docType).route +'/details/' + this.paymentModel.id])
            this.onCloseDialog()
          },
          (err) => this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Updating')
        );
    } else {
      delete this.paymentModel.id;
      this.subscription$ = this.paymentService.addPayment(this.paymentModel, this.documents.find(x => x.id === this.data.docType).value)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(() => {
            this.toastService.success('Registered Successfully', '' + this.documents.find(x => x.id === this.data.docType).value)
            this.route.navigate(['/' + ((this.formName === 'Payment') ? PAYMENT.LIST : RECEIPT.LIST)])
            this.onCloseDialog();
          },
          (err) => this.toastService.error(`${err.message || 'Something went wrong, please try again later.'}`, 'Error Creating')
        );
    }
  }

  mapFormValueToPaymentModel() {
    this.paymentModel.paymentType = (this.formName === "Payment") ? 1 : 0
    this.paymentModel.businessPartnerId = this.paymentForm.value.businessPartner;
    this.paymentModel.accountId = this.paymentForm.value.account;
    this.paymentModel.paymentDate = this.transformDate(this.paymentForm.value.date, 'yyyy-MM-dd');
    this.paymentModel.paymentRegisterId = this.paymentForm.value.paymentRegister;
    this.paymentModel.description = this.paymentForm.value.description;
    this.paymentModel.grossPayment = this.paymentForm.value.grossPayment;
    this.paymentModel.discount = this.paymentForm.value.discount || 0;
    this.paymentModel.campusId = this.paymentForm.value.campusId;
    this.paymentModel.salesTax = this.paymentForm.value.salesTax || 0;
    this.paymentModel.incomeTax = this.paymentForm.value.incomeTax || 0;
    this.paymentModel.srbTax = this.paymentForm.value.SRBTax || 0;
    // this.paymentModel.paymentRegisterType = this.paymentForm.value.registerType
    this.paymentModel.paymentRegisterType = 2
    //this.paymentModel.documentTransactionId = 0;
  }

  //for save or submit
  isSubmit(val: number) {
    this.paymentModel.isSubmit = (val === 0) ? false : true;
  }

  loadAccountList($event: MatRadioChange | any, id: number = null) {
    this.paymentForm.patchValue({
      paymentRegister: id
    })
    if ($event.value === 1) {
      this.cashAccountService.getCashAccountsDropdown().subscribe((res: IApiResponse<ICashAccount[]>) => {
        this.paymentRegisterList.next(res.result)
        this.cdRef.markForCheck();
      })
      this.propertyValue = 'chAccountId';
      this.propertyName = 'cashAccountName';
    } else {
      this.bankAccountService.getBankAccountsDropdown().subscribe((res: IApiResponse<IBankAccount[]>) => {
        this.paymentRegisterList.next(res.result)
        this.cdRef.markForCheck();
      })
      this.propertyValue = 'clearingAccountId';
      this.propertyName = 'accountTitle';
    }
  }
 
  // Calculating net payment amount
  calculatingNetPayment(): void {
    this.paymentForm.valueChanges.subscribe((val) => {
      // this.netPayment = (Number(val.grossPayment) - (Number(val.discount) + Number(val.salesTax) + Number(val.incomeTax))).toFixed(2);
      this.netPayment = +(Number(val.grossPayment) - (Number(val.discount) + Number(val.salesTax) + Number(val.incomeTax) + Number(val.SRBTax))).toFixed(2);
    });
  }
  // open business partner dialog
  openBusinessPartnerDialog() {
    if (this.permission.isGranted(this.permissions.BUSINESSPARTNER_CREATE)) {
      this.addButtonService.openBuinessPartnerDialog();
    }
  }
  // close dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}



