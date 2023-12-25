import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, NgForm } from '@angular/forms';
import { CategoryService } from '../../../profiling/category/service/category.service';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { finalize, take } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BusinessPartnerService } from '../../../profiling/business-partner/service/businessPartner.service';
import { WarehouseService } from '../../../profiling/warehouse/services/warehouse.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { JOURNAL_ENTRY, PETTY_CASH } from 'src/app/views/shared/AppRoutes';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPettyCashEntry } from '../model/IPettyCashEntry';
import { PettyCashService } from '../service/petty-cash.service';
import { IPettyCashEntryLines } from '../model/IPettyCashEntryLines';


@Component({
  selector: 'kt-create-petty-cash',
  templateUrl: './create-petty-cash.component.html',
  styleUrls: ['./create-petty-cash.component.scss']
})
export class CreatePettyCashComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {
  public permissions = Permissions;

  //Loader
  isLoading: boolean;

  // Declaring form variable
  pettyCashForm: FormGroup;

  // For Table Columns
  displayedColumns = ['accountId', 'date' ,'businessPartnerId', 'description', 'debit', 'credit', 'action']

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  dateLimit: Date = new Date()

  // Petty Cash Entry Model
  pettyCashModel: IPettyCashEntry = {} as IPettyCashEntry; 

  isPettyCash: boolean; 

  //variable for debit and credit sum
  debitTotal: number = 0;
  creditTotal: number = 0;

