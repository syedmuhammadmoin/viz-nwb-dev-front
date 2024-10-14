import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ChildrenList, ITax } from '../model/ITax';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { finalize, take } from "rxjs/operators";
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { Permissions, TaxComputation } from 'src/app/views/shared/AppEnum';
import { TaxService } from '../service/tax.service';
import { AppConst } from 'src/app/views/shared/AppConst';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { ChartOfAccountService } from '../../../finance/chat-of-account/service/chart-of-account.service';
import { SelectTaxListComponent } from '../select-tax-list/select-tax-list.component';
import { ListTaxGroupComponent } from '../../tax-group/list-tax-group/list-tax-group.component';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { TaxGroupService } from '../../tax-group/service/tax-group.service';
import { ITaxGroupModel } from '../../tax-group/model/ITaxGroupModel';

@Component({
  selector: 'vl-edit-tax',
  templateUrl: './edit-tax.component.html',
  styleUrl: './edit-tax.component.scss'
})
export class EditTaxComponent extends AppComponentBase implements OnInit {

  //Loader
  isLoading: boolean
  istax: boolean;
  selectedType: string | null = null;
  public selectedAccount: String;
  otherAccountsList: any;

  // tax form declaration
  taxForm: FormGroup;
  ChildrenList: any[] = [];
  list = new BehaviorSubject<any>(null);

  //tax model 
  taxModel: any = {} as any;
  public groupId = 1;

  //get tax data by id
  taxDataByID: ITax | any;

  title: string = 'Create Tax'
  taxComputation = AppConst.taxComputation

  permissions = Permissions

  //show Buttons
  // showButtons: boolean = true;


  taxTypeList = AppConst.taxType;
  taxComputationList = AppConst.taxComputation;
  taxScopeList = AppConst.taxScope;
  taxGroupList = AppConst.taxGroup
  taxInculsion = AppConst.taxInculsion
  TaxGrpList: ITaxGroupModel[];

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;
  

  // validation messages
  validationMessages = {
    name: {
      required: 'Tax Name is required.',
    },
    taxType: {
      required: 'Tax Type is required.',
    },
    accountId: {
      required: 'Account is required.',
    }
  };
  taxBaseList = AppConst.taxBase
  //error keys
  formErrors: any = {
    name: '',
    taxType: '',
    accountId: '',
  };

  constructor(private fb: FormBuilder,
    public taxService: TaxService,
    public ngxsService: NgxsCustomService,
    public route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    public taxGrpService: TaxGroupService,
    private accountService: ChartOfAccountService,
    public dialog: MatDialog,
    public addButtonService: AddModalButtonService,
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
     public dialogRef: MatDialogRef<EditTaxComponent>,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.taxForm = this.fb.group({
      id: [],
      name: [null, [Validators.required]],
      taxType: [null],
      accountId: [null],
      taxComputation: [null],
      amount: [null],
      percent: [null],
      labelOninv: [null],
      company: [null],
      groupId: [null],
      includedPrice: [null],
      sabsequentTaxes: [false],
      description: [null],
      legalNotes: [null],
      taxScope: [null],
      isActive: [true],
      childrentaxes: this.fb.array([]),
      taxInvoiceslines: this.fb.array([]),
      taxRefundlines: this.fb.array([])
    });

    this.route.queryParams.subscribe((param: Params) => {
      const id = param.q;
      this.istax = param.istax;
      if (id && this.istax) {
        this.title = 'Edit Tax'
        this.getTax(id);
      }
    })
    if(this._id){
      console.log(this._id,"Loging ud");
      this.getTax(this._id)
      
    }


    //Get Data From Store
    this.ngxsService.getOtherAccountsFromState();
    this.ngxsService.getBusinessPartnerFromState();
    this.ngxsService.getAllBusinessPartnerFromState();
    this.ngxsService.getEmployeePaymentsFromState();
    lastValueFrom(this.accountService.getOtherAccounts()).then(res => {
      this.otherAccountsList = res.result
    })

    this.getTaxGroup();
    this.addInvoiceLine();
    this.addRefundine();
    this.onTypeChange(this.selectedType)
    console.log(this.selectedType,"SelectedType");
    
    
  }
  getTaxGroup() {
    this.taxGrpService.getAll().subscribe(res =>{
      this.TaxGrpList = res.result
      this.cdRef.detectChanges();
    }) 
  }
  get taxInvoiceslines(): FormArray {
    return this.taxForm.get('taxInvoiceslines') as FormArray;
  }
  get taxRefundlines(): FormArray {
    return this.taxForm.get('taxRefundlines') as FormArray;
  }

