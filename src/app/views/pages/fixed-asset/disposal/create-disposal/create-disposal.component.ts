import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Injector, Inject, Optional, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { FirstDataRenderedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDisposal } from '../model/IDisposal';
import { DisposalService } from '../service/disposal.service';
import {  DISPOSAL } from 'src/app/views/shared/AppRoutes';
import { AppConst } from 'src/app/views/shared/AppConst';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { DepreciationMethodService } from '../../depreciation-model/service/depreciation-method.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-create-disposal',
  templateUrl: './create-disposal.component.html',
  styleUrls: ['./create-disposal.component.scss']
})
export class CreateDisposalComponent extends AppComponentBase implements OnInit {

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  disposalForm: FormGroup;

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // Payroll Model
  disposalModel: IDisposal = {} as IDisposal;

  warehouseList: any = new BehaviorSubject<any>([])

  title: string = 'Create Disposal'

  isActiveChecked = true;

  depApplicabilityToggle = false;

  // switch
  userStatus = 'Active'

  valueTitle: string = 'Value'

  isModelType =  false;

   //show toast mesasge of on campus select
   showMessage: boolean = false;

  //show Buttons
  showButtons: boolean = true;

  //depreciation method
  method = AppConst.depreciationMethod;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {
    fixedAssetId: {
      required: 'Account is required.',
    },
    productId: {
      required: 'Product is required.',
    },
    cost: {
      required: 'Cost is required.',
    },
    salvageValue: {
      required: 'Salvage Value is required.',
    },
    usefulLife: {
      required: 'Usefull Life is required.',
      min : 'Minimum value is 1.',
      max : 'Value is out of range.',
      pattern : 'Please enter only Digits.'
    },
    accumulatedDepreciationId: {
      required: 'Account is required.',
    },
    disposalDate: {
      required: 'Disposal Date is required.',
    },
    disposalValue: {
      required: 'Disposal value is required.',
    },
    warehouseId: {
      required: 'Store is required.',
    },
  };

  // error keys..
  formErrors = {
    fixedAssetId: '',
    productId: '',
    cost: '',
    salvageValue: '',
    usefulLife: '',
    accumulatedDepreciationId: '',
    disposalDate: '',
    disposalValue: '',
    warehouseId: ''
  };

  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private disposalService: DisposalService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateDisposalComponent>,
    public dialog: MatDialog,
    public addButtonService: AddModalButtonService,
    private depreciationService: DepreciationMethodService,
    public ngxsService: NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    this.disposalForm = this.fb.group({

    fixedAssetId: ['' , [Validators.required]],
    productId: ['' , [Validators.required]],
    cost: ['' , [Validators.required]],
    salvageValue: ['' , [Validators.required]],
    usefulLife: ['' , [Validators.required]],
    accumulatedDepreciationId:['' , [Validators.required]],
    disposalDate:['' , [Validators.required]],
    disposalValue: ['' , [Validators.required]],
    warehouseId: ['' , [Validators.required]]

    });

    //get Accounts from Accounts State

    this.ngxsService.getDepreciationModelFromState()
    this.ngxsService.getOtherAccountsFromState();
    this.ngxsService.getAssetAccountFromState();
    this.ngxsService.getCampusFromState();
    this.ngxsService.getDisposaldropdownFromState();

    if (this.data?.id) {
      this.title = 'Edit Disposal'
      this.disposalModel.id = this.data.id;
      this.isLoading = true;
      this.getDisposal(this.data.id);
      
    }

  }

  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.depApplicabilityToggle = false
  }

  //Get Disposal data from Api
  private getDisposal(id: number) {
    this.disposalService.getDisposalById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.disposalModel = res.result;
        this.patchDisposal(res.result);
      });
  }

  //Edit disposal Method
  public patchDisposal(disposal: IDisposal | any) {
    this.disposalForm.patchValue({

    fixedAssetId: disposal.fixedAssetId,
    productId: disposal.productId,
    cost: disposal.cost,
    salvageValue: disposal.salvageValue,
    usefulLife: disposal.usefulLife,
    accumulatedDepreciationId: disposal.accumulatedDepreciationId,
    disposalDate: disposal.disposalDate,
    disposalValue: disposal.disposalValue,
    warehouseId: disposal.warehouseId,

    });
  }


  //Submit Form Function
  onSubmit(): void {

    if (this.disposalForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValuesTodisposalModel();

    if (this.data?.id) {
      console.log("edit")
      this.disposalService.updateDisposal(this.disposalModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res: IApiResponse<IDisposal>) => {
          this.toastService.success('Updated Successfully', 'Disposal')
          this.onCloseDialog();
          this.cdRef.detectChanges();
          this.router.navigate(['/' + DISPOSAL.LIST])
        })

    } else {
      delete this.disposalModel.id;

      this.disposalService.createDisposal(this.disposalModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res: IApiResponse<IDisposal>) => {
          this.toastService.success('Created Successfully', 'Disposal')
          this.onCloseDialog();
          this.router.navigate(['/' + DISPOSAL.LIST])
        }
        );
    }
  }


  //Mapping Form Value to Model
  mapFormValuesTodisposalModel() {

    this.disposalModel.fixedAssetId = this.disposalForm.value.fixedAssetId,
    this.disposalModel.productId = this.disposalForm.value.productId,
    this.disposalModel.cost = this.disposalForm.value.cost,
    this.disposalModel.salvageValue = this.disposalForm.value.salvageValue,
    this.disposalModel.usefulLife = this.disposalForm.value.usefulLife,
    this.disposalModel.accumulatedDepreciationId = this.disposalForm.value.accumulatedDepreciationId,
    this.disposalModel.disposalDate = this.dateHelperService.transformDate(this.disposalForm.value.disposalDate, 'yyyy-MM-dd'),
    this.disposalModel.disposalValue = this.disposalForm.value.disposalValue,
    this.disposalModel.warehouseId = this.disposalForm.value.warehouseId
  }



  //for save or submit
  isSubmit(val: number) {
    this.disposalModel.isSubmit = (val === 0) ? false : true;
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}








