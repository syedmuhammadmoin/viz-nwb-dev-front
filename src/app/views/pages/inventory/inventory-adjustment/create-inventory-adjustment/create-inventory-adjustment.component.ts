import { INVENTORY_ADJUSTMENT } from './../../../../shared/AppRoutes';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { IInventoryAdjustment } from '../model/IInventoryAdjustment';
import { InventoryAdjustmentService } from '../service/inventory-adjustment.service';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Permissions } from 'src/app/views/shared/AppEnum';

import { finalize, take } from 'rxjs/operators';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { IProduct } from '../../../profiling/product/model/IProduct';
import { ProductService } from '../../../profiling/product/service/product.service';
import { WarehouseService } from '../../../profiling/warehouse/services/warehouse.service';
import { BusinessPartnerService } from '../../../profiling/business-partner/service/businessPartner.service';
import { RequireMatch } from 'src/app/views/shared/requireMatch';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';

@Component({
  selector: 'kt-create-inventory-adjustment',
  templateUrl: './create-inventory-adjustment.component.html',
  styleUrls: ['./create-inventory-adjustment.component.scss'],
  providers:[NgxsCustomService]
})

export class CreateInventoryAdjustmentComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {
  public permissions = Permissions;
  // For Loading
  isLoading: boolean;
  // Declaring Form variable
  inventoryAdjustmentForm: FormGroup;

  //Declaring Form Model
  inventoryAdjustmentModel: IInventoryAdjustment;

  //For Table Columns
  displayedColumns = ['itemId', 'description', 'quantity', 'price', 'locationId', 'action']

  //Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // For Item dropdown
  salesItem: IProduct[] = [];

  // for item master
  productMaster: any;

  //Validatoin messages
  validationMessages = {
    'user': {
      'required': 'User is required'
    },
    'date': {
      'required': 'Date is required'
    },
    'natureAdjustment': {
      'required': 'Nature of Adjustment is required'
    },
  }

  //Error Keys
  formErrors = {
    'user': '',
    'date': '',
    'natureAdjustment': '',
  }

  //nature adjustment values
  natures = [
    { id: 0, nature: 'Negative' },
    { id: 1, nature: 'Positive' }
  ]

  constructor(
    private fb: FormBuilder,
    private route: Router,
    public productService: ProductService,
    private cdRef: ChangeDetectorRef,
    public addButtonService: AddModalButtonService,
    public warehouseService: WarehouseService,
    public businessPartnerService: BusinessPartnerService,
    public activatedRoute: ActivatedRoute,
    public ngxsService:NgxsCustomService,
    private inventoryService: InventoryAdjustmentService,
    injector: Injector
  ) {
    super(injector)
  }

  // ng onInit
  ngOnInit(): void {
    this.inventoryAdjustmentForm = this.fb.group({
      user: ['', [Validators.required]],
      date: ['', [Validators.required]],
      natureAdjustment: ['', [Validators.required]],
      contact: [''],
      inventoryAdjustmentLines: this.fb.array([
        this.addInventoryAdjustmentLines()
      ])
    })

    this.inventoryAdjustmentModel = {
      id: null,
      employeeId: null,
      adjustmentDate: null,
      adjustmentNature: null,
      contact: null,
      inventoryAdjustmentLines: [],
    };

    // get customer from state
    this.ngxsService.getBusinessPartnerFromState();   
    // get Ware house location from state
    this.ngxsService.getWarehouseFromState();
    // get item from state
    this.ngxsService.getProductFromState();

    this.productService.getProducts().subscribe(res => this.productMaster = res.result)
  }

