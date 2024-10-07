import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { lastValueFrom, take, finalize } from 'rxjs';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChartOfAccountService } from '../../../chat-of-account/service/chart-of-account.service';
import { DocType, Permissions, ResponseMessage } from 'src/app/views/shared/AppEnum';
import { ICurrency } from '../../model/ICurrency';
import { CurrencyService } from '../../service/currency.service';
import { CURRENCY } from 'src/app/views/shared/AppRoutes';

@Component({
  selector: 'vl-create-currency',
  standalone: false,
  templateUrl: './create-currency.component.html',
  styleUrl: './create-currency.component.scss'
})
export class CreateCurrencyComponent extends AppComponentBase implements OnInit {

  //Loader
  isLoading: boolean
  isCurrency: boolean;
  selectedType: string;
  public selectedAccount: String;
  otherAccountsList: any;

  // currency form declaration
  form: FormGroup;

  //currency model 
  currencyModel: ICurrency = {} as ICurrency;

  //get currency data by id
  currencyDataByID: ICurrency | any;

  screenName = AppConst.Documents.find(doc => doc.id === DocType.Currency)?.value;

  title: string = 'Create ' + this.screenName;


  permissions = Permissions




  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // validation messages
  validationMessages = {
    code: {
      required: 'Code is required.',
      maxlength: 'Code cannot exceed 3 characters.',
    },
    symbol: {
      required: 'Symbol is required.',
      maxlength: 'Symbol cannot exceed 5 characters.',
    },
    name: {
      required: 'Name is required.',
      maxlength: 'Name cannot exceed 100 characters.',
    },
    unit: {
      maxlength: 'Unit cannot exceed 50 characters.',
    },
    subUnit: {
      maxlength: 'SubUnit cannot exceed 50 characters.',
    }
  };


  //error keys
  formErrors: any = {
    name: '',
    currencyType: '',
    accountId: '',
  };

  constructor(private fb: FormBuilder,
    public currencyService: CurrencyService,
    public ngxsService: NgxsCustomService,
    public route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private accountService: ChartOfAccountService,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [],
      code: ['', [Validators.required, Validators.maxLength(3)]],
      symbol: ['', [Validators.required, Validators.maxLength(5)]],
      name: ['', [Validators.maxLength(100)]],
      unit: ['', Validators.maxLength(50)],
      subUnit: ['', Validators.maxLength(50)],
      currencyLines: this.fb.array([
      ])
    });

    this.route.queryParams.subscribe((param: Params) => {
      const id = param.q;
      this.isCurrency = param.isCurrency;
      if (id && this.isCurrency) {
        this.title = 'Edit ' + this.screenName
        this.getCurrency(id);
      }
    })



    //Get Data From Store
    this.ngxsService.getOtherAccountsFromState();
    lastValueFrom(this.accountService.getOtherAccounts()).then(res => {
      this.otherAccountsList = res.result
    })

  }


  createCurrencyLine(): FormGroup {
    const line = this.fb.group({
      id: [],
      date: new Date(),
      unitPerUSD: [1.00000],
      usdPerUnit: [1.000000]
    });

    // Set up reciprocal logic between `unitPerUSD` and `usdPerUnit`
    line.get('unitPerUSD')?.valueChanges.subscribe((value: number) => {
      const reciprocal = value ? parseFloat((1 / value).toFixed(6)) : 1;
      line.get('usdPerUnit')?.setValue(reciprocal, { emitEvent: false });
    });

    line.get('usdPerUnit')?.valueChanges.subscribe((value: number) => {
      const reciprocal = value ? parseFloat((1 / value).toFixed(6)) : 1;
      line.get('unitPerUSD')?.setValue(reciprocal, { emitEvent: false });
    });

    return line;
  }

  get currencyLines(): FormArray {
    return this.form.get('currencyLines') as FormArray;
  }

  addCurrencyLine(): void {
    const line = this.createCurrencyLine();
    this.currencyLines.push(line)
  }

  removeCurrencyLine(index: number): void {
    this.currencyLines.removeAt(index);
  }

  // Getting currency values for update
  getCurrency(id: number) {
    this.currencyService.getCurrency(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe(
        (currency: IApiResponse<ICurrency>) => {
          this.editCurrency(currency.result);
          this.currencyDataByID = currency.result;
          this.currencyModel = currency.result

        }
      );
  }

  // Patching values to currency form
  editCurrency(currency: any) {
    this.form.patchValue({
      id: currency.id,
      name: currency.name,
      code: currency.code,
      symbol: currency.symbol,
      unit: currency.unit,
      subUnit: currency.subUnit,

    });
    this.form.setControl('currencyLines', this.patchCurrencyLines(currency.currencyLines))
  }

  patchCurrencyLines(lines: any[]): FormArray {

    const formArray = new FormArray([]);
    lines.forEach((line: any) => {
      formArray.push(this.fb.group({
        id: line.id,
        date: line.date,
        unitPerUSD: [line.unitPerUSD],
        usdPerUnit: [line.usdPerUnit],
      }))
    })
    return formArray
  }

  onSubmit() {

    this.currencyModel = this.form.value;

    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.currencyDataByID?.id) {
      this.currencyService.updateCurrency(this.currencyModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
          this.router.navigate(['/' + CURRENCY.LIST]);
          this.toastService.success(ResponseMessage.UpdatedSuccess, this.screenName);
        }
        );
    } else {

      this.currencyService.add(this.currencyModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
          this.router.navigate(['/' + CURRENCY.LIST]);
          this.toastService.success(ResponseMessage.CreateSucess, this.screenName);
        }
        );

    }
  }

  // Mapping values from currency form to currency model
  mapFormValueToCurrencyModel() {
    this.currencyModel.id = this.currencyDataByID?.id;
    this.currencyModel.code = this.form.value.code;
    this.currencyModel.symbol = this.form.value.symbol;
    this.currencyModel.name = this.form.value.name;
    this.currencyModel.unit = this.form.value.unit;
    this.currencyModel.subUnit = this.form.value.subUnit;
    this.currencyModel.currencyLines = this.form.value.currencyLines;

  }

  reset() {
    this.formDirective.resetForm();
  }

}











