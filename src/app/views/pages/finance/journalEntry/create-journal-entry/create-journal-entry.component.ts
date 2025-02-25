import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, NgForm } from '@angular/forms';
import { CategoryService } from '../../../profiling/category/service/category.service';
import { IJournalEntry } from '../model/IJournalEntry';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { finalize, take } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { JournalEntryService } from '../services/journal-entry.service';
import { BusinessPartnerService } from '../../../profiling/business-partner/service/businessPartner.service';
import { WarehouseService } from '../../../profiling/warehouse/services/warehouse.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { JOURNAL_ENTRY } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IJournalEntryLines } from '../model/IJournalEntryLines';
import { AppConst } from 'src/app/views/shared/AppConst';

@Component({
  selector: 'kt-create-journal-entry',
  templateUrl: './create-journal-entry.component.html',
  styleUrls: ['./create-journal-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateJournalEntryComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {
  public permissions = Permissions;

  //Loader
  isLoading: boolean;

  // Declaring form variable
  journalEntryForm: FormGroup;

  // For Table Columns
  displayedColumns = ['accountId', 'businessPartnerId', 'description', 'debit', 'credit', 'warehouseId', 'action']

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  dateLimit: Date = new Date()

  // JournaL Entry Model
  journalEntryModel: IJournalEntry = {} as IJournalEntry;

  isJournalEntry: boolean;

  //variable for debit and credit sum
  debitTotal: number = 0;
  creditTotal: number = 0;

  title: string = 'Create Journal Entry'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  warehouseList: any = new BehaviorSubject<any>([])

  //show toast mesasge of on campus select
  showMessage: boolean = false;

  // Validation messages
  validationMessages = {
    date: {
      required: 'JV Date is required.',
    },
    description: {
      required: 'Description is required.',
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



  //Injecting Dependencies
  constructor(
    private fb: FormBuilder,
    private journalEntryService: JournalEntryService,
    public activatedRoute: ActivatedRoute,
    public addButtonService: AddModalButtonService,
    public categoryService: CategoryService,
    public businessPartnerService: BusinessPartnerService,
    public warehouseService: WarehouseService,
    public ngxsService:NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    injector: Injector,

  ) {
    super(injector)
  }

  public currentClient : any ={}
  ngOnInit() {
    this.currentClient = AppConst.ClientConfig.config

    this.journalEntryForm = this.fb.group({
      date: ['', [Validators.required]],
      description: ['',[Validators.required]],
      campusId: (AppConst.ClientConfig.config.isCampus) ?  ['',  [Validators.required]] : [null,[Validators.nullValidator]],
      journalEntryLines: this.fb.array([
        this.addJournalEntryLines()
      ])
    });

    this.activatedRoute.queryParams.subscribe((param: Params) => {
      const id = param.q;
      this.isJournalEntry = param.isJournalEntry;
      if (id && this.isJournalEntry) {
        this.title = 'Edit Journal Entry'
        this.getJournalEntry(id);
      }
    })

    //Get Data from Store
    this.ngxsService.getBusinessPartnerFromState();
    this.ngxsService.getAccountLevel4FromState();
    this.ngxsService.getWarehouseFromState();
    this.ngxsService.getCampusFromState()
  }

  //onChangeEvent to set debit or credit zero '0'
  onChangeEvent(_:unknown, index: number) {
    const arrayControl = this.journalEntryForm.get('journalEntryLines') as FormArray;
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
    const arrayControl = this.journalEntryForm.get('journalEntryLines') as FormArray;
    arrayControl.controls.forEach((_:unknown, index: number) => {
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
  addJournalEntryLineClick(): void {
    const controls = this.journalEntryForm.controls.journalEntryLines as FormArray;
    controls.push(this.addJournalEntryLines());
    this.table.renderRows();
  }

  addJournalEntryLines(): FormGroup {
    return this.fb.group({
      accountId: ['',  Validators.required],
      businessPartnerId: [],
      description: ['', Validators.required],
      debit: [0, [Validators.required, Validators.min(0)]],
      credit: [0, [Validators.required, Validators.min(0)]],
      warehouseId: [],
    });
  }

  //Remove Journal Entry Line
  removeJournalEntryLineClick(journalEntryLineIndex: number): void {
    const journalEntryLineArray = this.journalEntryForm.get('journalEntryLines') as FormArray;
    journalEntryLineArray.removeAt(journalEntryLineIndex);
    journalEntryLineArray.markAsDirty();
    journalEntryLineArray.markAsTouched();
    this.table.renderRows();
    this.totalCalculation();
  }

  //Get Journal Entry Data for Edit
  private getJournalEntry(id: number) {
    this.isLoading = true;
    this.journalEntryService.getJournalEntryById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<IJournalEntry>) => {
      if (!res) {
        return
      }
      this.journalEntryModel = res.result
      this.editJournalEntry(this.journalEntryModel)
    });
  }

  //Edit Journal Entry
  editJournalEntry(journalEntry: IJournalEntry) {
    this.journalEntryForm.patchValue({
      date: journalEntry.date,
      description: journalEntry.description,
      campusId: journalEntry.campusId
    });

    this.onCampusSelected(journalEntry.campusId)
    this.showMessage = true;

    this.journalEntryForm.setControl('journalEntryLines', this.editJournalEntryLines(journalEntry.journalEntryLines));
    this.totalCalculation();
  }

  //Edit Journal Entry Lines
  editJournalEntryLines(journalEntryLines: IJournalEntryLines[]): FormArray {
    const formArray = new FormArray([]);
    journalEntryLines.forEach((line: IJournalEntryLines) => {
      formArray.push(this.fb.group({
        id: [line.id, [Validators.required]],
        description: [line.description, [Validators.required]],
        businessPartnerId: [line.businessPartnerId],
        debit: [line.debit, [Validators.required, Validators.min(0)]],
        credit: [line.credit, [Validators.required, Validators.min(0)]],
        accountId: [line.accountId, [Validators.required]],
        warehouseId: [line.warehouseId],
      }))
    })
    return formArray
  }

  // Submit Form Function
  onSubmit(): void {
    if (this.journalEntryForm.get('journalEntryLines').invalid) {
      this.journalEntryForm.get('journalEntryLines').markAllAsTouched();
    }

    const controls = this.journalEntryForm.controls.journalEntryLines as FormArray;
    if (controls.length === 0) {
      this.toastService.error('Please add journal entry lines', 'Journal Entry')
      return
    }

    if (this.journalEntryForm.invalid) {
      this.toastService.error("Please fill all required fields!", "Journal Entry")
      return;
    }

    if (this.debitTotal !== this.creditTotal) {
      this.toastService.error('Sum of Debit and Credit is not Equal', 'Journal Entry')
      return
    }

    this.isLoading = true;
    this.mapFormValuesToJournalEntryModel();
    if (this.journalEntryModel.id) {
      this.journalEntryService.updateJournalEntry(this.journalEntryModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(
          (res: IApiResponse<IJournalEntry>) => {
          this.toastService.success('Updated Successfully', 'Journal Entry')
          this.cdRef.detectChanges();
          this.router.navigate(['/' + JOURNAL_ENTRY.ID_BASED_ROUTE('details' , this.journalEntryModel.id)]);
        })
    } else {
      delete this.journalEntryModel.id;
      this.journalEntryService.addJournalEntry(this.journalEntryModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(
          (res: IApiResponse<IJournalEntry>) => {
            this.toastService.success('Created Successfully', 'Journal Entry')
            this.router.navigate(['/' + JOURNAL_ENTRY.ID_BASED_ROUTE('details' , res.result.id)]);
          });
    }
  }

  //Mapping Form Values To Model
  mapFormValuesToJournalEntryModel() {
    this.journalEntryModel.date = this.transformDate(this.journalEntryForm.value.date, 'yyyy-MM-dd');
    this.journalEntryModel.description = this.journalEntryForm.value.description;
    this.journalEntryModel.campusId = this.journalEntryForm.value.campusId;
    this.journalEntryModel.journalEntryLines = this.journalEntryForm.getRawValue().journalEntryLines;
  }

  //for save or submit
  isSubmit(val: number) {
    this.journalEntryModel.isSubmit = (val === 0) ? false : true;
  }

  canDeactivate(): boolean | Observable<boolean> {
    return !this.journalEntryForm.dirty;
  }

  checkCampus() {
    this.showMessage = true;
    if(this.journalEntryForm.value.campusId === '') {
      this.toastService.info("Please Select Campus First!", "Journal Entry")
    }
  }

  onCampusSelected(campusId : number) {
    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

    if(this.journalEntryForm.value.journalEntryLines.some(line => line.warehouseId)){
      this.toastService.info("Please Reselect Store!" , "Journal Entry")
    }

     this.journalEntryForm.get('journalEntryLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
     this.cdRef.detectChanges()
  }
}
