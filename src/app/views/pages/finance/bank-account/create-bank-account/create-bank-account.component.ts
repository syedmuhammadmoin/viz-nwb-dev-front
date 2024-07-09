import { Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import { BankAccountService} from '../service/bankAccount.service';
import { IBankAccount} from '../model/IBankAccount';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { finalize, take} from "rxjs/operators";
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IsReloadRequired } from '../../../profiling/store/profiling.action';
import { BankAccountState } from '../store/bank-account.state';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AppConst } from 'src/app/views/shared/AppConst';


@Component({
  selector: 'kt-create-bank-account',
  templateUrl: './create-bank-account.component.html',
  styleUrls: ['./create-bank-account.component.scss']
})

export class CreateBankAccountComponent extends AppComponentBase implements OnInit {

  isLoading: boolean;
  public currentClient : any ={}
  //Bank account Form variable
  bankAccountForm: FormGroup;

  permissions = Permissions

  //Bank account model
  bankAccount: IBankAccount = {} as IBankAccount;

  title: string = 'Create Bank Account'

  dateLimit : Date = new Date();

  //show Buttons
  showButtons: boolean = true; 

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  //validation messages
  validationMessages = {
    accountNumber: {
      required: 'Account Number is required.',
      min: 'Please insert correct value.'
    },
    bankName: {
      required: 'Bank Name is required.'
    },
    openingBalance: {
      required: 'Opening Balance is required.',
      min: 'Please insert correct value.'
    },
    bankAccountType: {
      required: 'Account type is required.',
    },
    accountTitle: {
      required: 'Account Title is required.'
    },
    OBDate: {
      required: 'Opening Balance Date is required.'
    },
    campusId: {
      required: 'Campus is required.'
    },
    accountCode: {
      required: 'Account Code is required.',
      maxlength: 'Limit is 10 characters.'
    },
  }

  //Error keys
  formErrors: any = {
    accountNumber: '',
    bankName: '',
    openingBalance: '',
    accountTitle: '',
    bankAccountType: '',
    OBDate: '',
    campusId: '',
    accountCode: ''
  }

  //Injecting Dependencies
  constructor(
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public _id: number,
    public dialogRef: MatDialogRef<CreateBankAccountComponent>,
    public ngxsService: NgxsCustomService,
    private bankAccountService: BankAccountService,
    injector: Injector,
  ) {
    super(injector)
  }

  ngOnInit() {  
    
    this.currentClient = AppConst.ClientConfig.config
    this.bankAccountForm = this.fb.group({
      accountNumber: ['', [Validators.required, Validators.min(1)]],
      bankName: ['', [Validators.required]],
      branch: [''],
      purpose: [''],
      iban: [''],
      accountTitle: ['', [Validators.required]],
      accountCode: ['', [Validators.required, Validators.maxLength(10)]],
      bankAccountType: ['', [Validators.required]],
      openingBalance: ['', [Validators.required, Validators.min(0)]],
      OBDate: ['', [Validators.required]],
      campusId: (AppConst.ClientConfig.config.isCampus) ?  ['',  [Validators.required]] : [null,[Validators.nullValidator]]
      
    });


    if (this._id) {
      this.showButtons = (this.permission.isGranted(this.permissions.BANKACCOUNT_EDIT)) ? true : false;
      //if user have no permission to edit, so disable all fields
      this.title = 'Edit Bank Account'
      this.isLoading = true
      this.getBankAccount(this._id);
    } 

    //Get Data from Store
    this.ngxsService.getCampusFromState()
  }

  accountTypeList = [
    {id: 0 , name: 'Current'},
    {id: 1 , name: 'Saving'}
  ]

  getBankAccount(id: number) {
    this.bankAccountService.getBankAccount(id)
      .subscribe(
        (bankAccount: IApiResponse<IBankAccount>) => {
          this.isLoading = false;
          this.editBankAccount(bankAccount.result);
          this.bankAccount = bankAccount.result;
        }
      );
  }

  //edit bank account
  editBankAccount(bankAccount: IBankAccount) {
    this.bankAccountForm.patchValue({
      id: bankAccount.id,
      accountNumber: bankAccount.accountNumber,
      bankName: bankAccount.bankName,
      branch: bankAccount.branch,
      accountTitle: bankAccount.accountTitle,
      iban: bankAccount.iban,
      purpose: bankAccount.purpose,
      accountCode: bankAccount.accountCode,
      bankAccountType: bankAccount.bankAccountType,
      openingBalance: bankAccount.openingBalance,
      OBDate: bankAccount.openingBalanceDate,
      campusId: bankAccount.campusId,
      currency: 'PKR'
    });

    if(!this.showButtons) this.bankAccountForm.disable()
    this.disableFields(this.bankAccountForm , 'openingBalance', 'bankAccountType', 'OBDate', 'campusId')
  }

  //submit Bank Account Form
  onSubmit() {
   if (this.bankAccountForm.invalid) {
      return
    }
    this.isLoading = true;
    this.mapFormValueToClientModel();
    
    if (this.bankAccount.id) {
      this.bankAccountService.updateBankAccount(this.bankAccount)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(() => {
          this.ngxsService.store.dispatch(new IsReloadRequired (BankAccountState , true))
          this.toastService.success('Updated Successfully', 'Bank Account')
          this.onCloseDialog()
        }
      )
    } else {
      delete this.bankAccount['id'];
      this.bankAccountService.addBankAccount(this.bankAccount)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(
        () => {
          this.ngxsService.store.dispatch(new IsReloadRequired (BankAccountState , true))
          this.toastService.success('Created Successfully', 'Bank Account')
          this.onCloseDialog()
        }
      );
    }
  }

  mapFormValueToClientModel() {
    this.bankAccount.accountNumber = this.bankAccountForm.value.accountNumber;
    this.bankAccount.bankName = this.bankAccountForm.value.bankName;
    this.bankAccount.branch = this.bankAccountForm.value.branch;
    this.bankAccount.iban = this.bankAccountForm.value.iban;
    this.bankAccount.openingBalance = this.bankAccountForm.value.openingBalance;
    this.bankAccount.accountTitle = this.bankAccountForm.value.accountTitle;
    this.bankAccount.bankAccountType = this.bankAccountForm.value.bankAccountType;
    this.bankAccount.purpose = this.bankAccountForm.value.purpose;
    this.bankAccount.accountCode = this.bankAccountForm.value.accountCode;
    this.bankAccount.openingBalanceDate = this.transformDate(this.bankAccountForm.value.OBDate, 'yyyy-MM-dd');
    this.bankAccount.campusId = this.bankAccountForm.value.campusId;
    this.bankAccount.currency = 'PKR';
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }

  reset() {
    this.formDirective.resetForm();
  }
}