  //Form Reset
  reset() {
    const inventoryAdjustmentLineArray = <FormArray>this.inventoryAdjustmentForm.get('inventoryAdjustmentLines');
    inventoryAdjustmentLineArray.clear();
    this.table.renderRows();
  }


  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    const res = this.productMaster.find(x => x.id === itemId)
    console.log('new id', res.id);
    const inventoryAdjustmentLines = this.inventoryAdjustmentForm.get('inventoryAdjustmentLines') as FormArray;
    inventoryAdjustmentLines.at(index).get('price').setValue(res?.salesPrice);
    console.log('lines', inventoryAdjustmentLines);
  }

  // onChangeEvent for calculating subtotal
  // onChangeEvent(value: any, index: number, element?: HTMLElement) {    
  //   this.totalCalculation();
  // }

  // Calculations
  // totalCalculation() {

  // }


  // Add Inventory Adjustment Line
  addInventoryLineClick(): void {
    const controls = <FormArray>this.inventoryAdjustmentForm.controls['inventoryAdjustmentLines'];
    controls.push(this.addInventoryAdjustmentLines());
    this.table.renderRows();
  }

  addInventoryAdjustmentLines(): FormGroup {
    return this.fb.group({
      itemId: [0, [RequireMatch]],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      locationId: ['', [RequireMatch, Validators.required]],
    });
  }

  //Remove Inventory Adjustment Line
  removeInventoryAdjustmentLineClick(inventoryAdjustmentLineIndex: number): void {
    const InventoryAdjustmentLineArray = <FormArray>this.inventoryAdjustmentForm.get('inventoryAdjustmentLines');
    InventoryAdjustmentLineArray.removeAt(inventoryAdjustmentLineIndex);
    InventoryAdjustmentLineArray.markAsDirty();
    InventoryAdjustmentLineArray.markAsTouched();
    this.table.renderRows();
  }

  //Submit Form Function
  onSubmit(): void {
    if (this.inventoryAdjustmentForm.get('inventoryAdjustmentLines').invalid) {
      this.inventoryAdjustmentForm.get('inventoryAdjustmentLines').markAllAsTouched();
    }
    const controls = <FormArray>this.inventoryAdjustmentForm.controls['inventoryAdjustmentLines'];
    if (controls.length == 0) {
      this.toastService.error('Please add inventory adjustment lines', 'Error')
      return;
    }
    if (this.inventoryAdjustmentForm.invalid) {
      return;
    }

    // mapping form values to model
    this.mapFormValuesToInventoryAdjustmentModel();
    if (this.inventoryAdjustmentModel.id) {
      console.log(this.inventoryAdjustmentModel)
      this.isLoading = true;
      this.inventoryService.updateInventoryAdjustment(this.inventoryAdjustmentModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((res) => {
          this.toastService.success('' + res.message, 'Updated Successfully')
          this.cdRef.detectChanges();
          this.route.navigate(['/'+INVENTORY_ADJUSTMENT.ID_BASED_ROUTE('details',this.inventoryAdjustmentModel.id)]);
        },
          (err) => {
            this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Updating');
            this.isLoading = false;
            this.cdRef.detectChanges()
          })
    } else {
      delete this.inventoryAdjustmentModel.id;
      this.isLoading = true;
      this.inventoryService.createInventoryAdjustment(this.inventoryAdjustmentModel)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(
          (res) => {

            this.toastService.success('Created Successfully', 'Inventory Adjustment')
            this.route.navigate(['/'+INVENTORY_ADJUSTMENT.LIST]);
          },
          (err: any) => {
            this.isLoading = false;
            this.cdRef.detectChanges();
            this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Creating')
            console.log(err)
          }
        );
    }

  }

  //Mapping value to model
  mapFormValuesToInventoryAdjustmentModel() {
    this.inventoryAdjustmentModel.employeeId = this.inventoryAdjustmentForm.value.user;
    this.inventoryAdjustmentModel.adjustmentDate = this.transformDate(this.inventoryAdjustmentForm.value.date, 'yyyy-MM-dd');
    this.inventoryAdjustmentModel.adjustmentNature = (this.inventoryAdjustmentForm.value.natureAdjustment === 0) ? 0 : 1;
    this.inventoryAdjustmentModel.contact = this.inventoryAdjustmentForm.value?.contact;
    this.inventoryAdjustmentModel.inventoryAdjustmentLines = this.inventoryAdjustmentForm.value.inventoryAdjustmentLines;
  };


  // open business partner dialog
  openBusinessPartnerDialog() {
    if (this.permission.isGranted(this.permissions.BUSINESSPARTNER_CREATE)) {
      this.addButtonService.openBuinessPartnerDialog();
    }
  };
  // open product dialog
  openProductDialog() {
    if (this.permission.isGranted(this.permissions.PRODUCT_CREATE)) {
      this.addButtonService.openProductDialog();
    }
  };
  // open warehouse Location dialog
  openLocationDialog() {
    if (this.permission.isGranted(this.permissions.LOCATION_CREATE)) {
      this.addButtonService.openLocationDialog();
    }
  };

  canDeactivate(): boolean | Observable<boolean> {
    return !this.inventoryAdjustmentForm.dirty;
  }
}



