import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, NgForm } from '@angular/forms';
import { CategoryService } from '../../../profiling/category/service/category.service';
import { IJournal } from '../model/IJournal';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { finalize, take } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { JournalService } from '../services/journal.service';
import { BusinessPartnerService } from '../../../profiling/business-partner/service/businessPartner.service';
import { WarehouseService } from '../../../profiling/warehouse/services/warehouse.service';
import { JournalType, Permissions } from 'src/app/views/shared/AppEnum';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { JOURNAL_ENTRY } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IJournalLines } from '../model/IJournalLines';
import { AppConst } from 'src/app/views/shared/AppConst';
import { ChartOfAccountService } from '../../chat-of-account/service/chart-of-account.service';
import { MatRadioButton } from '@angular/material/radio';

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

  // For Table Columns
  displayedColumns = ['accountId', 'businessPartnerId', 'description', 'debit', 'credit', 'warehouseId', 'action']

  // typeList = [
  //   {id: 0 , name: 'Sales'},
  //   {id: 1 , name: 'Purchase'},
  //   {id: 2 , name: 'Cash'},
  //   {id: 3 , name: 'Bank'},
  //   {id: 4 , name: 'Miscellaneous'}
  // ]


  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  dateLimit: Date = new Date()

  // JournaL Entry Model
  JournalModel: IJournal = {} as IJournal;

  isJournal: boolean;

  //variable for debit and credit sum
  debitTotal: number = 0;
  creditTotal: number = 0;

  title: string = 'Create Journal'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  warehouseList: any = new BehaviorSubject<any>([])

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
    DefaultAccountId: {
      required: 'Acount is required.',
    },
    campusId: {
      required: 'Campus is required.',
    },
  }

  // Error keys..
  formErrors: any = {
    date: '',
    description: '',
    campusId: ''
  }


  defaultAccountList: BehaviorSubject<any[] | []> = new BehaviorSubject<any[] | []>([]);

  typeList = Object.keys(JournalType).filter(key => isNaN(Number(key)))
    .map(key => ({ value: JournalType[key as any], label: key }));

  //Injecting Dependencies
  constructor(
    private fb: FormBuilder,
    private JournalService: JournalService,
    public activatedRoute: ActivatedRoute,
    public addButtonService: AddModalButtonService,
    public chartOfAccountService: ChartOfAccountService,
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
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      DefaultAccountId: ['', [Validators.required]],
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
    this.ngxsService.getBusinessPartnerFromState();
    this.ngxsService.getAccountLevel4FromState();
    this.ngxsService.getWarehouseFromState();
    this.ngxsService.getCampusFromState()
  }

  loadAccountList($event: MatRadioButton | any) {

    if ($event.value === JournalType.Sales) {
      this.chartOfAccountService.getIncomeAccounts().subscribe((res: any) => {
        this.defaultAccountList.next(res.result || [])
        // this.form.get('depreciationModelId').clearValidators()
        // this.form.get('depreciationModelId').updateValueAndValidity();
        this.cdRef.markForCheck();
      })

    } else if ($event.value === JournalType.Purchase) {
      this.chartOfAccountService.getExpenseAccounts().subscribe((res: any) => {
        this.defaultAccountList.next(res.result || [])
        // this.form.get('depreciationModelId').clearValidators()
        // this.form.get('depreciationModelId').updateValueAndValidity();
        this.cdRef.markForCheck();
      })

    }
    else if ($event.value === JournalType.Cash) {
      this.chartOfAccountService.getOtherAccounts().subscribe((res: any) => {
        this.defaultAccountList.next(res.result || [])
        // this.form.get('depreciationModelId').clearValidators()
        // this.form.get('depreciationModelId').updateValueAndValidity();
        this.cdRef.markForCheck();
      })

    }
    else if ($event.value === JournalType.Bank) {
      this.chartOfAccountService.getOtherAccounts().subscribe((res: any) => {
        this.defaultAccountList.next(res.result || [])
        // this.form.get('depreciationModelId').clearValidators()
        // this.form.get('depreciationModelId').updateValueAndValidity();
        this.cdRef.markForCheck();
      })

    }
    else if ($event.value === JournalType.Miscellaneous) {
      this.chartOfAccountService.getOtherAccounts().subscribe((res: any) => {
        this.defaultAccountList.next(res.result || [])
        // this.form.get('depreciationModelId').clearValidators()
        // this.form.get('depreciationModelId').updateValueAndValidity();
        this.cdRef.markForCheck();
      })

    }
  }
  //onChangeEvent to set debit or credit zero '0'
  onChangeEvent(_: unknown, index: number) {
    const arrayControl = this.form.get('JournalLines') as FormArray;
    const debitControl = arrayControl.at(index).get('debit');
    const creditControl = arrayControl.at(index).get('credit');
    const debit = (debitControl.value) !== null ? debitControl.value : null;
    const credit = (creditControl.value) !== null ? creditControl.value : null;

    if (debit) {
      creditControl.setValue(0);
      creditControl.disable();
    }
    else if (credit) {
      debitControl.setValue(0);
      debitControl.disable();
    }
    else if (!debit || !credit) {
      creditControl.enable();
      debitControl.enable();
    }
    this.totalCalculation();
  }

  totalCalculation() {
    this.debitTotal = 0;
    this.creditTotal = 0;
    const arrayControl = this.form.get('JournalLines') as FormArray;
    arrayControl.controls.forEach((_: unknown, index: number) => {
      const debit = arrayControl.at(index).get('debit').value;
      const credit = arrayControl.at(index).get('credit').value;
      this.debitTotal += Number(debit);
      this.creditTotal += Number(credit);
    });
  }


  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.showMessage = false;
    this.table.renderRows();
  }

  // Add journal Entry Line
  addJournalLineClick(): void {
    const controls = this.form.controls.JournalLines as FormArray;
    controls.push(this.addJournalLines());
    this.table.renderRows();
  }

  addJournalLines(): FormGroup {
    return this.fb.group({
      accountId: ['', Validators.required],
      businessPartnerId: [],
      description: ['', Validators.required],
      debit: [0, [Validators.required, Validators.min(0)]],
      credit: [0, [Validators.required, Validators.min(0)]],
      warehouseId: [],
    });
  }

  //Remove Journal Line
  removeJournalLineClick(JournalLineIndex: number): void {
    const JournalLineArray = this.form.get('JournalLines') as FormArray;
    JournalLineArray.removeAt(JournalLineIndex);
    JournalLineArray.markAsDirty();
    JournalLineArray.markAsTouched();
    this.table.renderRows();
    this.totalCalculation();
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
        this.editJournal(this.JournalModel)
      });
  }

  //Edit Journal
  editJournal(Journal: IJournal) {
    this.form.patchValue({

      campusId: Journal.campusId
    });

    this.onCampusSelected(Journal.campusId)
    this.showMessage = true;

   
    this.totalCalculation();
  }

  

  // Submit Form Function
  onSubmit(): void {
  

    

    if (this.form.invalid) {
      this.toastService.error("Please fill all required fields!", "Journal")
      return;
    }

    if (this.debitTotal !== this.creditTotal) {
      this.toastService.error('Sum of Debit and Credit is not Equal', 'Journal')
      return
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
            this.router.navigate(['/' + JOURNAL_ENTRY.ID_BASED_ROUTE('details', this.JournalModel.id)]);
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
            this.router.navigate(['/' + JOURNAL_ENTRY.ID_BASED_ROUTE('details', res.result.id)]);
          });
    }
  }

  //Mapping Form Values To Model
  mapFormValuesToJournalModel() {

    this.JournalModel.campusId = this.form.value.campusId;
    this.JournalModel.JournalLines = this.form.getRawValue().JournalLines;
  }

  //for save or submit
  isSubmit(val: number) {
    this.JournalModel.isSubmit = (val === 0) ? false : true;
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

  onCampusSelected(campusId: number) {
    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

    if (this.form.value.JournalLines.some(line => line.warehouseId)) {
      this.toastService.info("Please Reselect Store!", "Journal")
    }

    this.form.get('JournalLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
    this.cdRef.detectChanges()
  }
}
