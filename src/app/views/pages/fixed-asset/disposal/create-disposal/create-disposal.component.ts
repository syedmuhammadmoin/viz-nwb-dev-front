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
    assetId: {
      required: 'Account is required.',
    },
    categoryId: {
      required: 'Category is required.',
    },
    purchaseCost: {
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
    bookValue: {
      required: 'Book Value is required.',
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
    assetId:  '',
    categoryId:  '',
    purchaseCost:  '',
    salvageValue: '',
    usefulLife: '',
    accumulatedDepreciationId: '',
    bookValue: '',
    disposalDate: '',
    disposalValue: '',
    warehouseId: '',
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

    // Creating Forms
    // this.disposalForm = this.fb.group({
    //   dateOfAcquisition:['', [Validators.required]],
    //   cwipAccountId: ['', [Validators.required]],
    //   costOfAsset: ['', [Validators.required]],
    //   assetAccountId: ['', [Validators.required]],
    //   salvageValue:[0],
    //   campusId: ['', [Validators.required]],
    //   warehouseId: ['', [Validators.required]],
    //   depreciationApplicability: [false],
    //   depreciationId:[null],
    //   modelType: [0],
    //   depreciationExpenseId:[null],
    //   accumulatedDepreciationId: [null],
    //   useFullLife:[0],
    //   quantinty :[0],
    //   decLiningRate: [0],
    //   prorataBasis: [false],
    //   active: [false]
    // });
    this.disposalForm = this.fb.group({
    assetId: ['' , [Validators.required]],
    categoryId: ['' , [Validators.required]],
    purchaseCost: ['' , [Validators.required]],
    salvageValue: [0 , [Validators.required]],
    usefulLife:[0 , [Validators.required]],
    accumulatedDepreciationId: [null , [Validators.required]],
    bookValue: [0 , [Validators.required]],
    disposalDate: ['' , [Validators.required]],
    disposalValue:  [0 , [Validators.required]],
    warehouseId: ['' , [Validators.required]],
    });

    //get Accounts from Accounts State

    this.ngxsService.getDepreciationModelFromState()
    this.ngxsService.getOtherAccountsFromState();
    this.ngxsService.getAssetAccountFromState();
    this.ngxsService.getCampusFromState();
    this.ngxsService.getWarehouseFromState();

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
        // this.depApplicabilityToggle = res.result.depreciationApplicability;
      });
  }

  //Edit disposal Method
  public patchDisposal(disposal: IDisposal | any) {
    this.disposalForm.patchValue({

    assetId: disposal.assetId,
    categoryId: disposal,
    purchaseCost: disposal.categoryId,
    salvageValue: disposal.salvageValue,
    usefulLife:disposal.usefulLife,
    accumulatedDepreciationId:disposal.accumulatedDepreciationId,
    bookValue: disposal.bookValue,
    disposalDate: disposal.disposalDate,
    disposalValue:  disposal.disposalValue,
    warehouseId: disposal.warehouseId,

    });
    // this.onChangeDepApplicability({checked : disposal.depreciationApplicability})
    // this.getModelType(disposal.modelType)
    // this.onCampusSelected(disposal.campusId)
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

  // onChangeDepApplicability(e){

  //   this.depApplicabilityToggle = e.checked

  //   if(e.checked){
  //     this.disposalForm.get('useFullLife').setValidators([Validators.required , Validators.min(1) , Validators.max(2147483647) , Validators.pattern('[0-9]*$')])
  //   }
  //   if(!e.checked){
  //     this.resetFields(this.disposalForm , 'depreciationId','depreciationExpenseId', 'accumulatedDepreciationId' , 'useFullLife' , 'decLiningRate')
  //     this.disposalForm.get('prorataBasis').setValue(false);
  //     this.disposalForm.get('active').setValue(false);
  //     this.disposalForm.get('modelType').setValue(0);
  //     this.getModelType(0)
  //   }
  //   this.conditionalValidation(this.disposalForm, e.checked , ['depreciationId','depreciationExpenseId', 'accumulatedDepreciationId','useFullLife'])
  //   this.logValidationErrors(this.disposalForm, this.formErrors , this.validationMessages);
  // }

  // getModelType(e : any){

  //   if(e){
  //     this.isModelType = true;
  //   }else{
  //     this.isModelType = false;
  //   }

  //   this.conditionalValidation(this.disposalForm, e , ['decLiningRate'])
  //   this.logValidationErrors(this.disposalForm, this.formErrors , this.validationMessages) 

  // }

  //Mapping Form Value to Model
  mapFormValuesTodisposalModel() {

    this.disposalModel.assetId = this.disposalForm.value.assetId;
    this.disposalModel.categoryId = this.disposalForm.value.categoryId;
    this.disposalModel.purchaseCost = this.disposalForm.value.purchaseCost;
    this.disposalModel.salvageValue = this.disposalForm.value.salvageValue;
    this.disposalModel.usefulLife =this.disposalForm.value.useFullLife;
    this.disposalModel.accumulatedDepreciationId = this.disposalForm.value.accumulatedDepreciationId;
    this.disposalModel.bookValue = this.disposalForm.value.bookValue;
    this.disposalModel.disposalDate = this.dateHelperService.transformDate(this.disposalForm.value.disposalDate, 'yyyy-MM-dd');;
    this.disposalModel.disposalValue =  this.disposalForm.value.disposalValue;
    this.disposalModel.warehouseId = this.disposalForm.value.warehouseId;
  }



  //for save or submit
  isSubmit(val: number) {
    this.disposalModel.isSubmit = (val === 0) ? false : true;
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    //this.router.navigate(['/' + INVOICE.ID_BASED_ROUTE('details', event.data.id)]);
  }

  // getDepreciationModel(id: number) {
  //   this.depreciationService.getDepreciationById(id)
  //     .pipe(
  //       take(1),
  //       finalize(() => {
  //         this.isLoading = false;
  //         this.cdRef.detectChanges();
  //       })
  //     )
  //     .subscribe((res) => {
  //       this.disposalForm.patchValue({
  //         modelType: res.result.modelType,
  //         useFullLife: res.result.useFullLife,
  //         decLiningRate: res.result.decliningRate,
  //         depreciationExpenseId: res.result.depreciationExpenseId,
  //         accumulatedDepreciationId: res.result.accumulatedDepreciationId,
  //       })
  //       this.getModelType(res.result.modelType)
  //       this.cdRef.detectChanges()
  //     })
  // }

  // checkCampus() {
  //   this.showMessage = true;
  //   if(this.disposalForm.value.campusId === '') {
  //     this.toastService.info("Please Select Campus First!", "Disposal")
  //   }
  // }

  // onCampusSelected(campusId : number){
  //     this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res =>{
  //       this.warehouseList.next(res.result || [])
        
  //     })

  //     if((!this.disposalModel.warehouseId) && this.disposalForm.value.warehouseId) {
  //       this.toastService.info("Please Reselect Store!" , "Disposal")
  //       this.disposalForm.get('warehouseId').setValue(null)
  //     }

     
  //     this.disposalModel.warehouseId = null;
  // }


  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}








