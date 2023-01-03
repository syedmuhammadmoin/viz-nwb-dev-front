import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppComponentBase} from 'src/app/views/shared/app-component-base';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { finalize, take} from "rxjs/operators";
import { Permissions } from 'src/app/views/shared/AppEnum';
import { IAwardVendor } from '../model/IQuotationComparative';
import { QuotationComparativeService } from '../service/quotation-comparative.service';

@Component({
  selector: 'kt-award-vendor',
  templateUrl: './award-vendor.component.html',
  styleUrls: ['./award-vendor.component.scss']
})
export class AwardVendorComponent extends AppComponentBase implements OnInit {
  // for permissions
  public permissions = Permissions;

  //Busy Loading
  isLoading: boolean;

  //Variable awarded Form
  awardVendorForm: FormGroup;

  //Award Vendor Model
  awardVendorModel: IAwardVendor

  title: string = 'Award Vendor'

  //show Buttons
  showButtons: boolean = true; 

  //validation messages
  validationMessages = {
    awardedVendor: {
      required: 'Vendor Name is required.'
    },
    remarks: {
      required: 'Remarks is required.'
    },
  }

  //error keys
  formErrors = {
    awardedVendor: '',
    remarks: ''
  }

  //injecting dependencies
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<AwardVendorComponent>,
    private quotationComparativeService: QuotationComparativeService,
    private fb: FormBuilder,    
    private cdRef : ChangeDetectorRef,
    injector: Injector) {
    super(injector);   
  }

  ngOnInit() {
    this.awardVendorForm = this.fb.group({
      awardedVendor: ['', [Validators.required]],
      remarks: ['', [Validators.required]]
    });

    if (this.data.id) {
      this.showButtons = (this.permission.isGranted(this.permissions.QUOTATION_COMPARATIVE_EDIT)) ? true : false;
  
      this.awardVendorModel = {
        id: null,
        awardedVendor: '',
        remarks: '',
        quotationId: null
      };
    }
  }


  onSubmit() {
    if (this.awardVendorForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToAwardVendorModel();
      this.quotationComparativeService.awardVendor(this.awardVendorModel)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
        .subscribe(() => {          
            this.toastService.success('Awarded Successfully', 'Vendor')
            this.onCloseDialog();
          }
        );
    }

// map form values to the warehouse model
  mapFormValueToAwardVendorModel() {
    this.awardVendorModel.id = this.data.id;
    this.awardVendorModel.quotationId = this.data.quotationId;
    this.awardVendorModel.awardedVendor = this.awardVendorForm.value.awardedVendor;
    this.awardVendorModel.remarks = this.awardVendorForm.value.remarks;
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}

