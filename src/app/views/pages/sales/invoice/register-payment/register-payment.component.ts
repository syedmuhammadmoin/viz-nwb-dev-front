import { ChangeDetectorRef, Component, Inject, Injector, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';

import { BehaviorSubject} from 'rxjs';
import { finalize, take} from 'rxjs/operators';

import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { Permissions} from 'src/app/views/shared/AppEnum';
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
  providers:[PaymentService, CashAccountService,BankAccountService]
})

export class RegisterPaymentComponent extends AppComponentBase implements OnInit {

  // registerPaymentForm declaration
  registerPaymentForm: FormGroup;

  permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Limit Date
  maxDate = new Date();


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
      max: 'Value must be less than total ' + this.data.formName + ' amount!'
    },
    // discount: {
    //   required: 'Discount is required'
    // },
    // salesTax: {
    //   required: 'sales Tax is required'
    // },
    // incomeTax: {
    //   required: 'Income Tax is required'
    // }
  }

  // keys for validation
  formErrors = {
    paymentDate: '',
    description: '',
    paymentRegister: '',
    grossPayment: '',
    // discount: '',
    // salesTax: '',
    // incomeTax: ''
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
      registerType: [''],
      description: ['', [Validators.required]],
      paymentRegister: ['', [Validators.required]],
      grossPayment: [this.data.pendingAmount, [Validators.required, Validators.max(this.data.pendingAmount)]],
      discount: [0],
      salesTax: [0],
      incomeTax: [0],
    })

    // Setting net payment amount
    this.netPayment = (this.data.pendingAmount).toFixed(2);

    // Calling calculatingNetPayment function
    this.calculatingNetPayment();

    // initializing payment model
    this.paymentModel = {
      id: null,
      paymentRegisterType: null,
      paymentType: null,
      businessPartnerId: null,
      accountId: null,
      campusId: null,
      paymentDate: null,
      paymentRegisterId: null,
      description: '',
      grossPayment: null,
      discount: null,
      salesTax: null,
      incomeTax: null,
      //documentTransactionId: null,
    }
  }

  // Calculating net payment amount
  calculatingNetPayment(): void {
    this.registerPaymentForm.valueChanges.subscribe(val => {
      this.netPayment = (Number(val.grossPayment) - (Number(val.discount) + Number(val.salesTax) + Number(val.incomeTax))).toFixed(2);
    });
  }


  onSubmit() {
    if (this.registerPaymentForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValueToPaymentModel();
    delete this.paymentModel.id;
    this.paymentService.addPayment(this.paymentModel)
      .pipe(
        take(1),
        finalize(() => this.isLoading = false))
      .subscribe(
        (res) => {
          this.toastService.success('' + res.message, 'Payment');
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
    this.paymentModel.paymentRegisterType = this.registerPaymentForm.value.registerType;
    this.paymentModel.paymentDate = this.transformDate(this.registerPaymentForm.value.paymentDate, 'yyyy-MM-dd');
    this.paymentModel.paymentRegisterId = this.registerPaymentForm.value.paymentRegister;
    this.paymentModel.description = this.registerPaymentForm.value.description;
    this.paymentModel.grossPayment = this.registerPaymentForm.value.grossPayment;
    this.paymentModel.salesTax = this.registerPaymentForm.value.salesTax;
    this.paymentModel.discount = 0;
    this.paymentModel.incomeTax = this.registerPaymentForm.value.incomeTax;
    //this.paymentModel.documentTransactionId = this.data.transactionId;
  }

  loadAccountList($event: MatRadioChange) {
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

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}

// fixed data interface
export interface DialogData {
  accountId: number
  businessPartnerId: number;
  customerInvoiceId: number;
  transactionId: number;
  pendingAmount: number;
  paymentType: number;
  formName: string;
}

