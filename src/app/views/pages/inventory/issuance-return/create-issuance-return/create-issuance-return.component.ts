import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { IProduct} from '../../../profiling/product/model/IProduct';
import { ActivatedRoute, Router} from '@angular/router';
import { finalize, take} from 'rxjs/operators';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { BehaviorSubject, Observable } from 'rxjs';
import { ISSUANCE_RETURN } from 'src/app/views/shared/AppRoutes';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IssuanceService } from '../../issuance/service/issuance.service';
import { IIssuance } from '../../issuance/model/IIssuance';
import { IIssuanceReturn } from '../model/IissuanceReturn';
import { IssuanceReturnService } from '../service/issuance-return.service';
import { IIssuanceReturnLines } from '../model/IIssuanceReturnLines';
import { EmployeeService } from '../../../payroll/employee/service/employee.service';

@Component({
  selector: 'kt-create-issuance-return',
  templateUrl: './create-issuance-return.component.html',
  styleUrls: ['./create-issuance-return.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateIssuanceReturnComponent extends AppComponentBase implements OnInit {

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  issuanceReturnForm: FormGroup;

  // For Table Columns
  displayedColumns = ['itemId', 'description', 'quantity', 'warehouseId', 'action']

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // Issuance Return Model
  issuanceReturnModel: IIssuanceReturn | any;

  title: string = 'Create Issuance Return'

   //for resetting form
   @ViewChild('formDirective') private formDirective: NgForm;

   warehouseList: any = new BehaviorSubject<any>([])


   //show toast mesasge of on campus select
  showMessage: boolean = false;

  // param to get Issuance master
  isIssuance: any;
  issuanceMaster: any;

  hideDeleteButton: boolean = false;

  //For getting employee
  employee = {} as any;

  // for Edit
  isIssuanceReturn: any;

  // For Calculation
  grandTotal = 0 ;
  totalBeforeTax = 0 ;
  totalTax = 0;

  // For DropDown
  salesItem: IProduct[] = [];


  // validation messages
  validationMessages = {
    employeeId: {
      required: 'Employee is required.'
    },
    issuanceReturnDate: {
      required: 'Date is required.'
    },
    campusId: {
      required: 'Campus is required.'
    },
    contact: {
      pattern: '(Insert only number).',
      minlength: 'Minimun 10 digits.',
      maxlength: 'Maximum 15 digits.'
    }
  }

  // Error Keys
  formErrors = {
    employeeId: '',
    issuanceReturnDate: '',
    contact: '',
    campusId: ''
  }

  constructor(
    private fb: FormBuilder,
    private issuanceReturnService: IssuanceReturnService,
    private issuanceService: IssuanceService,
    public ngxsService: NgxsCustomService,
    private router: Router,
    private employeeService: EmployeeService,
    public activatedRoute: ActivatedRoute,
    public cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.issuanceReturnForm = this.fb.group({
      employeeId: [{value: '', disabled: true}, [Validators.required]],
      designation: [''],
      department: [''],
      issuanceReturnDate: ['', [Validators.required]],
      contact: ['', [Validators.minLength(10), Validators.maxLength(15), Validators.pattern("^[0-9]*$")]],
      campusId: [{value: '', disabled: true}, [Validators.required]],
      issuanceReturnLines: this.fb.array([
        this.addIssuanceReturnLines()
      ])
    });

    this.issuanceReturnModel = {
      id: null,
      employeeId: null,
      issuanceReturnDate: null,
      contact: null,
      issuanceId: null,
      purchaseOrderId: null,
      campusId: null,
      issuanceReturnLines: []
    }

    this.ngxsService.products$.subscribe(res => this.salesItem = res);

    // get Vendor from state
    this.ngxsService.getEmployeeFromState();
    // get Accounts of level 4 from state
    this.ngxsService.getAccountLevel4FromState()
    // get Ware house location from state
    this.ngxsService.getWarehouseFromState();
    // get item from state
    this.ngxsService.getProductFromState();

    this.ngxsService.getCampusFromState();

    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isIssuanceReturn = param.isIssuanceReturn;
      this.isIssuance = param.isIssuance;
      if (id && this.isIssuanceReturn) {
        this.title = 'Edit Issuance Return'
        this.getIssuanceReturn(id);
      }
      else if (id && this.isIssuance) {
        this.title = 'Create Issuance Return'
        this.getIssuance(id);
      }
    })
  }

  // Form Reset
  reset() {
    // const issuanceReturnLineArray = this.issuanceReturnForm.get('issuanceReturnLines') as FormArray;
    // issuanceReturnLineArray.clear();
    this.formDirective.resetForm();
    this.showMessage = false;
    this.table.renderRows();
  }

  // OnItemSelected
  onItemSelected(itemId: number, index: number) {
    // const arrayControl = this.issuanceReturnForm.get('issuanceReturnLines') as FormArray;
    // if (itemId) {
    //   const cost = this.salesItem.find(i => i.id === itemId).purchasePrice
    //   const salesTax = this.salesItem.find(i => i.id === itemId).salesTax
    //   const account = this.salesItem.find(i => i.id === itemId).costAccountId
    //   // set values for price & tax
    //   arrayControl.at(index).get('cost').setValue(cost);
    //   arrayControl.at(index).get('tax').setValue(salesTax);
    //   arrayControl.at(index).get('accountId').setValue(account);
    //   // Calculating subtotal
    //   const quantity = arrayControl.at(index).get('quantity').value;
    //   const subTotal = (cost * quantity) + ((cost * quantity) * (salesTax / 100))
    //   arrayControl.at(index).get('subTotal').setValue(subTotal);
    // }

    // console.log(arrayControl)
  }

  // For Calculating subtotal and Quantity to Ton and vice versa Conversion
  onChangeEvent(value: any, index: number , element?: HTMLElement) {
    // const arrayControl = this.issuanceReturnForm.get('issuanceReturnLines') as FormArray;
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
    // const arrayControl = this.issuanceReturnForm.get('issuanceReturnLines') as FormArray;
    // arrayControl.controls.forEach((element, index) => {
    //   const cost = arrayControl.at(index).get('cost').value;
    //   const tax = arrayControl.at(index).get('tax').value;
    //   const quantity = arrayControl.at(index).get('quantity').value;
    //   this.totalTax += ((cost * quantity) * tax) / 100
    //   this.totalBeforeTax += cost * quantity;
    //   this.grandTotal += Number(arrayControl.at(index).get('subTotal').value);
    // });
  }

  //for save or submit
  isSubmit(val: number) {
    this.issuanceReturnModel.isSubmit = (val === 0) ? false : true;
  }


  // Add Issuance Return Line
  addIssuanceReturnLineClick(): void {
    const controls = this.issuanceReturnForm.controls.issuanceReturnLines as FormArray;
    controls.push(this.addIssuanceReturnLines());
    this.table.renderRows();
  }

  addIssuanceReturnLines(): FormGroup {
    return this.fb.group({
      itemId: ['', [Validators.required]],
      description: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      warehouseId: ['', [Validators.required]],
    });
  }

  // Remove Issuance Return Line
  removeIssuanceReturnLineClick(issuanceReturnLineIndex: number): void {
    const issuanceReturnLineArray = this.issuanceReturnForm.get('issuanceReturnLines') as FormArray;

    if(issuanceReturnLineArray.length < 2 || issuanceReturnLineArray.length == 2) {
      this.hideDeleteButton = true;
    }

    if(issuanceReturnLineArray.length !== 1) {
      issuanceReturnLineArray.removeAt(issuanceReturnLineIndex);
      issuanceReturnLineArray.markAsDirty();
      issuanceReturnLineArray.markAsTouched();
      this.table.renderRows();
    }
  }

  //Get Issuance Master Data
  private getIssuance(id: number) {
    this.isLoading = true;
    this.issuanceService.getIssuanceById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      if (!res) return
      this.issuanceMaster = res.result
      this.patchIssuanceReturn(this.issuanceMaster);
    });
  }

  // Get Issuance Return Data for Edit
  private getIssuanceReturn(id: any) {
    this.isLoading = true;
    this.issuanceReturnService.getIssuanceReturnById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      if (!res) return
      this.issuanceReturnModel = res.result
      this.patchIssuanceReturn(this.issuanceReturnModel)
    });
  }

  //Patch Issuance Return Form Issuance Return Or Issuance Master Data
  patchIssuanceReturn(data: IIssuanceReturn | IIssuance | any) {
    this.issuanceReturnForm.patchValue({
      employeeId: data.employeeId,
      issuanceReturnDate: data.issuanceReturnDate ?? data.issuanceDate,
      campusId : data.campusId,
      contact: data.contact
    });

    this.onCampusSelected(data.campusId)
    this.showMessage = true;

    this.getEmployee(data.employeeId)

    this.issuanceReturnForm.setControl('issuanceReturnLines', this.patchIssuanceReturnLines(data.issuanceReturnLines ?? data.issuanceLines));

    // if(this.isIssuance) {
    //   data.issuanceLines.map((line, index) => {
    //     this.onItemSelected(line.itemId , index)
    //   })
    // }
    
    this.totalCalculation();
  }

  //Patch Issuance Return Lines From Issuance Return Or Issuance Data
  patchIssuanceReturnLines(Lines: IIssuanceReturnLines[]): FormArray {
    const formArray = new FormArray([]);
    Lines.forEach((line: IIssuanceReturnLines | any , index: number) => {
    if(line.pendingQuantity !== 0) {
      formArray.push(this.fb.group({
      itemId: [line.itemId, [Validators.required]],
      description: [line.description, Validators.required],
      quantity: [(line.pendingQuantity) ? line.pendingQuantity : line.quantity, [Validators.required, Validators.min(1), Validators.max(line.pendingQuantity)]],
      warehouseId: [line.warehouseId, [Validators.required]]
    }))
    }
    })
    return formArray
  }

  // Submit Issuance Return Form
  onSubmit(): void {
    if (this.issuanceReturnForm.get('issuanceReturnLines').invalid) {
      this.issuanceReturnForm.get('issuanceReturnLines').markAllAsTouched();
    }
    const controls = this.issuanceReturnForm.controls.issuanceReturnLines as FormArray;
    if (controls.length == 0) {
      this.toastService.error('Please add Issuance Return lines', 'Error')
      return;
    }

    if (this.issuanceReturnForm.invalid) {
      //this.toastService.error("Please fill all required fields!", "Issuance Return")
        return;
    }

    this.mapFormValuesToIssuanceReturnModel();

    const isDuplicateLines = this.issuanceReturnModel.issuanceReturnLines.some((a, index) => this.issuanceReturnModel.issuanceReturnLines.some((b, i) => (i !== index && (a.itemId === b.itemId && a.warehouseId === b.warehouseId))))

    if(isDuplicateLines) {
      this.toastService.error("Please Remove Duplicate Line!", "Issuance Return")
      return;
    }

    this.isLoading = true;
    console.log(this.issuanceReturnModel)
    if (this.issuanceReturnModel.id && this.isIssuanceReturn) {
      this.issuanceReturnService.updateIssuanceReturn(this.issuanceReturnModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res) => {
            this.toastService.success('Updated Successfully', 'Goods Received Note')
            this.cdRef.detectChanges();
            this.router.navigate(['/'+ ISSUANCE_RETURN.ID_BASED_ROUTE('details', this.issuanceReturnModel.id)]);
          })
    } else if (this.isIssuance) {
      delete this.issuanceReturnModel.id;
      this.issuanceReturnService.createIssuanceReturn(this.issuanceReturnModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(
          (res) => {
             this.toastService.success('Created Successfully', 'Issuance Return')
            this.router.navigate(['/'+ ISSUANCE_RETURN.ID_BASED_ROUTE('details', res.result.id)]);
          });
    }
  }

  // Mapping value to model
  mapFormValuesToIssuanceReturnModel() {
    this.issuanceReturnModel.employeeId = this.issuanceReturnModel?.employeeId ?? this.issuanceMaster?.employeeId;
    this.issuanceReturnModel.issuanceReturnDate = this.transformDate(this.issuanceReturnForm.value.issuanceReturnDate, 'yyyy-MM-dd');
    this.issuanceReturnModel.contact = this.issuanceReturnForm.value.contact;
    this.issuanceReturnModel.campusId = this.issuanceReturnModel?.campusId ?? this.issuanceMaster?.campusId;
    this.issuanceReturnModel.issuanceId = this.issuanceMaster?.id ?? this.issuanceReturnModel?.issuanceId;
    this.issuanceReturnModel.issuanceReturnLines = this.issuanceReturnForm.value.issuanceReturnLines;
  }

  canDeactivate(): boolean | Observable<boolean> {
    return !this.issuanceReturnForm.dirty;
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
    this.issuanceReturnForm.patchValue({
      designation: employee.designationName,
      department: employee.departmentName
    })
  }

  checkCampus() {
    this.showMessage = true;
    if(this.issuanceReturnForm.value.campusId === '') {
      this.toastService.info("Please Select Campus First!", "Issuance Return")
    }
  }

  onCampusSelected(campusId : number) {
    this.ngxsService.warehouseService.getWarehouseByCampusId(campusId).subscribe(res => {
      this.warehouseList.next(res.result || [])
    })

    if(this.issuanceReturnForm.value.issuanceReturnLines.some(line => line.warehouseId)){
      this.toastService.info("Please Reselect Store!" , "Issuance Return")
    }

     this.issuanceReturnForm.get('issuanceReturnLines')['controls'].map((line: any) => line.controls.warehouseId.setValue(null))
    //  if(this.showMessage) {
    //   this.toastService.info("Please Reselect Store!" , "Issuance Return")
    //  }
     this.cdRef.detectChanges()
  }
}















