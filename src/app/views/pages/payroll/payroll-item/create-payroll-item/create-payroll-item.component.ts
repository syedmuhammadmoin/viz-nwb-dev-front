import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { Observable, Subscription } from 'rxjs';
import { ProductService } from '../../../profiling/product/service/product.service';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { PayrollItemService } from '../service/payroll-item.service'
import { IPayrollItem } from '../model/IPayrollItem'
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent, ValueFormatterParams } from 'ag-grid-community';
import { CustomTooltipComponent } from 'src/app/views/shared/components/custom-tooltip/custom-tooltip.component';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssignEmployeeComponent } from '../assign-employee/assign-employee.component';
import { isEmpty } from 'lodash';
import { ActionButtonComponent } from 'src/app/views/shared/components/action-button/action-button.component';
import { Button } from 'protractor';

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

  //selected Employees to assign
  selectedEmployees: any[] = []

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // Payroll Model
  payrollItemModel: IPayrollItem;

  title: string = 'Create Payroll Item'

  // Validation messages..
  validationMessages = {
    customerName: {
      required: 'Customer Name is required.',
    },
  };

  // error keys..
  formErrors = {
    customerName: '',
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
      customerName: ['', [Validators.required]],
    });

    this.payrollItemModel = {
      id: null,
      customerId: null,
    }

    this.gridOptions = {
      rowHeight: 40,
      headerHeight: 35,
      context: "double click to edit",
    };

    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,  
      buttonRenderer: ActionButtonComponent
    };

    this.defaultColDef = {
      tooltipComponent: 'customTooltip'
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
        this.gridApi.hideOverlay();
     }

    
    
    // this.ngxsService.getCampusFromState()
    // // get location from location
    //this.ngxsService.getLocationFromState();
    
    // this.activatedRoute.queryParams.subscribe((param) => {
    //   const id = param.q;
    //   const isInvoice = param.isInvoice;
    //   const isSalesOrder = param.isSalesOrder;
    //   if (id && isInvoice) {
    //     this.title = 'Edit Invoice'
    //     this.getInvoice(id);
    //   }
    //   else if (id && isSalesOrder) {
    //     this.getSalesOrder(id);
    //   }
    // });
  }

  columnDefs = [
    { 
      headerName: 'Name', 
      field: 'name', 
      sortable: true, 
      filter: true, 
      tooltipField: 'name',
      cellRenderer: "loadingCellRenderer",
     },
     { 
      headerName: 'Father Name', 
      field: 'fatherName', 
      sortable: true, 
      filter: true, 
      tooltipField: 'name',
     },
     { 
      headerName: 'Cnic', 
      field: 'cnic', 
      sortable: true, 
      filter: true, 
      tooltipField: 'name',
     },
     { 
      headerName: 'Designation', 
      field: 'designationName', 
      sortable: true, 
      filter: true, 
      tooltipField: 'name',
     },
     { 
      headerName: 'Department', 
      field: 'departmentName', 
      sortable: true, 
      filter: true, 
      tooltipField: 'name',
     },
     { 
      headerName: 'Faculty', 
      field: 'faculty', 
      sortable: true, 
      filter: true, 
      tooltipField: 'name',
     },
     { 
      headerName: 'Shift', 
      field: 'dutyShift', 
      sortable: true, 
      filter: true, 
      tooltipField: 'name',
     },
     {
       headerName: 'Action', 
       cellRenderer: 'buttonRenderer',
       cellRendererParams: {
        onClick: this.onDelete.bind(this),
        label: 'Delete'
      }
    }
  ];


  // Form Reset
  reset() {
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

 
  

  

  

  

  //Submit Form Function
  onSubmit(): void {
   
    if (this.payrollItemForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.mapFormValuesToPayrollItemModel();
    //console.log(this.payrollItemModel)
    if (this.payrollItemModel.id) {
      // this.payrollItemService.updateInvoice(this.payrollItemModel)
      //   .pipe(
      //     take(1),
      //     finalize(() => {
      //       this.isLoading = false;
      //     })
      //   )
      //   .subscribe((res: IApiResponse<IInvoice>) => {
      //     this.toastService.success('' + res.message, 'Updated Successfully')
      //     this.cdRef.detectChanges();
      //     this.router.navigate(['/' + INVOICE.ID_BASED_ROUTE('details', this.payrollItemModel.id)]);
      //   },
      //     (err) => {
      //       this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Updating');
      //       this.isLoading = false;
      //       this.cdRef.detectChanges()
      //     })
    } else {
    //   delete this.payrollItemModel.id;
    //   this.payrollItemService.createInvoice(this.payrollItemModel)
    //     .pipe(
    //       take(1),
    //       finalize(() => this.isLoading = false))
    //     .subscribe((res: IApiResponse<IInvoice>) => {
    //         this.toastService.success('' + res.message, 'Created Successfully')
    //         this.router.navigate(['/' + INVOICE.LIST])
    //       },
    //       (err) => {
    //         this.isLoading = false;
    //         this.cdRef.detectChanges();
    //         this.toastService.error(`${err.error.message || 'Something went wrong, please try again later.'}`, 'Error Creating')
    //       }
    //     );
    // }
  }
}

  //Mapping value to model
  mapFormValuesToPayrollItemModel() {
    this.payrollItemModel.customerId = this.payrollItemForm.value.customerName;
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

  onGridReady(params: GridReadyEvent) {
    // this.gridApi = params.api;
    // this.gridColumnApi = params.columnApi;
    // params.api.setDatasource(this.dataSource);
  }

  // async getPayrollItems(params: any): Promise<IPaginationResponse<IPayrollItem[]>> {
  //   // const result = await this.payrollItemService.getInvoices().toPromise()
  //   return result
  // }

  // dataSource = {
  //   getRows: async (params: any) => {
  //    const res = await this.getInvoices(params);

  //    if (!res.result) { 
  //     this.gridApi.showNoRowsOverlay() 
  //   } else {
  //    this.gridApi.hideOverlay();
  //   }
  //    //if(res.result) res.result.map((data: any, i: number) => data.index = i + 1)
  //    params.successCallback(res.result || 0, res.totalRecords);
  //    this.cdRef.detectChanges();
  //  },
  // };

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
        this.selectedEmployees = res
      }
      else if(!isEmpty(res)) {
        res.forEach((employee) => {
       const findDuplicateRecord = this.selectedEmployees.find(x => x.id === employee.id)

       if(!findDuplicateRecord) {
        this.selectedEmployees.push(employee)
       }
    })
      }
      this.gridOptions.api.setRowData(this.selectedEmployees)
      this.cdRef.detectChanges();
    });
  }

  onDelete(params: Params) {
    this.selectedEmployees.splice(params.rowData.index, 1);
    console.log(this.selectedEmployees);
    this.gridOptions.api.applyTransaction({ remove: [params.rowData] });
    this.gridOptions.api.forEachNode(node => {
      console.log(node.data);
    });
    return this.selectedEmployees;
  }
}



