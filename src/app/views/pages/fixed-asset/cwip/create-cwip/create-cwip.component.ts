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
import { ICwip } from '../model/ICwip';
import { CwipService } from '../service/cwip.service';
import {  CWIP } from 'src/app/views/shared/AppRoutes';
import { AppConst } from 'src/app/views/shared/AppConst';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { DepreciationMethodService } from '../../depreciation-model/service/depreciation-method.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-create-cwip',
  templateUrl: './create-cwip.component.html',
  styleUrls: ['./create-cwip.component.scss']
})
export class CreateCwipComponent extends AppComponentBase implements OnInit {

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  cwipForm: FormGroup;

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // Payroll Model
  cwipModel: ICwip = {} as ICwip;

  warehouseList: any = new BehaviorSubject<any>([])

  title: string = 'Create CWIP'

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

    dateOfAcquisition : {
      required: 'Acquisition Date is required.',
    },
    cwipAccountId : {
      required: 'Account is required.',
    },                        
    costOfAsset : {
      required: 'Cost is required.',
    },
    assetAccountId : {
      required: 'Account is required.',
    },
    campusId: {
      required: 'Campus is required.',
    },
    warehouseId: {
      required: 'Store is required.',
    },
    depreciationId : {
      required: 'Depreciation Model is required.',
    },
    modelType : {
      required: 'Model Type is required.',
    },
    depreciationExpenseId : {
      required: 'Account is required.',
    },
    accumulatedDepreciationId : {
      required: 'Account is required.',
    },
    useFullLife : {
      required: 'Life is required.',
      min : 'Minimum value is 1.',
      max : 'Value is out of range.',
      pattern : 'Please enter only Digits.'
    },
    decLiningRate : {
      required: 'Declining Rate is required.',
    }
  };

  // error keys..
  formErrors = {
    dateOfAcquisition : '',
    cwipAccountId : '',                        
    costOfAsset : '',
    assetAccountId : '',
    campusId: '',
    warehouseId: '',
    depreciationId : '',
    modelType : '',
    depreciationExpenseId : '',
    accumulatedDepreciationId : '',
    useFullLife : '',
    decLiningRate : ''
  };

  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private cwipService: CwipService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateCwipComponent>,
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
    this.cwipForm = this.fb.group({
      dateOfAcquisition:['', [Validators.required]],
      cwipAccountId: ['', [Validators.required]],
      costOfAsset: ['', [Validators.required]],
      assetAccountId: ['', [Validators.required]],
      salvageValue:[0],
      campusId: ['', [Validators.required]],
      warehouseId: ['', [Validators.required]],
      depreciationApplicability: [false],
      depreciationId:[null],
      modelType: [0],
      depreciationExpenseId:[null],
      accumulatedDepreciationId: [null],
      useFullLife:[0],
      quantinty :[0],
      decLiningRate: [0],
      prorataBasis: [false],
      active: [false]
    });

    //get Accounts from Accounts State

    this.ngxsService.getDepreciationModelFromState()
    this.ngxsService.getOtherAccountsFromState();
    this.ngxsService.getAssetAccountFromState();
    this.ngxsService.getCampusFromState();
    this.ngxsService.getWarehouseFromState();

    if (this.data?.id) {
      this.title = 'Edit Capital Work In progress'
      this.cwipModel.id = this.data.id;
      this.isLoading = true;
      this.getCwip(this.data.id);
      
    }

  }

  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.depApplicabilityToggle = false
  }

  //Get Asset data from Api
  private getCwip(id: number) {
    this.cwipService.getCwipById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.cwipModel = res.result;
        this.patchCwip(res.result);
        this.depApplicabilityToggle = res.result.depreciationApplicability;
      });
  }

  //Edit Asset Method
  public patchCwip(cwip: ICwip | any) {
    this.cwipForm.patchValue({
      dateOfAcquisition: cwip.dateOfAcquisition,
      cwipAccountId:cwip.cwipAccountId,
      costOfAsset:cwip.costOfAsset,
      assetAccountId:cwip.assetAccountId,
      salvageValue:cwip.salvageValue,
      campusId: cwip.campusId,
      warehouseId: cwip.warehouseId,
      depreciationApplicability:cwip.depreciationApplicability,
      depreciationId:cwip.depreciationId,
      modelType:cwip.modelType,
      depreciationExpenseId:cwip.depreciationExpenseId,
      accumulatedDepreciationId:cwip.accumulatedDepreciationId,
      useFullLife:cwip.useFullLife,
      quantinty:cwip.quantinty,
      decLiningRate:cwip.decLiningRate,
      prorataBasis: cwip.prorataBasis,
      active:cwip.active 
    });
    this.onChangeDepApplicability({checked : cwip.depreciationApplicability})
    this.getModelType(cwip.modelType)
    this.onCampusSelected(cwip.campusId)
  }


  //Submit Form Function
  onSubmit(): void {

    if (this.cwipForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValuesTocwipModel();

    if (this.data?.id) {
      console.log("edit")
      this.cwipService.updateCwip(this.cwipModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res: IApiResponse<ICwip>) => {
          this.toastService.success('Updated Successfully', 'Asset')
          this.onCloseDialog();
          this.cdRef.detectChanges();
          this.router.navigate(['/' + CWIP.LIST])
        })

    } else {
      delete this.cwipModel.id;

      this.cwipService.createCwip(this.cwipModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res: IApiResponse<ICwip>) => {
          this.toastService.success('Created Successfully', 'CWIP')
          this.onCloseDialog();
          this.router.navigate(['/' + CWIP.LIST])
          //this.router.navigate(['/' + PAYROLL_ITEM.LIST])
        }
        );
    }
  }

  onChangeDepApplicability(e){

    this.depApplicabilityToggle = e.checked

    if(e.checked){
      this.cwipForm.get('useFullLife').setValidators([Validators.required , Validators.min(1) , Validators.max(2147483647) , Validators.pattern('[0-9]*$')])
    }
    if(!e.checked){
      this.resetFields(this.cwipForm , 'depreciationId','depreciationExpenseId', 'accumulatedDepreciationId' , 'useFullLife' , 'decLiningRate')
      this.cwipForm.get('prorataBasis').setValue(false);
      this.cwipForm.get('active').setValue(false);
      this.cwipForm.get('modelType').setValue(0);
      this.getModelType(0)
    }
    this.conditionalValidation(this.cwipForm, e.checked , ['depreciationId','depreciationExpenseId', 'accumulatedDepreciationId','useFullLife'])
    this.logValidationErrors(this.cwipForm, this.formErrors , this.validationMessages);
  }

  getModelType(e : any){

    if(e){
      this.isModelType = true;
    }else{
      this.isModelType = false;
    }

    this.conditionalValidation(this.cwipForm, e , ['decLiningRate'])
    this.logValidationErrors(this.cwipForm, this.formErrors , this.validationMessages) 

  }

  //Mapping Form Value to Model
  mapFormValuesTocwipModel() {
    this.cwipModel.dateOfAcquisition =  this.dateHelperService.transformDate(this.cwipForm.value.dateOfAcquisition, 'yyyy-MM-dd');
    this.cwipModel.cwipAccountId = this.cwipForm.value.cwipAccountId
    this.cwipModel.costOfAsset = this.cwipForm.value.costOfAsset
    this.cwipModel.assetAccountId = this.cwipForm.value.assetAccountId,
    this.cwipModel.salvageValue = this.cwipForm.value.salvageValue,
    this.cwipModel.campusId = this.cwipForm.value.campusId,
    this.cwipModel.warehouseId = this.cwipForm.value.warehouseId,
    // this.cwipModel.warehouseId = this.cwipForm.value.warehouseId,
    this.cwipModel.depreciationApplicability = this.cwipForm.value.depreciationApplicability,
    this.cwipModel.depreciationId = this.cwipForm.value.depreciationId,
    this.cwipModel.modelType = this.cwipForm.value.modelType,
    this.cwipModel.depreciationExpenseId = this.cwipForm.value.depreciationExpenseId,
    this.cwipModel.accumulatedDepreciationId = this.cwipForm.value.accumulatedDepreciationId,
    this.cwipModel.useFullLife = this.cwipForm.value.useFullLife,
    this.cwipModel.quantinty = this.cwipForm.value.quantinty,
    this.cwipModel.decLiningRate = this.cwipForm.value.decLiningRate,
    this.cwipModel.prorataBasis =  this.cwipForm.value.prorataBasis,
    this.cwipModel.active = this.cwipForm.value.active 
  }



  //for save or submit
  isSubmit(val: number) {
    this.cwipModel.isSubmit = (val === 0) ? false : true;
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    //this.router.navigate(['/' + INVOICE.ID_BASED_ROUTE('details', event.data.id)]);
  }

  getDepreciationModel(id: number) {
    this.depreciationService.getDepreciationById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.cwipForm.patchValue({
          modelType: res.result.modelType,
          useFullLife: res.result.useFullLife,
          decLiningRate: res.result.decliningRate,
          depreciationExpenseId: res.result.depreciationExpenseId,
          accumulatedDepreciationId: res.result.accumulatedDepreciationId,
        })
        this.getModelType(res.result.modelType)
        this.cdRef.detectChanges()
      })
  }

  checkCampus() {
    this.showMessage = true;
    if(this.cwipForm.value.campusId === '') {
      this.toastService.info("Please Select Campus First!", "CWIP")
    }
  }

  onCampusSelected(campusId : number){
      this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res =>{
        this.warehouseList.next(res.result || [])
        
      })

      if((!this.cwipModel.warehouseId) && this.cwipForm.value.warehouseId) {
        this.toastService.info("Please Reselect Store!" , "CWIP")
        this.cwipForm.get('warehouseId').setValue(null)
      }

     
      this.cwipModel.warehouseId = null;
  }


  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}







