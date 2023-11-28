import { ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ILevel4 } from '../model/ILevel4';
import { Optional } from 'ag-grid-community';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponentBase } from '../../../../../shared/app-component-base';
import { ChartOfAccountService } from '../../service/chart-of-account.service';
import { finalize, take } from 'rxjs/operators';
import { AccountLevel4State } from '../../store/account-level4.state';
import { IsReloadRequired } from 'src/app/views/pages/profiling/store/profiling.action';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { AccountPayableState } from '../../store/account-payable.state';
import { AccountReceivableState } from '../../store/account-receivable.state';
import { OtherAccountState } from '../../store/other-account.state';
import { AssetAccountState } from '../../store/asset-account.state';
import { ExpenseAccountState } from '../../store/expense-account.state';
import { GetLiabilityAccountsState } from '../../store/getLiabilityAccount.state';
import { ILevel3 } from '../../level3/model/ILevel3';

@Component({
  selector: 'kt-create-level4',
  templateUrl: './create-level4.component.html',
  styleUrls: ['./create-level4.component.scss']
})

export class CreateLevel4Component extends AppComponentBase implements OnInit {

  isLoading: boolean;
  // Declaring form variable
  level4Form: FormGroup;

  // Level4 Model
  level4Model: ILevel4;
  level3List:ILevel3;

  // Validation messages..
  validationMessages = {
    transactionalAccount: {
      required: 'Account Name is required.',
    },
    level3: {
      required: 'Head Account is required',
    },
    code: {
      required: 'Code is required.',
      maxlength: 'Limit is 10 characters.'
    }
  };
  // error keys..
  formErrors = {
    transactionalAccount: '',
    level3: '',
    code: '',
  };

  constructor(
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<CreateLevel4Component>,
    private cdRef: ChangeDetectorRef,
    private ngxsService: NgxsCustomService,
    public chartOfAccountService: ChartOfAccountService,
    injector: Injector
  ) {
    super(injector)
  }

  ngOnInit() {
    // Creating Forms
    this.level4Form = this.fb.group({
      transactionalAccount: ['', [Validators.required]],
      level3: ['', [Validators.required]],
      code: ['', [Validators.required, Validators.maxLength(10)]],
    });

    this.level4Model = {
      id: null,
      name: '',
      code: '',
      editableName: null,
      level3_id: null,
    }
    this.chartOfAccountService.getLevel3AccountsDropdown()
      .subscribe((res: any) => {
        this.level3List = res.result;
      })
    // getting data
    if (this.data.modelId) {
      this.isLoading = true;
      this.chartOfAccountService.getLevel4AccountById(this.data.modelId)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res: any) => {
          this.level4Model = res.result;
          this.patchLevel4Form(this.level4Model);
        })
    }
    if (this.data.parentId) {
      this.isLoading = true;
      this.level4Model.level3_id = this.data.parentId;
      this.level4Form.patchValue({
        level3: this.data.parentId
      });
      const level3Control = this.level4Form.get('level3');
      level3Control.disable();
      this.isLoading = false;
    }
  }

  onSubmit(): void {
    if (this.level4Form.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValuesToInvoiceModel();
    if (this.level4Model.id) {
      this.chartOfAccountService.updateLevel4Account(this.level4Model)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
          this.ngxsService.store.dispatch(new IsReloadRequired(AccountLevel4State, true))
          this.ngxsService.store.dispatch(new IsReloadRequired(AccountPayableState, true))
          this.ngxsService.store.dispatch(new IsReloadRequired(AccountReceivableState, true))
          this.ngxsService.store.dispatch(new IsReloadRequired(OtherAccountState, true))
          this.ngxsService.store.dispatch(new IsReloadRequired(AssetAccountState, true))
          this.ngxsService.store.dispatch(new IsReloadRequired(ExpenseAccountState, true))
          this.ngxsService.store.dispatch(new IsReloadRequired(GetLiabilityAccountsState, true))
          this.toastService.success('Updated Successfully', 'Transactional Account');
          this.onCloseLevel4Dialog();
        }
        );
    } else {
      delete this.level4Model['id'];
      this.chartOfAccountService.createLevel4Account(this.level4Model)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
          this.ngxsService.store.dispatch(new IsReloadRequired(AccountLevel4State, true))
          this.ngxsService.store.dispatch(new IsReloadRequired(AccountPayableState, true))
          this.ngxsService.store.dispatch(new IsReloadRequired(AccountReceivableState, true))
          this.ngxsService.store.dispatch(new IsReloadRequired(OtherAccountState, true))
          this.ngxsService.store.dispatch(new IsReloadRequired(AssetAccountState, true))
          this.ngxsService.store.dispatch(new IsReloadRequired(ExpenseAccountState, true))
          this.ngxsService.store.dispatch(new IsReloadRequired(GetLiabilityAccountsState, true))
          this.toastService.success('Created Successfully', 'Transactional Account');
          this.onCloseLevel4Dialog();
        }
        );
    }
  }

  // Mapping value to model
  mapFormValuesToInvoiceModel() {
    this.level4Model.name = this.level4Form.value.transactionalAccount;
    this.level4Model.code = this.level4Form.value.code;
    this.level4Model.level3_id = this.level4Form.value.level3 || this.level4Model.level3_id;
  }

  // Dialogue close function
  onCloseLevel4Dialog() {
    this.dialogRef.close();
  }

  private patchLevel4Form(level4Model: ILevel4) {
    this.level4Form.patchValue({
      transactionalAccount: level4Model.editableName,
      level3: level4Model.level3_id,
      code: level4Model.code
    });
    this.isLoading = false;
  }
}


