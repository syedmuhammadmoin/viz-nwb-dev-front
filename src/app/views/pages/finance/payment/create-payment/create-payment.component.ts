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
import { PAYMENT } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ICashAccount } from '../../cash-account/model/ICashAccount';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IBankAccount } from '../../bank-account/model/IBankAccount';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'kt-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.scss'],
  providers:[NgxsCustomService]
})

export class CreatePaymentComponent extends AppComponentBase implements OnInit {

  // for permissions 
  public permissions = Permissions;
  // doc type enum
  docType = DocType
  
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



  // validation messages
  validationMessages = {
    registerType: {
      required : 'Register Type is required'
    },
    paymentType: {
      required: 'Payment Type is required'
    },
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
    }
  }

  // Error keys
  formErrors = {
    registerType: '',
    paymentType: '',
    date: '',
    description: '',
    businessPartner: '',
    account: '',
    paymentRegister: '',
    grossPayment: ''
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
    @Optional() @Inject(MAT_DIALOG_DATA) public _id: number,
    public dialogRef: MatDialogRef<CreatePaymentComponent>,
    injector: Injector
  ) {
    super(injector)
  }

  groups = [
    {id: 1, viewValue: 'Inflow'},
    {id: 2, viewValue: 'Outflow'}
  ];

  ngOnInit() {
    this.paymentForm = this.fb.group({
      registerType: ['', [Validators.required]],
      paymentType: ['', [Validators.required]],
      date: ['', [Validators.required]],
      description: ['', [Validators.required]],
      businessPartner: ['', [Validators.required]],
      account: ['', [Validators.required]],
      paymentRegister: ['', [Validators.required]],
      grossPayment: ['',[Validators.required , Validators.min(0)]],
      discount: [0],
      salesTax: [0],
      incomeTax: [0]
    });

    // initializing payment model
    if (this._id) {
      this.isLoading = true;
      this.getPayment(this._id);
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
        description: '',
        grossPayment: null,
        discount: null,
        salesTax: null,
        incomeTax: null,
        //documentTransactionId: null,
      }
    };    
    this.calculatingNetPayment();
    this.ngxsService.getBusinessPartnerFromState();
    this.ngxsService.getAccountLevel4FromState();
    
    // //get business partner list from service
    // this.addButtonService.getBusinessPartnerTypes();
  }

  getPayment(id: number) {
    this.paymentService.getPaymentById(id)
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
    this.paymentForm.patchValue({
      registerType: payment.paymentRegisterType,
      paymentType: payment.paymentType,
      date: payment.paymentDate,
      description: payment.description,
      businessPartner: payment.businessPartnerId,
      account: payment.accountId,
      paymentRegister: payment.paymentRegisterId,
      grossPayment: payment.grossPayment,
      salesTax: payment.salesTax,
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
      this.paymentService.updatePayment(this.paymentModel)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(() => {
            this.toastService.success('Updated Successfully', 'Payment')
            this.route.navigate(['/' + PAYMENT.ID_BASED_ROUTE('details' , this.paymentModel.id )])
            this.onCloseDialog()
          },
          (err) => this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Updating')
        );
    } else {
      delete this.paymentModel.id;
      this.subscription$ = this.paymentService.addPayment(this.paymentModel)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(() => {
            this.toastService.success('Registered Successfully', 'Payment')
            this.route.navigate(['/' + PAYMENT.LIST])
            this.onCloseDialog();
          },
          (err) => this.toastService.error(`${err.message || 'Something went wrong, please try again later.'}`, 'Error Creating')
        );
    }
  }

  mapFormValueToPaymentModel() {
    this.paymentModel.paymentType = this.paymentForm.value.paymentType;
    this.paymentModel.businessPartnerId = this.paymentForm.value.businessPartner;
    this.paymentModel.accountId = this.paymentForm.value.account;
    this.paymentModel.paymentDate = this.transformDate(this.paymentForm.value.date, 'yyyy-MM-dd');
    this.paymentModel.paymentRegisterId = this.paymentForm.value.paymentRegister;
    this.paymentModel.description = this.paymentForm.value.description;
    this.paymentModel.grossPayment = this.paymentForm.value.grossPayment;
    this.paymentModel.discount = this.paymentForm.value.discount;
    this.paymentModel.salesTax = this.paymentForm.value.salesTax;
    this.paymentModel.incomeTax = this.paymentForm.value.incomeTax;
    this.paymentModel.paymentRegisterType = this.paymentForm.value.registerType
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
      this.propertyName = 'bankName';
    }
  }
 
  // Calculating net payment amount
  calculatingNetPayment(): void {
    this.paymentForm.valueChanges.subscribe((val: IPayment) => {
      // this.netPayment = (Number(val.grossPayment) - (Number(val.discount) + Number(val.salesTax) + Number(val.incomeTax))).toFixed(2);
      this.netPayment = +(Number(val.grossPayment) - (Number(val.discount) + Number(val.salesTax) + Number(val.incomeTax))).toFixed(2);
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



