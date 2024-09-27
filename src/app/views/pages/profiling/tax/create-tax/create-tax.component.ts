import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ITax } from '../model/ITax';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { finalize, take } from "rxjs/operators";
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { Permissions, TaxComputation } from 'src/app/views/shared/AppEnum';
import { TaxService } from '../service/tax.service';
import { AppConst } from 'src/app/views/shared/AppConst';
import { lastValueFrom } from 'rxjs';
import { ChartOfAccountService } from '../../../finance/chat-of-account/service/chart-of-account.service';


@Component({
  selector: 'kt-create-tax',
  templateUrl: './create-tax.component.html',
  styleUrls: ['./create-tax.component.scss']
})

export class CreateTaxComponent extends AppComponentBase implements OnInit {

  //Loader
  isLoading: boolean
  istax: boolean;
  public selectedAccount: String;
  otherAccountsList: any;

  // tax form declaration
  taxForm: FormGroup;

  //tax model 
  taxModel: ITax = {} as ITax;

  //get tax data by id
  taxDataByID: ITax | any;

  title: string = 'Create Tax'
  taxComputation = AppConst.taxComputation

  permissions = Permissions

  //show Buttons
  // showButtons: boolean = true;


  taxTypeList = AppConst.taxType;
  taxComputationList = AppConst.taxComputation;
  taxScopeList = AppConst.taxScope;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // validation messages
  validationMessages = {
    name: {
      required: 'Tax Name is required.',
    },
    taxType: {
      required: 'Tax Type is required.',
    },
    accountId: {
      required: 'Account is required.',
    }
  };
  taxBaseList = AppConst.taxBase
  //error keys
  formErrors: any = {
    name: '',
    taxType: '',
    accountId: '',
  };

  constructor(private fb: FormBuilder,
    public taxService: TaxService,
    public ngxsService: NgxsCustomService,
    public route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private accountService: ChartOfAccountService,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    // public dialogRef: MatDialogRef<CreateTaxComponent>,
    injector: Injector
  ) {
    super(injector);
  }
  active = 1;

  temp(): void { 
    this.addInvoiceLine();
    this.addRefundine();
  }

  ngOnInit() {
    this.taxForm = this.fb.group({
      name: ['', [Validators.required]],
      taxType: [{ value: 0 }, [Validators.required]],
      accountId: ['', [Validators.required]],
      taxComputation: [''],
      taxInvoiceslines: this.fb.array([]),
      taxRefundlines: this.fb.array([])
    });

    this.route.queryParams.subscribe((param: Params) => {
      const id = param.q;
      this.istax = param.istax;
      if (id && this.istax) {
        this.title = 'Edit Tax'
        this.getTax(id);
      }
    })

    // if (this._id) {
    //   //this.showButtons = (this.permission.isGranted(this.permissions.TAXES_EDIT)) ? true : false;
    //   this.title = 'Edit tax'
    //   this.isLoading = true
    //   this.getTax(this._id);
    // }

    //Get Data From Store
    this.ngxsService.getOtherAccountsFromState();
    lastValueFrom(this.accountService.getOtherAccounts()).then(res => {
      this.otherAccountsList = res.result
      console.log(this.otherAccountsList);

    })


     this.addInvoiceLine();
     this.addRefundine();
  }
  get taxInvoiceslines(): FormArray {
    return this.taxForm.get('taxInvoiceslines') as FormArray;
  }
  get taxRefundlines(): FormArray {
    return this.taxForm.get('taxRefundlines') as FormArray;
  }

  addInvoiceLine(): void {
    const detail = this.fb.group({
      percent:[''],
      taxBase: ['', Validators.required],
      Level4_ID: [, [Validators.required, Validators.min(0)]]
    })
    console.log("Waleed add line");

    this.taxInvoiceslines.push(detail)
  }

  addRefundine(): void {
    const detail = this.fb.group({
      percent:[''],
      taxBase: ['', Validators.required],
      refundAccountId: [, [Validators.required, Validators.min(0)]]
    })
    console.log("Waleed add line");

    this.taxRefundlines.push(detail)
  }

  removeInvoiceDetail(index: number): void {
    this.taxInvoiceslines.removeAt(index);
  }
  removeRefundDetail(index: number): void {
    this.taxRefundlines.removeAt(index);
  }
  // Getting tax values for update
  getTax(id: number) {
    this.taxService.getTax(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe(
        (tax: IApiResponse<ITax>) => {
          this.editTax(tax.result);
          this.taxDataByID = tax.result;
        }
      );
  }

  // Patching values to tax form
  editTax(tax: ITax | any) {
    this.taxForm.patchValue({
      name: tax.name,
      taxType: tax.taxType,
      accountId: (tax.accountId === '00000000-0000-0000-0000-000000000000') ? null : tax.accountId,
    });

    // //if user have no permission to edit, so disable all fields
    // if(!this.showButtons) {
    //   this.taxForm.disable();
    // }
  }

  onSubmit() {
    console.log(this.taxForm.value,"Tax Form");
    
    if (this.taxForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToTaxModel();
    if (this.taxDataByID?.id) {
      this.taxService.updateTax(this.taxModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
          this.toastService.success('Updated Successfully', 'Tax')
          this.onCloseDialog();
        }
        );
    } else {

      this.taxService.add(this.taxModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
          this.toastService.success('Create Successfully', 'Tax')
          this.onCloseDialog();
        }
        );

    }
  }

  // Mapping values from tax form to tax model
  mapFormValueToTaxModel() {
    this.taxModel.id = this.taxDataByID?.id;
    this.taxModel.accountId = this.taxForm.value.accountId;
    this.taxModel.name = this.taxForm.value.name;
    this.taxModel.taxType = this.taxForm.value.taxType;
    this.taxModel.taxComputation = this.taxForm.value.taxComputation
  }

  reset() {
    this.formDirective.resetForm();
  }

  // Dialogue close function
  onCloseDialog() {
    //this.dialogRef.close();
  }
  OnChange(event: any) {

    console.log(event, "event", this.selectedAccount);

  }

  onNavChange(event) {
    if (event.nextId === 1) {
      this.cdRef.detectChanges();
    }
  }
}











