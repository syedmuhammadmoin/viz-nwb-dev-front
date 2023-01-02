import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { PayrollItemType, Permissions } from 'src/app/views/shared/AppEnum';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { PayrollItemService } from '../service/payroll-item.service'
import { IPayrollItem } from '../model/IPayrollItem'
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, RowDoubleClickedEvent} from 'ag-grid-community';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssignEmployeeComponent } from '../assign-employee/assign-employee.component';
import { isEmpty } from 'lodash';
import { ActionButtonComponent } from 'src/app/views/shared/components/action-button/action-button.component';
import { PAYROLL_ITEM } from 'src/app/views/shared/AppRoutes';


@Component({
  selector: 'kt-create-payroll-item',
  templateUrl: './create-payroll-item.component.html',
  styleUrls: ['./create-payroll-item.component.scss'],
})

export class CreatePayrollItemComponent extends AppComponentBase implements OnInit {

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  payrollItemForm: FormGroup;

  // for item type
  payrollItemTypes = PayrollItemType;

  //disable percentage
  disablePercentage: boolean

  //selected Employees to assign
  selectedEmployees: any[] = []

  payrollTypes: any

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // Payroll Model
  payrollItemModel: IPayrollItem;

  title: string = 'Create Payroll Item'

  isActiveChecked = true;
  // switch
  userStatus = 'Active'

  valueTitle: string = 'Value'

   //show Buttons
   showButtons: boolean = true; 

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // Validation messages..
  validationMessages = {
    itemCode: {
      required: 'Item Code is required.',
    },
    name: {
      required: 'Item Name is required.',
    },
    payrollType: {
      required: 'Payroll Type is required.',
    },
    payrollItemType: {
      required: 'Item Type is required.',
    },
    value: {
      required: 'Value is required.',
      min: 'Please insert correct value.',
      max: 'Percentage % range (0 - 100).'
    },
    accountId: {
      required: 'Account is required.',
    },
    // remarks: {
    //   required: 'Remarks is required.',
    // }
  };

  // error keys..
  formErrors = {
    itemCode: '',
    name: '',
    payrollType: '',
    payrollItemType: '',
    value: '',
    accountId: '',
  //  remarks: '',
  };

