import {ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {AppComponentBase} from '../../../../shared/app-component-base';
import {FormsCanDeactivate} from '../../../../shared/route-guards/form-confirmation.guard';
import {Permissions} from '../../../../shared/AppEnum';
import {FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AddModalButtonService} from '../../../../shared/services/add-modal-button/add-modal-button.service';
import {CategoryService} from '../../../profiling/category/service/category.service';
import {BusinessPartnerService} from '../../../profiling/business-partner/service/businessPartner.service';
import {WarehouseService} from '../../../profiling/warehouse/services/warehouse.service';
import {NgxsCustomService} from '../../../../shared/services/ngxs-service/ngxs-custom.service';
import {finalize, take} from 'rxjs/operators';
import {IApiResponse} from '../../../../shared/IApiResponse';
import {DEPRECIATION_ADJUSTMENT, JOURNAL_ENTRY} from '../../../../shared/AppRoutes';
import {IDepreciationAdjustment, IDepreciationAdjustmentLines} from '../model/IDepreciationAdjustment';
import { DepreciationAdjustmentService } from '../service/depreciation-adjustment.service';
import {AssetService} from '../../asset/service/asset.service';

@Component({
  selector: 'kt-create-asset-adjustment',
  templateUrl: './create-depreciation-adjustment.component.html',
  styleUrls: ['./create-depreciation-adjustment.component.scss']
})
export class CreateDepreciationAdjustmentComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {
  public permissions = Permissions;

  // Loader
  isLoading: boolean;

  // Declaring form variable
  depreciationAdjustmentForm: FormGroup;

  // For Table Columns
  displayedColumns = ['fixedAssetId', 'level4Id', 'description', 'debit', 'credit', 'action']

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  dateLimit: Date = new Date()

  // JournaL Entry Model
  depreciationAdjustmentModel: IDepreciationAdjustment = {} as IDepreciationAdjustment;

  isDepreciationAdjustment: boolean;

  // variable for debit and credit sum
  debitTotal = 0;
  creditTotal = 0;

  title = 'Create Depreciation Adjustment'

  // for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  warehouseList: any = new BehaviorSubject<any>([])

  // show toast mesasge of on campus select
  showMessage = false;

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
  formErrors = {
    date: '',
    description: '',
    campusId: ''
  }

  // Injecting Dependencies
  constructor(
    private fb: FormBuilder,
    private depreciationAdjustmentService: DepreciationAdjustmentService,
    private assetService: AssetService,
    private router: Router,
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
    this.depreciationAdjustmentForm = this.fb.group({
      date: ['', [Validators.required]],
      description: ['',[Validators.required]],
      depreciationAdjustmentLines: this.fb.array([
        this.addDepreciationAdjustmentLines()
      ])
    });

    this.activatedRoute.queryParams.subscribe((param: Params) => {
      const id = param.q;
      this.isDepreciationAdjustment = param.isdepreciationAdjustment;
      if (id && this.isDepreciationAdjustment) {
        this.title = 'Edit Deprecation Adjustment'
        this.getDepreciationAdjustment(id);
      }
    })

    // Get Data from Store
    this.ngxsService.getAccountLevel4FromState();
    this.ngxsService.getAssetsFromState()
  }

  // onChangeEvent to set debit or credit zero '0'
  onChangeEvent(_:unknown, index: number) {
    const arrayControl = this.depreciationAdjustmentForm.get('depreciationAdjustmentLines') as FormArray;
    const debitControl = arrayControl.at(index).get('debit');
    const creditControl = arrayControl.at(index).get('credit');
    const debit = (debitControl.value) !== null ? debitControl.value : null;
    const credit = (creditControl.value) !== null ? creditControl.value : null;

    console.log(`credit: ${credit}, debit: ${debit}`)
    if (debit) {
      creditControl.setValue(0);
      creditControl.clearValidators();
      creditControl.updateValueAndValidity({emitEvent: true, onlySelf: true})
      creditControl.disable();
    }
    else if (credit) {
      debitControl.setValue(0);
      debitControl.clearValidators();
      debitControl.updateValueAndValidity({emitEvent: true, onlySelf: true})
      debitControl.disable();
    }
    else if (!debit || !credit) {
      creditControl.enable();
      creditControl.setValidators([Validators.required, Validators.min(1)])
      creditControl.updateValueAndValidity({emitEvent: true, onlySelf: true})

      debitControl.enable();
      debitControl.setValidators([Validators.required, Validators.min(1)])
      debitControl.updateValueAndValidity({emitEvent: true, onlySelf: true})
    }
    this.totalCalculation();
  }

  totalCalculation() {
    this.debitTotal = 0;
    this.creditTotal = 0;
    const arrayControl = this.depreciationAdjustmentForm.get('depreciationAdjustmentLines') as FormArray;
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
  addDepreciationAdjustmentLineClick(): void {
    const controls = this.depreciationAdjustmentForm.controls.depreciationAdjustmentLines as FormArray;
    controls.push(this.addDepreciationAdjustmentLines());
    this.table.renderRows();
  }

  addDepreciationAdjustmentLines(): FormGroup {
    return this.fb.group({
      fixedAssetId: ['',  Validators.required],
      level4Id: ['',  Validators.required],
      description: ['', Validators.required],
      debit: [0, [Validators.required, Validators.min(1)]],
      credit: [0, [Validators.required, Validators.min(1)]],
    });
  }

  // Remove Journal Entry Line
  removeDepreciationAdjustmentLineClick(depreciationAdjustmentLineIndex: number): void {
    const depreciationAdjustmentLineArray = this.depreciationAdjustmentForm.get('depreciationAdjustmentLines') as FormArray;
    depreciationAdjustmentLineArray.removeAt(depreciationAdjustmentLineIndex);
    depreciationAdjustmentLineArray.markAsDirty();
    depreciationAdjustmentLineArray.markAsTouched();
    this.table.renderRows();
    this.totalCalculation();
  }

  // Get Journal Entry Data for Edit
  private getDepreciationAdjustment(id: number) {
    this.isLoading = true;
    this.depreciationAdjustmentService.getById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res: IApiResponse<IDepreciationAdjustment>) => {
        if (!res) {
          return
        }
        this.depreciationAdjustmentModel = res.result
        this.editDepreciationAdjustment(this.depreciationAdjustmentModel)
      });
  }

  // Edit Journal Entry
  editDepreciationAdjustment(depreciationAdjustment: IDepreciationAdjustment) {
    this.depreciationAdjustmentForm.patchValue({
      date: depreciationAdjustment.dateOfDepreciationAdjustment,
      description: depreciationAdjustment.description,
      // campusId: depreciationAdjustment.campusId
    });

    // this.onCampusSelected(depreciationAdjustment.campusId)
    this.showMessage = true;

    this.depreciationAdjustmentForm.setControl('depreciationAdjustmentLines', this.editDepreciationAdjustmentLines(depreciationAdjustment.depreciationAdjustmentLines));
    this.totalCalculation();
  }

  // Edit Journal Entry Lines
  editDepreciationAdjustmentLines(depreciationAdjustmentLines: IDepreciationAdjustmentLines[]): FormArray {
    const formArray = new FormArray([]);
    depreciationAdjustmentLines.forEach((line: IDepreciationAdjustmentLines) => {
      formArray.push(this.fb.group({
        id: [line.id, [Validators.required]],
        description: [line.description, [Validators.required]],
        // businessPartnerId: [line.businessPartnerId, [Validators.required]],
        debit: [line.debit, [Validators.required, Validators.min(0)]],
        credit: [line.credit, [Validators.required, Validators.min(0)]],
        level4Id: [line.level4Id, [Validators.required]],
        fixedAssetId: [line.fixedAssetId, [Validators.required]],
        // warehouseId: [line.warehouseId],
      }))
    })
    return formArray
  }

  // Submit Form Function
  onSubmit(): void {
    if (this.depreciationAdjustmentForm.get('depreciationAdjustmentLines').invalid) {
      this.depreciationAdjustmentForm.get('depreciationAdjustmentLines').markAllAsTouched();
    }

    const controls = this.depreciationAdjustmentForm.controls.depreciationAdjustmentLines as FormArray;
    if (controls.length === 0) {
      this.toastService.error('Please add depreciation adjustment lines', 'Depreciation Adjustment')
      return
    }

    if (this.depreciationAdjustmentForm.invalid) {
      this.toastService.error('Please fill all required fields!', 'Depreciation Adjustment')
      return;
    }

    if (this.debitTotal !== this.creditTotal) {
      this.toastService.error('Sum of Debit and Credit is not Equal', 'Depreciation Adjustment')
      return
    }

    if (this.debitTotal === 0 && this.creditTotal === 0) {
      this.toastService.error('Sum of Debit and Credit should be greater than 0', 'Depreciation Adjustment')
      return
    }

    this.isLoading = true;
    this.mapFormValuesToDepreciationAdjustmentModel();
    if (this.depreciationAdjustmentModel.id) {
      this.depreciationAdjustmentService.update(this.depreciationAdjustmentModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(
          (res: IApiResponse<IDepreciationAdjustment>) => {
            this.toastService.success('Updated Successfully', 'Depreciation Adjustment')
            this.cdRef.detectChanges();
            this.router.navigate(['/' + DEPRECIATION_ADJUSTMENT.ID_BASED_ROUTE('details' , this.depreciationAdjustmentModel.id)]);
          })
    } else {
      delete this.depreciationAdjustmentModel.id;
      this.depreciationAdjustmentService.add(this.depreciationAdjustmentModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(
          (res: IApiResponse<IDepreciationAdjustment>) => {
            this.toastService.success('Created Successfully', 'Journal Entry')
            this.router.navigate(['/' + DEPRECIATION_ADJUSTMENT.ID_BASED_ROUTE('details' , res.result.id)]);
          });
    }
  }

  // Mapping Form Values To Model
  mapFormValuesToDepreciationAdjustmentModel() {
    this.depreciationAdjustmentModel.dateOfDepreciationAdjustment = this.transformDate(this.depreciationAdjustmentForm.value.date, 'yyyy-MM-dd');
    this.depreciationAdjustmentModel.description = this.depreciationAdjustmentForm.value.description;
    // this.depreciationAdjustmentModel.campusId = this.depreciationAdjustmentForm.value.campusId;
    this.depreciationAdjustmentModel.depreciationAdjustmentLines = this.depreciationAdjustmentForm.getRawValue().depreciationAdjustmentLines;
  }

  // for save or submit
  isSubmit(val: number) {
    this.depreciationAdjustmentModel.isSubmit = (val === 0) ? false : true;
  }

  canDeactivate(): boolean | Observable<boolean> {
    return !this.depreciationAdjustmentForm.dirty;
  }

  checkCampus() {
    this.showMessage = true;
    if(this.depreciationAdjustmentForm.value.campusId === '') {
      this.toastService.info('Please Select Campus First!', 'Depreciation Adjustment')
    }
  }

  onCampusSelected(campusId : number) {
    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

    if(this.depreciationAdjustmentForm.value.depreciationAdjustmentLines.some(line => line.warehouseId)){
      this.toastService.info('Please Reselect Store!' , 'Depreciation Adjustment')
    }

    // this.depreciationAdjustmentForm.get('depreciationAdjustmentLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
    this.cdRef.detectChanges()
  }
}
