import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { REQUEST_REQUISITION, REQUISITION } from '../../../../shared/AppRoutes';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { finalize, take } from 'rxjs/operators';
import { ActivatedRoute, Router} from '@angular/router';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { Observable } from 'rxjs';
import { IProduct } from '../../../profiling/product/model/IProduct';
import { ProductService } from '../../../profiling/product/service/product.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { EmployeeService } from '../../../payroll/employee/service/employee.service';
import { IRequestRequisition } from '../model/IRequestRequisition';
import { IRequestRequisitionLines } from '../model/IRequestRequisitionLine';
import { RequestRequisitionService } from '../service/request-requisition.service';

@Component({
  selector: 'kt-create-request-requisition',
  templateUrl: './create-request-requisition.component.html',
  styleUrls: ['./create-request-requisition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateRequestRequisitionComponent extends AppComponentBase implements OnInit {

  public permissions = Permissions;
  
  // For Loading
  isLoading: boolean;

  // Declaring form variable
  requestRequisitionForm: FormGroup;

  // For Table Columns
  displayedColumns = ['description', 'quantity', 'action'];

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // requestRequisitionModel
  requestRequisitionModel: IRequestRequisition;

  // For DropDown
  salesItem: IProduct[] = [];

  isRequestRequisition: any;

  // For Calculation
  // grandTotal = 0 ;
  // totalBeforeTax = 0 ;
  // totalTax = 0;

  // for getting employee
  employee = {} as any;

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition : boolean

  title: string = 'Create Request Requisition'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  //warehouseList: any = new BehaviorSubject<any>([])

  //show toast mesasge of on campus select
  //showMessage: boolean = false;


  // Validation Messages
  validationMessages = {
    employeeId: {
      required: 'Employee is required.'
    },
    requestDate: {
      required: 'Request Date is required.'
    },
    // campusId: {
    //   required: 'Campus is required.'
    // },
  }

  formErrors = {
    employeeId: '',
    requestDate: '',
    //campusId: ''
  }

  // Injecting Dependencies
  constructor( private fb: FormBuilder,
               private router: Router,
               private cdRef: ChangeDetectorRef,
               private requestRequisitionService: RequestRequisitionService,
               public activatedRoute: ActivatedRoute,
               private employeeService: EmployeeService,
               public productService: ProductService,
               public addButtonService: AddModalButtonService,
               public ngxsService: NgxsCustomService,
               public injector : Injector
             ) {
                super(injector);
               }

  ngOnInit() {

    this.requestRequisitionForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      designation: [''],
      department: [''],
      requestDate: ['', [Validators.required]],
      campusId: [{value: null , disabled: true}],
      requestLines: this.fb.array([
        this.addRequestRequisitionLines()
      ])
    });

    this.requestRequisitionModel = {
      id: null,
      employeeId: null,
      requestDate: '',
      campusId : null,
      requestLines: []
    }

     // get Vendor from state
     //this.ngxsService.getBusinessPartnerFromState();
     this.ngxsService.getEmployeeFromState();
     // get Accounts of level 4 from state
     this.ngxsService.getAccountLevel4FromState()
     // get item from state
     this.ngxsService.getProductFromState();
     // get Campus from state
     this.ngxsService.getCampusFromState();

     //get id by using route
    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isRequestRequisition = param.isRequestRequisition;
      if (id && this.isRequestRequisition) {
        this.title = 'Edit Request Requisition'
        this.getRequisition(id);
      }
    })

    this.productService.getProductsDropdown().subscribe(res => this.salesItem = res.result)

    //handling dueDate logic
    // this.requestRequisitionForm.get('PODate').valueChanges.subscribe((value) => {
    //   this.minDate = new Date(value);
    //   this.dateCondition = this.requestRequisitionForm.get('dueDate').value < this.requestRequisitionForm.get('PODate').value
    // })
  }

  // Form Reset
  reset() {
    // const requisitionLineArray = this.requestRequisitionForm.get('requisitionLines') as FormArray;
    // requisitionLineArray.clear();
    this.formDirective.resetForm();
    //this.showMessage = false;
    this.table.renderRows();
  }

  //for save or submit
  isSubmit(val: number) {
    this.requestRequisitionModel.isSubmit = (val === 0) ? false : true;
  }


  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    // const arrayControl = this.requestRequisitionForm.get('requisitionLines') as FormArray;
    // if (itemId) {
    //   const cost = this.salesItem.find(i => i.id === itemId).purchasePrice
    //   const salesTax = this.salesItem.find(i => i.id === itemId).salesTax
    //   // set values for price & tax
    //   arrayControl.at(index).get('cost').setValue(cost);
    //   arrayControl.at(index).get('tax').setValue(salesTax);
    //   // Calculating subtotal
    //   const quantity = arrayControl.at(index).get('quantity').value;
    //   const subTotal = (cost * quantity) + ((cost * quantity) * (salesTax / 100))
    //   arrayControl.at(index).get('subTotal').setValue(subTotal);
    // }
  }

  // For Calculating subtotal and Quantity to Ton and vice versa Conversion
  onChangeEvent(value: any, index: number , element?: HTMLElement) {
    // const arrayControl = this.requestRequisitionForm.get('requisitionLines') as FormArray;
    // const cost = (arrayControl.at(index).get('cost').value) !== null ? arrayControl.at(index).get('cost').value : null;
    // const salesTax = (arrayControl.at(index).get('tax').value) !== null ? arrayControl.at(index).get('tax').value : null;
    // const quantity = (arrayControl.at(index).get('quantity').value) !== null ? arrayControl.at(index).get('quantity').value : null;

    // // calculating subTotal
    // const subTotal = (cost * quantity) + ((cost * quantity) * (salesTax / 100))
    // arrayControl.at(index).get('subTotal').setValue(subTotal);
    // this.totalCalculation();
  }

  // Calculations
  // Calculate Total Before Tax ,Total Tax , grandTotal
  totalCalculation() {
    // this.totalTax = 0;
    // this.totalBeforeTax = 0;
    // this.grandTotal = 0;
    // const arrayControl = this.requestRequisitionForm.get('requisitionLines') as FormArray;
    // arrayControl.controls.forEach((element, index) => {
    //   const cost = arrayControl.at(index).get('cost').value;
    //   const tax = arrayControl.at(index).get('tax').value;
    //   const quantity = arrayControl.at(index).get('quantity').value;
    //   this.totalTax += ((cost * quantity) * tax) / 100
    //   this.totalBeforeTax += cost * quantity;
    //   this.grandTotal += Number(arrayControl.at(index).get('subTotal').value);
    // });
  }

  // Add Requisition line
  addRequestRequisitionLineClick(): void {
    const controls = this.requestRequisitionForm.controls.requestLines as FormArray;
    controls.push(this.addRequestRequisitionLines());
    this.table.renderRows();
  }

  addRequestRequisitionLines(): FormGroup {
    return this.fb.group({
      itemDescription: ['', Validators.required],
      itemQuantity: ['', [Validators.required, Validators.min(1)]],
    });
  }

  // Remove Request Requisition line
  removeRequestRequisitionLineClick(requestLineIndex: number): void {
    const requestLineArray = this.requestRequisitionForm.get('requestLines') as FormArray;
    requestLineArray.removeAt(requestLineIndex);
    requestLineArray.markAsDirty();
    requestLineArray.markAsTouched();
    this.table.renderRows();
  }

  //Get Requisition Data for Edit
  private getRequisition(id: number) {
    this.isLoading = true;
   this.requestRequisitionService.getRequestRequisitionById(id)
   .pipe(
    take(1),
     finalize(() => {
      this.isLoading = false;
      this.cdRef.detectChanges();
     })
   )
   .subscribe((res: IApiResponse<IRequestRequisition>) => {
      if (!res) {
        return
      }
      this.requestRequisitionModel = res.result
      this.editRequestRequisition(this.requestRequisitionModel)
    });
  }

  //Edit Request Requisition
  editRequestRequisition(requestRequisition : IRequestRequisition) {
    this.requestRequisitionForm.patchValue({
      employeeId: requestRequisition.employeeId,
      requestDate: requestRequisition.requestDate,
      //campusId: requisition.campusId
    });

    //this.onCampusSelected(requisition.campusId)
    //this.showMessage = true;
    this.getEmployee(requestRequisition.employeeId)
    this.requestRequisitionForm.setControl('requestLines', this.editRequisitionLines(requestRequisition.requestLines));
    this.totalCalculation();
  }

  //Edit Requisition Lines
  editRequisitionLines(requisitionLines: IRequestRequisitionLines[]): FormArray {
    const formArray = new FormArray([]);
    requisitionLines.forEach((line : IRequestRequisitionLines | any) => {
      formArray.push(this.fb.group({
        id: line.id,
        itemDescription: [line.itemDescription, Validators.required],
        itemQuantity: [line.itemQuantity, [Validators.required, Validators.min(1)]],
      }))
    })
    return formArray
  }

  // Submit Form Function
  onSubmit(): void {
      if (this.requestRequisitionForm.get('requestLines').invalid) {
          this.requestRequisitionForm.get('requestLines').markAllAsTouched();
      }
      const controls = <FormArray>this.requestRequisitionForm.controls['requestLines'];
      if (controls.length == 0) {
        this.toastService.error('Please add Request Requisition lines', 'Error')
        return;
      }
    
      if (this.requestRequisitionForm.invalid) {
        this.toastService.error("Please fill all required fields!", "Request Requisition")
          return;
      }
  
      this.mapFormValuesTorequestRequisitionModel();
  
      // const isDuplicateLines = this.requestRequisitionModel.requestLines.some((a, index) => this.requestRequisitionModel.requestLines.some((b, i) => (i !== index && (a.itemId === b.itemId))))
  
      // if(isDuplicateLines) {
      //   this.toastService.error("Please Remove Duplicate Items!", "Requisition")
      //   return;
      // }

      this.isLoading = true;
      console.log(this.requestRequisitionModel)
    if (this.requestRequisitionModel.id) {
        this.requestRequisitionService.updateRequestRequisition(this.requestRequisitionModel)
        .pipe(
          take(1),
           finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
           })
         )
          .subscribe((res) => {
            this.toastService.success('Updated Successfully', 'Request Requisition')
            this.cdRef.detectChanges();
            this.router.navigate(['/' + REQUEST_REQUISITION.ID_BASED_ROUTE('details',this.requestRequisitionModel.id ) ]);
          })
      } else {
        delete this.requestRequisitionModel.id;
        this.requestRequisitionService.createRequestRequisition(this.requestRequisitionModel)
        .pipe(
          take(1),
           finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
           })
         )
          .subscribe(
            (res) => {
              this.toastService.success('Created Successfully', 'Request Requisition')
              this.router.navigate(['/' + REQUEST_REQUISITION.ID_BASED_ROUTE('details',res.result.id ) ]);
            });
      }
  }

  // Mapping value to model
  mapFormValuesTorequestRequisitionModel() {
    this.requestRequisitionModel.employeeId = this.requestRequisitionForm.value.employeeId;
    this.requestRequisitionModel.requestDate = this.transformDate(this.requestRequisitionForm.value.requestDate, 'yyyy-MM-dd');
    this.requestRequisitionModel.campusId = this.requestRequisitionForm.getRawValue().campusId;
    this.requestRequisitionModel.requestLines = this.requestRequisitionForm.value.requestLines;
  };

   // open business partner dialog
   openBusinessPartnerDialog() {
    if (this.permission.isGranted(this.permissions.BUSINESSPARTNER_CREATE)) {
      this.addButtonService.openBusinessPartnerDialog();
    }
  }

  // getting employee data by id
  getEmployee(id: number) {
    this.employeeService.getEmployeeById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      this.employee = res.result
      this.checkSelected(this.employee)
      this.cdRef.detectChanges()
    })
  }

  checkSelected(employee) {
    this.requestRequisitionForm.patchValue({
      designation: employee.designationName,
      department: employee.departmentName,
      campusId: employee.campusId
    })
  }

  canDeactivate(): boolean | Observable<boolean> {
    return !this.requestRequisitionForm.dirty;
  }

  checkEmployee() {
    if(this.requestRequisitionForm.value.employeeId === null) {
      this.toastService.info("Please Select Employee!", "Requisition")
    }
  }

  // onCampusSelected(campusId : number) {
  //   this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
  //     this.warehouseList.next(res.result || [])
  //   })

  //    this.requestRequisitionForm.get('requisitionLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
  //    if(this.showMessage) {
  //     this.toastService.info("Please Reselect Store!" , "Requisition")
  //    }
  //    this.cdRef.detectChanges()
  // }
}

