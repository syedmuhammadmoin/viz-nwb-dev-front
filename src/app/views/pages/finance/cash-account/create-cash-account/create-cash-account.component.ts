import {Component, Inject, Injector, OnInit, Optional} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CashAccountService} from '../service/cashAccount.service';
import {ICashAccount} from '../model/ICashAccount';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {finalize, take} from "rxjs/operators";
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
@Component({
  selector: 'kt-create-cash-account',
  templateUrl: './create-cash-account.component.html',
  styleUrls: ['./create-cash-account.component.scss'],
  providers:[NgxsCustomService]
})
export class CreateCashAccountComponent extends AppComponentBase implements OnInit {
  
 
    isLoading: boolean;
  
    // Cash account Form variable
    cashAccountForm: FormGroup;
  
    // Cash account model
    cashAccountModel: ICashAccount;

    title: string = 'Create Cash Account'
  
    // validation messages
    validationMessages = {
      cashAccountName: {
        required: 'Cash Account Name is required.'
      },
      // handler: {
      //   required: 'Manager/Handler is required'
      // },
      openingBalance: {
        required: 'opening balance is required.',
        min: 'Please insert correct value.'
      },
      OBDate: {
        required: 'Opening Balance Date is required.'
      },
      campusId: {
        required: 'Campus is required.'
      },
      // currency: {
      //   required: 'currency is required'
      // }
    }
  
    // Error keys
    formErrors = {
      cashAccountName: '',
      //handler: '',
      openingBalance: '',
      OBDate: '',
      campusId: ''
      //currency: '',
    }
  
    // Injecting dependencies
    constructor(
      private fb: FormBuilder,
      @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
      public  dialogRef: MatDialogRef<CreateCashAccountComponent>,
      public ngxsService: NgxsCustomService,
      private cashAccountService: CashAccountService,
      injector: Injector
    ) {
      super(injector)
    }
  
    ngOnInit() {
      this.cashAccountForm = this.fb.group({
        cashAccountName: ['', [Validators.required]],
        handler: [''],
        openingBalance: ['', [Validators.required, Validators.min(1)]],
        OBDate: ['', [Validators.required]],
        campusId: ['', [Validators.required]],
        //currency: ['', [Validators.required]]
      });
  
      if (this._id) {
        this.title = 'Edit Cash Account'
        this.isLoading = true
        this.getCashAccount(this._id);
      } else {
        this.cashAccountModel = {
          id: null,
          cashAccountName: '',
          handler: '',
          campusId: null,
          openingBalance: null,
          openingBalanceDate: null,
          currency: '',
        };
      }

      this.ngxsService.getCampusFromState()
    }
  
    // Dialogue close function
    onCloseDialog() {
      this.dialogRef.close();
    }
  
    // get Cash account by id
    getCashAccount(id: number) {
      this.cashAccountService.getCashAccount(id)
        .subscribe(
          (cashAccount: IApiResponse<ICashAccount>) => {
            this.isLoading = false;
            this.editCashAccount(cashAccount.result);
            this.cashAccountModel = cashAccount.result;
          },
          (err) => console.log(err)
        );
    }
  
    // Edit method
    editCashAccount(cashAccount: ICashAccount) {
      this.cashAccountForm.patchValue({
        id: cashAccount.id,
        cashAccountName: cashAccount.cashAccountName,
        handler: cashAccount.handler,
        openingBalance: cashAccount.openingBalance,
        OBDate: cashAccount.openingBalanceDate,
        campusId: cashAccount.campusId
        //currency: cashAccount.currency,
      });
      this.cashAccountForm.get('openingBalance').disable()
      this.cashAccountForm.get('OBDate').disable()
      this.cashAccountForm.get('campusId').disable()
    }
  
    // submit cash account form
    onSubmit() {
      if (this.cashAccountForm.invalid) {
        return
      }
      this.isLoading = true;
      this.mapFormValueToCashAccountModel();
      if (this.cashAccountModel.id) {
        this.cashAccountService.updateCashAccount(this.cashAccountModel)
          .pipe(
            take(1),
            finalize(() => this.isLoading = false))
          .subscribe(() => {
            this.toastService.success('Updated Successfully' , 'Cash Account')
            this.onCloseDialog()
          },
          (err) => this.toastService.error('Something went wrong', 'Cash Account')
        );
      } else {
        delete this.cashAccountModel.id;
        this.cashAccountService.addCashAccount(this.cashAccountModel)
          .pipe(
            take(1),
            finalize(() => this.isLoading = false))
          .subscribe(() => {
            this.toastService.success('Created Successfully' , 'Cash Account')
            this.onCloseDialog()
          },
          (err) => this.toastService.error('Something went wrong', 'Cash Account')
        );
      }
    }
  
    // map form values
    mapFormValueToCashAccountModel() {
      this.cashAccountModel.cashAccountName = this.cashAccountForm.value.cashAccountName;
      this.cashAccountModel.handler = this.cashAccountForm.value.handler;
      this.cashAccountModel.openingBalance = this.cashAccountForm.value.openingBalance;
      this.cashAccountModel.openingBalanceDate = this.transformDate(this.cashAccountForm.value.OBDate, 'yyyy-MM-dd');
      this.cashAccountModel.campusId = this.cashAccountForm.value.campusId;
      this.cashAccountModel.currency = 'PKR';
    }

    reset() {
      this.cashAccountForm.get('cashAccountName').reset()
      this.cashAccountForm.get('handler').reset()
      if(!this._id)  this.cashAccountForm.get('openingBalance').reset()
      this.cashAccountForm.get('OBDate').reset()
      this.cashAccountForm.get('campusId').reset()
      this.logValidationErrors(this.cashAccountForm , this.formErrors , this.validationMessages)
    }
  }
  