  addInvoiceLine(): void {
    const detail = this.fb.group({
      percent: [''],
      taxBase: ['base',],
      accountId: [],

    })
    this.taxInvoiceslines.push(detail)
  }

  addRefundine(): void {
    const detail = this.fb.group({
      percent: [''],
      taxBase: ['base'],
      accountId: []
    })
    this.taxRefundlines.push(detail)
  }

  removeInvoiceDetail(index: number): void {
    this.taxInvoiceslines.removeAt(index);
  }
  removeRefundDetail(index: number): void {
    this.taxRefundlines.removeAt(index);
  }
  // Getting tax values for update
  getTax(id: number) {
    this.taxService.getTax(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe(
        (tax: IApiResponse<ITax>) => {
          this.editTax(tax.result);
          this.taxDataByID = tax.result;
          this.taxModel = tax.result
        }
      );
  }

  // Patching values to tax form
  editTax(tax: any) {
    this.taxForm.patchValue({
      id: tax.id,
      name: tax.name,
      taxType: tax.taxType,
      accountId: (tax.accountId === '00000000-0000-0000-0000-000000000000') ? null : tax.accountId,
      taxComputation: tax.taxComputation,
      amount: tax.amount,
      percent: tax.percent,
      labelOninv: tax.labelOnInv,
      company: tax.company,
      includedPrice: tax.includedPrice,
      sabsequentTaxes: tax.sabsequentTaxes,
      description: tax.description,
      legalNotes: tax.legalNotes,
      taxScope: tax.taxScope,
      groupId: tax.groupId,
      isActive :tax.isActive
    });
    this.selectedType = tax.taxComputation
    this.onTypeChange(tax.taxComputation)
    this.taxForm.setControl('taxInvoiceslines', this.PatchInvoiceslines(tax.taxInvoicesLines))
    this.taxForm.setControl('taxRefundlines', this.PatchtaxRefundlines(tax.taxRefundLines))
    this.ChildrenList = tax.childrenTaxes
  }

  PatchInvoiceslines(lines: any[]): FormArray {
    const formArray = new FormArray([]);
    lines.forEach((line: any) => {
      formArray.push(this.fb.group({
        percent: line.percent,
        taxBase: [line.taxBase],
        accountId: [line.accountId],
      }))
    })
    return formArray
  }
  PatchtaxRefundlines(lines: any[]): FormArray {
    const formArray = new FormArray([]);
    lines.forEach((line: any) => {
      formArray.push(this.fb.group({
        percent: line.percent,
        taxBase: [line.taxBase],
        accountId: [line.accountId],
      }))
    })
    return formArray
  }
  onSubmit() {
    console.log(this.taxForm.value, "Tax Form");
    if (this.taxForm.invalid) {
      this.taxForm.markAsUntouched();
      return;
    }
    const InvLines = this.taxForm.get('taxInvoiceslines') as FormArray;
    const RefLines = this.taxForm.get('taxRefundlines') as FormArray;
    const taxComp = this.taxForm.get('taxComputation')
    if (taxComp.value != 0) {
      const hasTypeBaseInInv = InvLines.controls.some(line => line.get('taxBase')?.value === 0);
      const hasTypeBaseInRef = RefLines.controls.some(line => line.get('taxBase')?.value === 0);
      if (InvLines.length !== RefLines.length) {
        this.toastService.info("Invoice & Refund Lines Should be Equal");
        return;
      }
      if (!hasTypeBaseInInv || !hasTypeBaseInRef) {
        this.toastService.info("At Least One Record of base type is Required.");
        return;
      }
      this.taxModel = this.taxForm.value;
    }

    if (this.ChildrenList != undefined || this.ChildrenList != null) {
      this.taxModel = this.taxForm.value;
      this.taxModel.ChildrenTaxes = this.ChildrenList.map(child => ({
        taxId: child.id,
        name: child.name,
        taxComputation: child.taxComputation,
        amount: child.amount
      }));
    }



    this.isLoading = true;
    //this.mapFormValueToTaxModel();
    if (this.taxDataByID?.id) {
      this.taxService.updateTax(this.taxModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(res => {
        console.log(res,"Logging response edit form");
        
          if(this._id){
            debugger;
            this.dialogRef.close(res);
            console.log(this._id,"id");
            this.cdRef.detectChanges();
            return;
          }

          this.router.navigateByUrl('tax/list');
          this.toastService.success('Updated Successfully', 'Tax')
          this.onCloseDialog();
        }
        );
    } else {

      this.taxService.add(this.taxModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
          this.router.navigateByUrl('tax/list');
          this.toastService.success('Create Successfully', 'Tax')
          this.onCloseDialog();
        }
        );

    }
  }

  onAmountBlur(value: string): void {
    if (value) {
      let formattedValue = value.replace(/[^0-9.]/g, '');
      const [integer, decimal] = formattedValue.split('.');
      if (decimal && decimal.length > 2) {
        formattedValue = `${integer}.${decimal.slice(0, 4)}`;
      }
      if (!formattedValue.includes('.')) {
        formattedValue = `${formattedValue}.0000`;
      }
      this.taxForm.get('amount')?.setValue(formattedValue, { emitEvent: false });
    }
  }

  onPercentageBlur(value: string): void {
    if (value) {
      let formattedValue = value.replace(/[^0-9.]/g, '');
      const [integer, decimal] = formattedValue.split('.');
      if (decimal && decimal.length > 2) {
        formattedValue = `${integer}.${decimal.slice(0, 4)}`;
      }
      if (!formattedValue.includes('.')) {
        formattedValue = `${formattedValue}.0000`;
      }
      this.taxForm.get('percent')?.setValue(formattedValue, { emitEvent: false });
    }
  }

  // Mapping values from tax form to tax model
  mapFormValueToTaxModel() {
    this.taxModel.id = this.taxDataByID?.id;
    this.taxModel.accountId = this.taxForm.value.accountId;
    this.taxModel.name = this.taxForm.value.name;
    this.taxModel.taxType = this.taxForm.value.taxType;
    this.taxModel.taxComputation = this.taxForm.value.taxComputation
  }

  reset() {
    this.formDirective.resetForm();
  }

  // Dialogue close function
  onCloseDialog() {
    //this.dialogRef.close();
  }
  OnChange(event: any) {
    console.log(event, "event", this.selectedAccount);
  }

  onNavChange(event) {
    if (event.nextId === 1) {
      this.cdRef.detectChanges();
    }
  }

  onTypeChange(type: string) {
    this.selectedType = type;
    this.cdRef.detectChanges();
  }

  OpenModal() {
    const dialogRef = this.dialog.open(SelectTaxListComponent, {
      width: '800px',
      height: '500px',
    }).afterClosed().subscribe(res => {
      console.log(res,"before hit");
      if(res === null){
    return;
      }
      lastValueFrom(this.taxService.getTaxesByIds(res)).then(res => { 
        console.log(res,"closed");
        if(res == null){
          console.log("Okay");
          return;
        }else{
          console.log("Not Okay",res.result);           
            this.ChildrenList.push(...res.result);
            this.taxService.updateChildrenList(this.ChildrenList);
            this.cdRef.detectChanges();
            this.onNavChange({ event: { nextId: 1 } });                 
        }

        
      

      })
   
    });
  }
  removegrpLine(lineToRemove: any) {
    this.ChildrenList = this.ChildrenList.filter(line => line !== lineToRemove);
  }



  getTaxComputationDisplay(value: TaxComputation): string {
    switch (value) {
      case TaxComputation.GroupOfTaxes:
        return 'Group of Taxes';
      case TaxComputation.Fixed:
        return 'Fixed';
      case TaxComputation.Percentage:
        return 'Percentage';
      case TaxComputation.PercentageTaxIncluded:
        return 'Percentage Tax Included';
      default:
        return 'Unknown';
    }
  }

  openTaxGroupListDialog() {
    this.dialog.open(ListTaxGroupComponent, {
      width: '1207px',
      height: '250px'
    }).afterClosed().subscribe(res => {
      if (res) {
        this.taxForm.patchValue({
          groupId: res
        })
      }
    });
  }

  OnRowClick(event : any){
    console.log(event,"click");
    this.dialog.open(EditTaxComponent, {
      width : '800px',
      height : '700px',
      data : event.id
    })
    
  }
}

