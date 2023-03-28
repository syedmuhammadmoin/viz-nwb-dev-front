import {ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {REQUEST_REQUISITION} from '../../../../shared/AppRoutes';
import {NgxsCustomService} from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import {finalize, take} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {Permissions} from 'src/app/views/shared/AppEnum';
import {AddModalButtonService} from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import {Observable} from 'rxjs';
import {IProduct} from '../../../profiling/product/model/IProduct';
import {ProductService} from '../../../profiling/product/service/product.service';
import {IApiResponse} from 'src/app/views/shared/IApiResponse';
import {EmployeeService} from '../../../payroll/employee/service/employee.service';
import {IRequestRequisition} from '../model/IRequestRequisition';
import {IRequestRequisitionLines} from '../model/IRequestRequisitionLine';
import {RequestRequisitionService} from '../service/request-requisition.service';

@Component({
  selector: 'kt-create-request-requisition',
  templateUrl: './create-request-requisition.component.html',
  styleUrls: ['./create-request-requisition.component.scss']
})

export class CreateRequestRequisitionComponent extends AppComponentBase implements OnInit {

  public permissions = Permissions;

  //Loader
  isLoading: boolean;

  // Declaring form variable
  requestRequisitionForm: FormGroup;

  // For Table Columns
  displayedColumns = ['description', 'quantity', 'action'];

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // requestRequisitionModel
  requestRequisitionModel: IRequestRequisition = {} as IRequestRequisition;

  // For DropDown
  salesItem: IProduct[] = [];

  isRequestRequisition: any;

  // for getting employee
  employee = {} as any;

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition: boolean

  title: string = 'Create Request Requisition'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation Messages
  validationMessages = {
    employeeId: {
      required: 'Employee is required.'
    },
    requestDate: {
      required: 'Request Date is required.'
    }
  }

  formErrors = {
    employeeId: '',
    requestDate: ''
  }

  // Injecting Dependencies
  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private requestRequisitionService: RequestRequisitionService,
    public activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    public productService: ProductService,
    public addButtonService: AddModalButtonService,
    public ngxsService: NgxsCustomService,
    public injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    this.requestRequisitionForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      designation: [''],
      department: [''],
      requestDate: ['', [Validators.required]],
      campusId: [{value: null, disabled: true}],
      requestLines: this.fb.array([
        this.addRequestRequisitionLines()
      ])
    });

    //Get Data From Store
    this.ngxsService.getEmployeeFromState();
    this.ngxsService.getAccountLevel4FromState()
    this.ngxsService.getProductFromState();
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
  }

  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.table.renderRows();
  }

  //for save or submit
  isSubmit(val: number) {
    this.requestRequisitionModel.isSubmit = (val === 0) ? false : true;
  }

  // Add Requisition line
  addRequestRequisitionLineClick(): void {
    const controls = this.requestRequisitionForm.controls.requestLines as FormArray;
    controls.push(this.addRequestRequisitionLines());
    this.table.renderRows();
  }

  addRequestRequisitionLines(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
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
        console.log(this.requestRequisitionModel);
        this.editRequestRequisition(this.requestRequisitionModel)
      });
  }

  //Edit Request Requisition
  editRequestRequisition(requestRequisition: IRequestRequisition) {
    this.requestRequisitionForm.patchValue({
      employeeId: requestRequisition.employeeId,
      requestDate: requestRequisition.requestDate,
    });

    this.getEmployee(requestRequisition.employeeId)
    this.requestRequisitionForm.setControl('requestLines', this.editRequisitionLines(requestRequisition.requestLines));
  }

  //Edit Requisition Lines
  editRequisitionLines(requisitionLines: IRequestRequisitionLines[]): FormArray {
    const formArray = new FormArray([]);
    requisitionLines.forEach((line: IRequestRequisitionLines | any) => {
      formArray.push(this.fb.group({
        id: line.id,
        description: [line.description, Validators.required],
        quantity: [line.quantity, [Validators.required, Validators.min(1)]],
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
      this.toastService.error('Please fill all required fields!', 'Request Requisition')
      return;
    }

    this.mapFormValuesTorequestRequisitionModel();

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
          this.router.navigate(['/' + REQUEST_REQUISITION.ID_BASED_ROUTE('details', this.requestRequisitionModel.id)]);
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
            this.router.navigate(['/' + REQUEST_REQUISITION.ID_BASED_ROUTE('details', res.result.id)]);
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
    if (this.requestRequisitionForm.value.employeeId === null) {
      this.toastService.info('Please Select Employee!', 'Requisition')
    }
  }
}