  //payrollItemList: IPayrollItem[];
  defaultColDef: ColDef;
  frameworkComponents: {[p: string]: unknown};
  gridOptions: GridOptions;
  components: { loadingCellRenderer (params: any ) : unknown };
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  overlayNoRowsTemplate = '<span class="ag-noData">No Employees Selected !</span>';

  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private payrollItemService: PayrollItemService,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<AssignEmployeeComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public addButtonService: AddModalButtonService,
    public ngxsService:NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    injector: Injector
  ) {
    super(injector);
    this.gridOptions = <GridOptions>(
      {
        context: { componentParent: this }
      }
    );
  }

  ngOnInit() {

    // Creating Forms
    this.payrollItemForm = this.fb.group({
      itemCode: ['', [Validators.required]],
      name: ['', [Validators.required]],
      payrollType: ['', [Validators.required]],
      payrollItemType: [1, [Validators.required]],
      value: [0, [Validators.required , Validators.min(0)]],
      accountId: ['', [Validators.required]],
      isActive: [true],
      remarks: [''],
      employeeIds: [[]]
    });

    this.payrollItemModel = {
      id: null,
      itemCode: '',
      name: '',
      payrollType: null,
      payrollItemType: null,
      value: null,
      accountId: null,
      isActive: false,
      remarks: null,
      employeeIds: []
      
    }

    //get Accounts from Accounts State
    //this.ngxsService.getAccountLevel4FromState();
    this.ngxsService.getOtherAccountsFromState();
    
    this.activatedRoute.params.subscribe((param) => {
      console.log(param)
      const id = param.id;
     
      if (id) {
        this.isLoading = true;
        this.showButtons = (this.permission.isGranted(this.permissions.PAYROLL_ITEM_EDIT)) ? true : false;
        this.title = 'Edit Payroll Item'
        this.getPayrollItem(id);
      }
    });

    this.payrollTypes = [
      {id: 0 , value: 'Basic Pay'},
      {id: 1 , value: 'Increment'},
      {id: 2 , value: 'Deduction'},
      {id: 3 , value: 'Allowances'},
      {id: 4 , value: 'Assignment Allowance'},
      {id: 5 , value: 'Tax Deduction'}
    ]

    this.gridOptions = {
      rowHeight: 30,
      headerHeight: 35,
      context: "click to select Employee",
    };

    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,  
      buttonRenderer: ActionButtonComponent
    };

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      sortable: true, 
      filter: true, 
      filterParams: {
        suppressAndOrCondition: true
      }
    }

    this.components = {
      loadingCellRenderer: function (params: any) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
        }
      },
    };

     if (!this.selectedEmployees) { 
        this.gridApi.showNoRowsOverlay() 
     } else {
        this.gridApi?.hideOverlay();
     }

     //update FornControl 'Value' Validator on checkbox changed
     this.payrollItemForm.get('payrollItemType').valueChanges.subscribe((value: number) => {
        this.updateValueValidators(value);
      })

      console.log("showbuttons : ",this.showButtons)
  }

  updateValueValidators(value: number) {
    if(value === 0) {
      this.valueTitle = 'Value (%) '
      this.payrollItemForm.get('value').setValidators([Validators.required, Validators.min(0) , Validators.max(100)])
      this.payrollItemForm.get('value').updateValueAndValidity();
    }
    else if (value === 1) {
      this.valueTitle = 'Value'
      this.payrollItemForm.get('value').setValidators([Validators.required, Validators.min(0)])
      this.payrollItemForm.get('value').updateValueAndValidity();
    }
    this.logValidationErrors(this.payrollItemForm, this.formErrors , this.validationMessages)
  }

  columnDefs = [
    { 
      headerName: 'Name', 
      field: 'name', 
      tooltipField: 'name',
      // headerCheckboxSelection: true,
      // headerCheckboxSelectionFilteredOnly: true,
      // checkboxSelection: true,
      cellRenderer: "loadingCellRenderer",
     },
     { 
      headerName: 'Father Name', 
      field: 'fatherName',
      tooltipField: 'name', 
     },
     { 
      headerName: 'Cnic', 
      field: 'cnic',
      tooltipField: 'name', 
     },
     { 
      headerName: 'Designation', 
      field: 'designationName',
      tooltipField: 'name', 
     },
     { 
      headerName: 'Department', 
      field: 'departmentName',
      tooltipField: 'name',  
     },
    //  { 
    //   headerName: 'BPS', 
    //   field: 'basicPay',
    //   tooltipField: 'name',  
    //  },
     { 
      headerName: 'Faculty', 
      field: 'faculty',
      tooltipField: 'name', 
     },
     { 
      headerName: 'Shift', 
      field: 'dutyShift', 
     },
     {
       headerName: 'Action', 
       cellRenderer: 'buttonRenderer',
       suppressMenu: true,
       sortable: false,
       cellRendererParams: {
        onClick: this.onDelete.bind(this),
        label: 'Delete'
      }
    }
  ];


  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.selectedEmployees = [];
    this.payrollItemForm.get('payrollItemType').setValue(1)
    this.payrollItemForm.get('isActive').setValue(true);
    this.onToggle({checked: true})
    // const invoiceLineArray = this.invoiceForm.get('invoiceLines') as FormArray;
    // invoiceLineArray.clear();
    // this.table.renderRows();
  }

  // // OnItemSelected
  // onItemSelected(itemId: number, index: number) {
  //   let arrayControl = this.invoiceForm.get('invoiceLines') as FormArray;
  //   if (itemId) {
  //     let price = this.salesItem.find(i => i.id === itemId).salesPrice
  //     let tax = this.salesItem.find(i => i.id === itemId).salesTax
  //     // set values for price & tax
  //     arrayControl.at(index).get('price').setValue(price);
  //     arrayControl.at(index).get('tax').setValue(tax);
  //     // Calculating subtotal
  //     let quantity = arrayControl.at(index).get('quantity').value;
  //     let subTotal = (price * quantity) + ((price * quantity) * (tax / 100))
  //     arrayControl.at(index).get('subTotal').setValue(subTotal);
  //   }
  // }

  // // onChangeEvent for calculating subtotal
  // onChangeEvent(value: unknown, index: number, element?: HTMLElement) {

  //   const arrayControl = this.invoiceForm.get('invoiceLines') as FormArray;
  //   const price = (arrayControl.at(index).get('price').value) !== null ? arrayControl.at(index).get('price').value : null;
  //   const tax = (arrayControl.at(index).get('tax').value) !== null ? arrayControl.at(index).get('tax').value : null;
  //   const quantity = (arrayControl.at(index).get('quantity').value) !== null ? arrayControl.at(index).get('quantity').value : null;

  //   //calculating subTotal
  //   const subTotal = (price * quantity) + ((price * quantity) * (tax / 100))
  //   arrayControl.at(index).get('subTotal').setValue(subTotal);
  //   this.totalCalculation();
  // }




  // get payroll item data from Api
  private getPayrollItem(id: number) {
    this.payrollItemService.getPayrollItemById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      this.payrollItemModel = res.result;
      this.patchPayrollItem(res.result);
    });
  }

  // edit payroll item method
  public patchPayrollItem(payrollItem: IPayrollItem | any) {
    this.payrollItemForm.patchValue({
      itemCode: payrollItem.itemCode,
      name: payrollItem.name,
      payrollItemType: payrollItem.payrollItemType,
      payrollType: payrollItem.payrollType,
      accountId: payrollItem.accountId,
      value: payrollItem.value,
      remarks: payrollItem.remarks,
      isActive: payrollItem.isActive,
    });
    this.selectedEmployees = payrollItem.employees
    this.onToggle({checked: payrollItem.isActive})
    this.onPayrollTypeChange()
    if(!this.showButtons) this.payrollItemForm.disable();
    // //Clearing Amount Validator Initially
    // this.payrollItemForm.get('amount').setErrors(null)
    // this.payrollItemForm.updateValueAndValidity();
  }

 
  

  

  

  

  //Submit Form Function
  onSubmit(): void {
   
    if (this.payrollItemForm.invalid) {
      this.toastService.error("Please fill all required fields!", "Payroll Item")
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToPayrollItemModel();
    console.log(this.payrollItemModel)
    if (this.payrollItemModel.id) {
      this.payrollItemService.updatePayrollItem(this.payrollItemModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<IPayrollItem>) => {
          this.toastService.success('Updated Successfully', 'Payroll Item')
          this.cdRef.detectChanges();
          this.router.navigate(['/' + PAYROLL_ITEM.LIST])
        })

    } else {
      delete this.payrollItemModel.id;
      this.payrollItemService.createPayrollItem(this.payrollItemModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe((res: IApiResponse<IPayrollItem>) => {
            this.toastService.success('Created Successfully', 'Payroll Item')
            this.router.navigate(['/' + PAYROLL_ITEM.LIST])
          }
        );
    }
  }

  onPayrollTypeChange() {
    if (this.payrollItemForm.value.payrollType === 0 || this.payrollItemForm.value.payrollType === 1) {
      this.payrollItemForm.get('payrollItemType').setValue(1);
      this.disablePercentage = true;
    } else {
      this.disablePercentage = false;
    }
  }

  //Mapping value to model
  mapFormValuesToPayrollItemModel() {
    this.payrollItemModel.itemCode = this.payrollItemForm.value.itemCode;
    this.payrollItemModel.name = this.payrollItemForm.value.name;
    this.payrollItemModel.payrollItemType = this.payrollItemForm.value.payrollItemType;
    this.payrollItemModel.value = +(this.payrollItemForm.value.value); //using '+' to convert string  to Number
    this.payrollItemModel.isActive = this.payrollItemForm.value.isActive;
    this.payrollItemModel.accountId = this.payrollItemForm.value.accountId;
    this.payrollItemModel.payrollType = this.payrollItemForm.value.payrollType;
    this.payrollItemModel.remarks = this.payrollItemForm.value.remarks;

    //empty employeeIds array for new record to avoid duplication
    
    this.payrollItemModel.employeeIds = []
    this.selectedEmployees?.map((employee) => {
      this.payrollItemModel.employeeIds.push(employee.id)
    })
  }

  onToggle(event) {
    if (event.checked) {
      this.userStatus = 'Active'
    } else {
      this.userStatus = 'Inactive'
    }
  }

  //for save or submit
  // isSubmit(val: number) {
  //   this.payrollItemModel.isSubmit = (val === 0) ? false : true;
  // }


  

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    //this.router.navigate(['/' + INVOICE.ID_BASED_ROUTE('details', event.data.id)]);
  }

  assignEmployee() {
    this.openDialog()
  }

// open modal funtion
  openDialog(id?: number): void {
    const dialogRef = this.dialog.open(AssignEmployeeComponent, {
      width: '1000px',
      data: id
    });
    // Recalling getEmployees function on dialog close
    dialogRef.afterClosed().subscribe((res) => {
      if(isEmpty(this.selectedEmployees)) {
        this.selectedEmployees = res;
      }
      else if(!isEmpty(res)) {
      //   res.forEach((employee) => {
      //  const findDuplicateRecord = this.selectedEmployees.find(x => x.id === employee.id)
      //  if(!findDuplicateRecord) {
      //   this.selectedEmployees.push(employee)
      //  }
      res.map((employee) => {
       if(!(this.selectedEmployees.find(x => x.id === employee.id))) this.selectedEmployees.push(employee)
      })
      }
      this.gridOptions.api.setRowData(this.selectedEmployees)
      this.cdRef.detectChanges();
    });
  }

  onDelete(params: Params) {
    this.selectedEmployees.splice(this.selectedEmployees.indexOf(params.rowData), 1);
    this.gridOptions.api.applyTransaction({ remove: [params.rowData] });
    return this.selectedEmployees;
  }
}



