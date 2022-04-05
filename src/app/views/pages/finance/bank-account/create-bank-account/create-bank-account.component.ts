import {Component, Inject, Injector, OnInit, Optional} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {BankAccountService} from '../service/bankAccount.service';
import {IBankAccount} from '../model/IBankAccount';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {finalize, take} from "rxjs/operators";
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';


@Component({
  selector: 'kt-create-bank-account',
  templateUrl: './create-bank-account.component.html',
  styleUrls: ['./create-bank-account.component.scss'],
  providers:[NgxsCustomService]
})

export class CreateBankAccountComponent extends AppComponentBase implements OnInit {

  isLoading: boolean;

  //Bank account Form variable
  bankAccountForm: FormGroup;

  //Bank account model
  bankAccount: IBankAccount;

  title: string = 'Create Bank Account'

  //validation messages
  validationMessages = {
    'accountNumber': {
      'required': 'Account Number is required.'
    },
    'bankName': {
      'required': 'Bank Name is required.'
    },
    // 'branch': {
    //   'required': 'Branch Name is required.'
    // },
    'openingBalance': {
      'required': 'Opening Balance is required.'
    },
    'accountTitle': {
      'required': 'Account Title is required.'
    },
    'OBDate': {
      'required': 'Opening Balance Date is required.'
    },
    'campusId': {
      'required': 'Campus is required.'
    },
  }

  //Error keys
  formErrors = {
    'accountNumber': '',
    'bankName': '',
   // 'branch': '',
    'openingBalance': '',
    'accountTitle': '',
    'OBDate': '',
    'campusId': ''
  }

  //Injecting dependencies
  constructor(
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateBankAccountComponent>,
    public ngxsService: NgxsCustomService,
    private bankAccountService: BankAccountService,
    injector: Injector
  ) {
    super(injector)
  }

  ngOnInit() {
    this.bankAccountForm = this.fb.group({
      accountNumber: ['', [Validators.required]],
      bankName: ['', [Validators.required]],
      branch: [''],
      openingBalance: ['', [Validators.required]],
      OBDate: ['', [Validators.required]],
      accountTitle: ['', [Validators.required]],
      campusId: ['', [Validators.required]],
    });


    if (this._id) {
      this.title = 'Edit Bank Account'
      this.isLoading = true
      this.getBankAccount(this._id);
    } else {
      this.bankAccount = {
        id: null,
        accountNumber: null,
        bankName: '',
        branch: '',
        openingBalance: null,
        accountTitle: '',
        openingBalanceDate: null,
        campusId: null,
        currency: ''
      };
    }
    this.ngxsService.getCampusFromState()
  }

  getBankAccount(id: number) {
    this.bankAccountService.getBankAccount(id)
      .subscribe(
        (bankAccount: IApiResponse<IBankAccount>) => {
          this.isLoading = false;
          this.editBankAccount(bankAccount.result);
          this.bankAccount = bankAccount.result as IBankAccount;
          console.log("bank account: ", this.bankAccount);
          
        },
        (err) => console.log(err)
      );
  }

  //edit bank account
  editBankAccount(bankAccount: IBankAccount) {
    this.bankAccountForm.patchValue({
      id: bankAccount.id,
      accountNumber: bankAccount.accountNumber,
      bankName: bankAccount.bankName,
      branch: bankAccount.branch,
      openingBalance: bankAccount.openingBalance,
      OBDate: bankAccount.openingBalanceDate,
      accountTitle: bankAccount.accountTitle,
      campusId: bankAccount.campusId,
      currency: 'PKR'
    });
    this.bankAccountForm.get('openingBalance').disable()
    this.bankAccountForm.get('OBDate').disable()
    this.bankAccountForm.get('campusId').disable()
  }

  //submit Bank Account Form
  onSubmit() {
    if (this.bankAccountForm.invalid) {
      return
    }
    this.isLoading = true;
    this.mapFormValueToClientModel();
    console.log(this.bankAccount)
    
    if (this.bankAccount.id) {
      this.bankAccountService.updateBankAccount(this.bankAccount)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(() => {
          this.toastService.success('Updated Successfully', 'Bank Account')
          this.onCloseDialog()
        },
        (err) => this.toastService.error('Something went wrong', 'Bank Account')
      )
    } else {
      delete this.bankAccount['id'];
      this.bankAccountService.addBankAccount(this.bankAccount)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(
        () => {
          this.toastService.success('Created Successfully', 'Bank Account')
          this.onCloseDialog()
        },
        (err) => this.toastService.error('Something went wrong', 'Bank Account')
      );
    }
  }

  mapFormValueToClientModel() {
    this.bankAccount.accountNumber = this.bankAccountForm.value.accountNumber;
    this.bankAccount.bankName = this.bankAccountForm.value.bankName;
    this.bankAccount.branch = this.bankAccountForm.value.branch;
    this.bankAccount.openingBalance = this.bankAccountForm.value.openingBalance;
    this.bankAccount.accountTitle = this.bankAccountForm.value.accountTitle;
    this.bankAccount.openingBalanceDate = this.transformDate(this.bankAccountForm.value.OBDate, 'yyyy-MM-dd');
    this.bankAccount.campusId = this.bankAccountForm.value.campusId;
    this.bankAccount.currency = 'PKR';
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }

  reset() {
    this.bankAccountForm.get('accountNumber').reset()
    this.bankAccountForm.get('bankName').reset()
    this.bankAccountForm.get('branch').reset()
    this.bankAccountForm.get('accountTitle').reset()
    this.bankAccountForm.get('OBDate').reset()
    this.bankAccountForm.get('campusId').reset()
    if(!this._id)  this.bankAccountForm.get('openingBalance').reset()
    this.logValidationErrors(this.bankAccountForm , this.formErrors , this.validationMessages)
  }
}



