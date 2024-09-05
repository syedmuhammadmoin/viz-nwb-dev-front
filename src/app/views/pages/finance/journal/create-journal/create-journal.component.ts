import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, NgForm } from '@angular/forms';
import { CategoryService } from '../../../profiling/category/service/category.service';
import { IJournal } from '../model/IJournal';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { finalize, take, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { JournalService } from '../services/journal.service';
import { BusinessPartnerService } from '../../../profiling/business-partner/service/businessPartner.service';
import { WarehouseService } from '../../../profiling/warehouse/services/warehouse.service';
import { JournalType, Permissions } from 'src/app/views/shared/AppEnum';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { JOURNAL } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IJournalLines } from '../model/IJournalLines';
import { AppConst } from 'src/app/views/shared/AppConst';
import { ChartOfAccountService } from '../../chat-of-account/service/chart-of-account.service';
import { MatRadioButton } from '@angular/material/radio';
import { BankAccountService } from '../../bank-account/service/bankAccount.service';

@Component({
  selector: 'kt-create-journal',
  templateUrl: './create-journal.component.html',
  styleUrls: ['./create-journal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateJournalComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {
  public permissions = Permissions;
  //Loader
  isLoading: boolean;

  // Declaring form variable
  form: FormGroup;

  // Journal  Model
  JournalModel: IJournal = {} as IJournal;

  isJournal: boolean;
  title: string = 'Create Journal'
  defaultAccountLabel: string = 'Default Account'
  IsShowSuspenseAccountId: boolean = false;
  IsShowProfitAccountId: boolean = false;
  IsShowLossAccountId: boolean = false;
  IsShowBankAcountId: boolean = false;

  private destroy$ = new Subject<void>();
  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // warehouseList: any = new BehaviorSubject<any>([])

  //show toast mesasge of on campus select
  showMessage: boolean = false;

  // Validation messages
  validationMessages = {
    name: {
      required: 'Name is required.',
    },
    type: {
      required: 'Type is required.',
    },
    defaultAccountId: {
      required: 'Acount is required.',
    },
    campusId: {
      required: 'Campus is required.',
    },
    bankAcountId: {
      required: 'Bank Account is required.',
    },
    suspenseAccountId: {
      required: 'Suspense Account is required.',
    },
    profitAccountId: {
      required: 'Profit Account is required.',
    },
    lossAccountId: {
      required: 'Campus is required.',
    },
    cashAccountId: {
      required: 'Campus is required.',
    },
  }

  // Error keys..
  formErrors: { [key: string]: string } = {
    id: '',
    name: '',
    defaultAccountId: '',
    description: '',
    campusId: '',
    type: '',
    bankAcountId: '',
    bankAccountNumber: '',
    suspenseAccountId: '',
    profitAccountId: '',
    lossAccountId: '',
    cashAccountId: ''
  }


  defaultAccountList: BehaviorSubject<any[] | []> = new BehaviorSubject<any[] | []>([]);
  suspenseAccountList: BehaviorSubject<any[] | []> = new BehaviorSubject<any[] | []>([]);
  profitAccountList: BehaviorSubject<any[] | []> = new BehaviorSubject<any[] | []>([]);
  lossAccountList: BehaviorSubject<any[] | []> = new BehaviorSubject<any[] | []>([]);
  cashAccountList: BehaviorSubject<any[] | []> = new BehaviorSubject<any[] | []>([]);
  bankAccountList: BehaviorSubject<any[] | []> = new BehaviorSubject<any[] | []>([]);

  // Journal Type List from enum
  typeList = Object.keys(JournalType).filter(key => isNaN(Number(key)))
    .map(key => ({ value: JournalType[key as any], label: key }));

  //Injecting Dependencies
  constructor(
    private fb: FormBuilder,
    private JournalService: JournalService,
    public activatedRoute: ActivatedRoute,
    public addButtonService: AddModalButtonService,
    public chartOfAccountService: ChartOfAccountService,
    public bankAccountService: BankAccountService,
    public categoryService: CategoryService,
    public businessPartnerService: BusinessPartnerService,
    public warehouseService: WarehouseService,
    public ngxsService: NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    injector: Injector,

  ) {
    super(injector)
  }

  public currentClient: any = {}
  ngOnInit() {
    this.currentClient = AppConst.ClientConfig.config

    this.form = this.fb.group({
      id: null,
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      defaultAccountId: ['', [Validators.required]],
      suspenseAccountId: '',
      profitAccountId: '',
      lossAccountId: '',
      bankAcountId: '',
      bankAccountNumber: '',
      cashAccountId: '',
      campusId: (AppConst.ClientConfig.config.isCampus) ? ['', [Validators.required]] : [null, [Validators.nullValidator]],
    });

    this.activatedRoute.queryParams.subscribe((param: Params) => {
      const id = param.q;
      this.isJournal = param.isJournal;
      if (id && this.isJournal) {
        this.title = 'Edit Journal'
        this.getJournal(id);
      }
    })



    //Get Data from Store
    // this.ngxsService.getBusinessPartnerFromState();
    // this.ngxsService.getAccountLevel4FromState();
    // this.ngxsService.getWarehouseFromState();
    this.ngxsService.getCampusFromState()

    this.form.get('type')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.setValidation(value);
        this.changeLabel(value);
        this.hideControls(value);
      });

  }
  hideControls(type: number) {
    const showControls = type === JournalType.Cash || type === JournalType.Bank;
    this.IsShowLossAccountId = showControls;
    this.IsShowProfitAccountId = showControls;
    this.IsShowSuspenseAccountId = showControls;

    const ShowforBank = type === JournalType.Bank;
    this.IsShowBankAcountId = ShowforBank;
  }
  changeLabel(journalType: number) {
    if (journalType == JournalType.Cash) {
      this.defaultAccountLabel = "Cash Account"
    } else if (journalType == JournalType.Bank) {
      this.defaultAccountLabel = "Bank Account"
    }
    else if (journalType == JournalType.Sales) {
      this.defaultAccountLabel = "Default Income Account"
    }
    else if (journalType == JournalType.Purchase) {
      this.defaultAccountLabel = "Default Expense Account"
    }
    else if (journalType == JournalType.Miscellaneous) {
      this.defaultAccountLabel = "Default Account"
    } else {
      this.defaultAccountLabel = "Default Account"
    }
  }
  setValidation(journalType: number) {
    const controls = [
      { control: this.form.get('suspenseAccountId'), requiredTypes: [JournalType.Cash, JournalType.Bank] },
      { control: this.form.get('profitAccountId'), requiredTypes: [JournalType.Cash, JournalType.Bank] },
      { control: this.form.get('lossAccountId'), requiredTypes: [JournalType.Cash, JournalType.Bank] }
    ];

    controls.forEach(({ control, requiredTypes }) => {
      if (requiredTypes.includes(journalType)) {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity();
    });
  }

  loadAccountList($event: MatRadioButton | any) {

    let type = $event.value;
    this.loadingList(type);


  }


  loadingList(type: any) {
    if (type === JournalType.Sales) {
      this.chartOfAccountService.getIncomeAccounts()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          this.defaultAccountList.next(res.result || []);
          this.cdRef.markForCheck();
        });

    } else if (type === JournalType.Purchase) {
      this.chartOfAccountService.getExpenseAccounts()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          this.defaultAccountList.next(res.result || []);
          this.cdRef.markForCheck();
        });

    } else if (type === JournalType.Cash || type === JournalType.Bank) {

      this.chartOfAccountService.getCashBankAccounts()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          this.defaultAccountList.next(res.result || []);
          this.cdRef.markForCheck();
        });

      this.chartOfAccountService.getIncomeAccounts()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          this.profitAccountList.next(res.result || []);
          this.cdRef.markForCheck();
        });
      this.chartOfAccountService.getExpenseAccounts()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          this.lossAccountList.next(res.result || []);
          this.cdRef.markForCheck();
        });
      this.chartOfAccountService.getCurrentAssetAccounts()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          this.suspenseAccountList.next(res.result || []);
          this.cdRef.markForCheck();
        });

      if (type === JournalType.Bank) {
        this.bankAccountService.getBankAccounts()
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
            this.bankAccountList.next(res.result || []);
            this.cdRef.markForCheck();
          });


      }


    } else if (type === JournalType.Miscellaneous) {
      this.chartOfAccountService.getLevel4Accounts()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          this.defaultAccountList.next(res.result || []);
          this.cdRef.markForCheck();
        });
    }
  }

  //onChangeEvent to set debit or credit zero '0'
  onChangeEvent(_: unknown, index: number) {


  }




  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.showMessage = false;

  }






  //Get Journal Data for Edit
  private getJournal(id: number) {
    this.isLoading = true;
    this.JournalService.getJournalById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res: IApiResponse<IJournal>) => {
        if (!res) {
          return
        }
        this.JournalModel = res.result
        this.loadingList(this.JournalModel.type);
        this.editJournal(this.JournalModel);
      });
  }

  //Edit Journal
  editJournal(Journal: IJournal) {
    this.form.patchValue({
      name: Journal.name,
      type: Journal.type,
      defaultAccountId: Journal.defaultAccountId,
      suspenseAccountId: Journal.suspenseAccountId,
      profitAccountId: Journal.profitAccountId,
      lossAccountId: Journal.lossAccountId,
      bankAcountId: Journal.bankAcountId,
      bankAccountNumber: Journal.bankAccountNumber,
      cashAccountId: Journal.cashAccountId,
      campusId: (AppConst.ClientConfig.config.isCampus) ? ['', [Validators.required]] : [null, [Validators.nullValidator]],


      // campusId: Journal.campusId
    });

    // this.onCampusSelected(Journal.campusId)
    this.showMessage = true;



  }



  // Submit Form Function
  onSubmit(): void {




    if (this.form.invalid) {
      this.toastService.error("Please fill all required fields!", "Journal")
      return;
    }



    this.isLoading = true;
    this.mapFormValuesToJournalModel();
    if (this.JournalModel.id) {
      this.JournalService.updateJournal(this.JournalModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(
          (res: IApiResponse<IJournal>) => {
            this.toastService.success('Updated Successfully', 'Journal')
            this.cdRef.detectChanges();
            this.router.navigate(['/' + JOURNAL.LIST]);
          })
    } else {
      delete this.JournalModel.id;
      this.JournalService.addJournal(this.form.value)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(
          (res: IApiResponse<IJournal>) => {
            this.toastService.success('Created Successfully', 'Journal')
            this.router.navigate(['/' + JOURNAL.LIST]);
          });
    }
  }

  //Mapping Form Values To Model
  mapFormValuesToJournalModel() {
    this.JournalModel.campusId = this.form.value.campusId;
    this.JournalModel.name = this.form.value.name;
    this.JournalModel.type = this.form.value.type;
    this.JournalModel.defaultAccountId = this.form.value.defaultAccountId;
    this.JournalModel.suspenseAccountId = this.form.value.suspenseAccountId;
    this.JournalModel.profitAccountId = this.form.value.profitAccountId;
    this.JournalModel.lossAccountId = this.form.value.lossAccountId;
    this.JournalModel.bankAccountNumber = this.form.value.bankAccountNumber;
    this.JournalModel.bankAcountId = this.form.value.bankAcountId;
    this.JournalModel.cashAccountId = this.form.value.cashAccountId;
  }


  canDeactivate(): boolean | Observable<boolean> {
    return !this.form.dirty;
  }

  checkCampus() {
    this.showMessage = true;
    if (this.form.value.campusId === '') {
      this.toastService.info("Please Select Campus First!", "Journal")
    }
  }



  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
