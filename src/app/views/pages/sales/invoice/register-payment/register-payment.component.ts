import { ChangeDetectorRef, Component, Inject, Injector, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';

import { BehaviorSubject} from 'rxjs';
import { finalize, take} from 'rxjs/operators';

import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { DocType, Permissions} from 'src/app/views/shared/AppEnum';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IBankAccount } from '../../../finance/bank-account/model/IBankAccount';
import { BankAccountService } from '../../../finance/bank-account/service/bankAccount.service';
import { ICashAccount } from '../../../finance/cash-account/model/ICashAccount';
import { CashAccountService } from '../../../finance/cash-account/service/cashAccount.service';
import { IPayment } from '../../../finance/payment/model/IPayment';
import { PaymentService } from '../../../finance/payment/service/payment.service';
import { IAccount } from '../../../profiling/category/model/IAccount';

@Component({
  selector: 'kt-register-payment',
  templateUrl: './register-payment.component.html',
  styleUrls: ['./register-payment.component.scss'],
  // providers:[PaymentService, CashAccountService,BankAccountService]
})

export class RegisterPaymentComponent extends AppComponentBase implements OnInit {

  // registerPaymentForm declaration
  registerPaymentForm: FormGroup;

  permissions = Permissions;

  documents = AppConst.Documents

  // For Loading
  isLoading: boolean;

  // Limit Date
  maxDate = new Date();

  //set readonly gross payment field
  isPayrollPayment: boolean = false;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;


  // paymentModel declaration
  paymentModel: IPayment;

  // account list for drop down
  accountList: IAccount[];

  // net payment variable declaration
  public netPayment: any;

  // validation messages
  validationMessages = {
    paymentDate: {
      required: 'Date is required'
    },
    description: {
      required: 'Description is required'
    },
    paymentRegister: {
      required: 'Payment Register is required'
    },
    grossPayment: {
      required: 'Gross Payment is required',
      min: 'Please insert correct Payment !',
      max: 'Value must be less than total ' + this.data.formName + ' amount!'
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

  // keys for validation
  formErrors = {
    paymentDate: '',
    description: '',
    paymentRegister: '',
    grossPayment: '',
    discount: '',
    salesTax: '',
    incomeTax: '',
    SRBTax: ''
  }

  // For Register Type Accounts
  propertyValue: string;
  propertyName: string;
  paymentRegisterList: BehaviorSubject<ICashAccount[] | IBankAccount[] | []> = new BehaviorSubject<ICashAccount[] | IBankAccount[] | []>([]);

  constructor(
    public dialogRef: MatDialogRef<RegisterPaymentComponent>,
    public fb: FormBuilder,
    private paymentService: PaymentService,
    private cashAccountService: CashAccountService,
    private bankAccountService: BankAccountService,
    private cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    injector: Injector
  ) {
    super(injector)
  }

  ngOnInit() {

    this.registerPaymentForm = this.fb.group({
      paymentDate: ['', [Validators.required]],
      registerType: [2],
      description: ['', [Validators.required]],
      paymentRegister: ['', [Validators.required]],
      grossPayment: [this.data.pendingAmount, [Validators.required, Validators.min(0), Validators.max(this.data.pendingAmount)]],
      discount: [0, [Validators.min(0)]],
      salesTax: [0,[Validators.min(0)]],
      incomeTax: [0, [Validators.min(0)]],
      SRBTax: [0,[Validators.min(0)]],
    })

    this.loadAccountList({value: 2})

    // Setting net payment amount
    this.netPayment = (this.data.pendingAmount).toFixed(2);

    // Calling calculatingNetPayment function
    this.calculatingNetPayment();

    this.isPayrollPayment = (this.data.docType === DocType.PayrollPayment) ? true : false;

    // initializing payment model
    this.paymentModel = {
      id: null,
      paymentRegisterType: null,
      paymentType: null,
      businessPartnerId: null,
      accountId: null,
      campusId: null,
      srbTax: null,
      paymentDate: null,
      paymentRegisterId: null,
      description: '',
      grossPayment: null,
      discount: null,
      salesTax: null,
      incomeTax: null,
      documentLedgerId: null,
    }
  }

  // Calculating net payment amount
  calculatingNetPayment(): void {
    this.registerPaymentForm.valueChanges.subscribe((val) => {
      // this.netPayment = (Number(val.grossPayment) - (Number(val.discount) + Number(val.salesTax) + Number(val.incomeTax))).toFixed(2);
      this.netPayment = +(Number(val.grossPayment) - (Number(val.discount) + Number(val.salesTax) + Number(val.incomeTax) + Number(val.SRBTax))).toFixed(2);
    });
  }


  onSubmit() {
    if (this.registerPaymentForm.invalid) {
      return;
    }

    this.isLoading = true;
    console.log(this.paymentModel)
    this.mapFormValueToPaymentModel();
    delete this.paymentModel.id;
    this.paymentService.addPayment(this.paymentModel, this.documents.find(x => x.id === this.data.docType).value)
      .pipe(
        take(1),
        finalize(() => this.isLoading = false))
      .subscribe(
        (res) => {
          this.toastService.success('Registered Successfully', '' + this.documents.find(x => x.id === this.data.docType).value)
          this.dialogRef.close(this.registerPaymentForm.value);
          this.dialogRef.close()
        },
        (err) => console.log(err)
      );
  }

  // Mapping values from form to payment model
  mapFormValueToPaymentModel() {
    this.paymentModel.paymentType = this.data.paymentType;
    this.paymentModel.businessPartnerId = this.data.businessPartnerId;
    this.paymentModel.accountId = this.data.accountId;
    this.paymentModel.campusId = this.data.campusId;
    this.paymentModel.paymentRegisterType = 2;
    this.paymentModel.paymentDate = this.transformDate(this.registerPaymentForm.value.paymentDate, 'yyyy-MM-dd');
    this.paymentModel.paymentRegisterId = this.registerPaymentForm.value.paymentRegister;
    this.paymentModel.description = this.registerPaymentForm.value.description;
    this.paymentModel.grossPayment = this.registerPaymentForm.value.grossPayment || 0;
    this.paymentModel.salesTax = this.registerPaymentForm.value.salesTax || 0;
    this.paymentModel.srbTax = this.registerPaymentForm.value.SRBTax || 0;
    this.paymentModel.discount = this.registerPaymentForm.value.discount || 0;
    this.paymentModel.incomeTax = this.registerPaymentForm.value.incomeTax || 0;
    this.paymentModel.documentLedgerId = this.data.documentLedgerId;
  }

  loadAccountList($event: MatRadioChange | any) {
    
    this.registerPaymentForm.patchValue({
      paymentRegister: null
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

  //for save or submit
  isSubmit(val: number) {
    this.paymentModel.isSubmit = (val === 0) ? false : true;
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }

  resetForm() {
    this.formDirective.resetForm();
    this.registerPaymentForm.get('grossPayment').setValue(this.data.pendingAmount);
  }
}

// fixed data interface
export interface DialogData {
  accountId: number
  businessPartnerId: number;
  //customerInvoiceId: number;
  campusId: number,
  documentLedgerId: number;
  pendingAmount: number;
  paymentType: number;
  formName: string;
  docType: number;
}