  title: string = 'Create Petty Cash'

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
    campusId: {
      required: 'Campus is required.',
    },
    accountId: {
      required: ' COA is required',
    }

  }

  // Error keys..
  formErrors = {
    date: '',   
    campusId: '',
    accountId: '',
  }

  //Injecting Dependencies
  constructor(
    private fb: FormBuilder,
    private pettyCashService: PettyCashService, 
    public activatedRoute: ActivatedRoute,
    public addButtonService: AddModalButtonService,
    public categoryService: CategoryService,
    public businessPartnerService: BusinessPartnerService,
    public warehouseService: WarehouseService,
    public ngxsService:NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
  }


  ngOnInit() {
    this.pettyCashForm = this.fb.group({
      date: ['', [Validators.required]],
      accountId: ['',[Validators.required]],
      campusId: ['',[Validators.required]],
      description: [''],
      openingBalance:[''],
      closingBalance:[''],
      pettycashLines: this.fb.array([ 
        this.addPettyCashEntryLines()
      ])
    });

    this.activatedRoute.queryParams.subscribe((param: Params) => {
      const id = param.q;
      this.isPettyCash = param.isPettyCash;
      if (id && this.isPettyCash) {
        this.title = 'Edit Petty Cash'
        this.getPettyCashEntry(id);
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
    const arrayControl = this.pettyCashForm.get('pettycashLines') as FormArray;
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
    const arrayControl = this.pettyCashForm.get('pettycashLines') as FormArray;
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

  // Add petty cash Entry Line
  addPettyCashEntryLineClick(): void {
    const controls = this.pettyCashForm.controls.pettycashLines as FormArray;
    controls.push(this.addPettyCashEntryLines());
    this.table.renderRows();
  }

  addPettyCashEntryLines(): FormGroup { 
    return this.fb.group({
      accountId: ['',  Validators.required],
      businessPartnerId: [],
      description: ['', Validators.required],
      debit: [0, [Validators.required, Validators.min(0)]],
      credit: [0, [Validators.required, Validators.min(0)]],
      date:['',[Validators.required]],
    });
  }
  
  //Remove Petty Cash Entry Line
  removePettyCashEntryLineClick(pettyEntryLineIndex: number): void {
    const pettycashEntryLineArray = this.pettyCashForm.get('pettycashLines') as FormArray;
    pettycashEntryLineArray.removeAt(pettyEntryLineIndex);
    pettycashEntryLineArray.markAsDirty();
    pettycashEntryLineArray.markAsTouched();
    this.table.renderRows();
    this.totalCalculation();
  }

  //Get Petty Cash Entry Data for Edit  
  private getPettyCashEntry(id: number) {
    this.isLoading = true;
    this.pettyCashService.getPettyCashEntryById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res: IApiResponse<IPettyCashEntry>) => {
      if (!res) {
        return
      }
      this.pettyCashModel = res.result
      this.editPettyCashEntry(this.pettyCashModel)
    });
  }

  //Edit Petty Cash Entry 
  editPettyCashEntry(pettyEntry: IPettyCashEntry) {
    this.pettyCashForm.patchValue({
      date: pettyEntry.date,
      description: pettyEntry.description,
      campusId: pettyEntry.campusId,
      openingBalance: pettyEntry.openingBalance,
      closingBalance: pettyEntry.closingBalance,
      accountId: pettyEntry.accountId
      
    });

    this.onCampusSelected(pettyEntry.campusId)
    this.showMessage = true;

    this.pettyCashForm.setControl('pettycashLines', this.editPettyCashEntryLines(pettyEntry.pettyCashLines));
    this.totalCalculation();
  }

  //Edit Petty Cash Entry Lines
  editPettyCashEntryLines(pettycashLines: IPettyCashEntryLines[]): FormArray {
    const formArray = new FormArray([]);
    pettycashLines.forEach((line: IPettyCashEntryLines) => {
      formArray.push(this.fb.group({
        id: [line.id, [Validators.required]],
        date:[line.date,[Validators.required]],
        description: [line.description, [Validators.required]],
        businessPartnerId: [line.businessPartnerId],
        debit: [line.debit, [Validators.required, Validators.min(0)]],
        credit: [line.credit, [Validators.required, Validators.min(0)]],
        accountId: [line.accountId, [Validators.required]],
        
      }))
    })
    return formArray
  }

  // Submit Form Function
  onSubmit(): void {
    if (this.pettyCashForm.get('pettycashLines').invalid) {
      this.pettyCashForm.get('pettycashLines').markAllAsTouched();
    }

    const controls = this.pettyCashForm.controls.pettycashLines as FormArray;
    if (controls.length === 0) {
      this.toastService.error('Please add petty cash entry lines', 'Petty Cash Entry')
      return
    }

    if (this.pettyCashForm.invalid) {
      this.toastService.error("Please fill all required fields!", "Petty Cash Entry")
      return;
    }

    if (this.debitTotal !== this.creditTotal) {
      this.toastService.error('Sum of Debit and Credit is not Equal', 'Petty Cash Entry')
      return
    }

    this.isLoading = true;
    this.mapFormValuesToPettyCashEntryModel();
    if (this.pettyCashModel.id) {
      this.pettyCashService.updatePettyCashEntry(this.pettyCashModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(
          (res: IApiResponse<IPettyCashEntry>) => {
          this.toastService.success('Updated Successfully', 'Petty Cash Entry')
          this.cdRef.detectChanges();
          this.router.navigate(['/' + PETTY_CASH.ID_BASED_ROUTE('details' , this.pettyCashModel.id)]);
        })
    } else {
      delete this.pettyCashModel.id;
      this.pettyCashService.addPettyCashEntry(this.pettyCashModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(
          (res: IApiResponse<IPettyCashEntry>) => {
            this.toastService.success('Created Successfully', 'Petty Cash Entry')
            this.router.navigate(['/' + PETTY_CASH.ID_BASED_ROUTE('details' , res.result.id)]);
          });
    }
  }

  //Mapping Form Values To Model 
  mapFormValuesToPettyCashEntryModel() {
    this.pettyCashModel.date = this.transformDate(this.pettyCashForm.value.date, 'yyyy-MM-dd');
    this.pettyCashModel.description = this.pettyCashForm.value.description;
    this.pettyCashModel.campusId = this.pettyCashForm.value.campusId;
    this.pettyCashModel.openingBalance = this.pettyCashForm.value.openingBalance;
    this.pettyCashModel.closingBalance = this.pettyCashForm.value.closingBalance;
    this.pettyCashModel.accountId = this.pettyCashForm.value.accountId;
    this.pettyCashModel.pettyCashLines = this.pettyCashForm.getRawValue().pettycashLines;
  }

  //for save or submit
  isSubmit(val: number) {
    this.pettyCashModel.isSubmit = (val === 0) ? false : true;
  }

  canDeactivate(): boolean | Observable<boolean> {
    return !this.pettyCashForm.dirty;
  }

  checkCampus() {
    this.showMessage = true;
    if(this.pettyCashForm.value.campusId === '') {
      this.toastService.info("Please Select Campus First!", "Petty Cash Entry")
    }
  }

  onCampusSelected(campusId : number) {
    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

    if(this.pettyCashForm.value.pettycashLines.some(line => line.warehouseId)){
      this.toastService.info("Please Reselect Store!" , "Petty Cash Entry")
    }

     this.pettyCashForm.get('pettycashLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
     this.cdRef.detectChanges()
  }
}
