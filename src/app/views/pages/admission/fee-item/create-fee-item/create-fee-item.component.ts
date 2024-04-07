import {ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import {AppComponentBase} from '../../../../shared/app-component-base';
import {Permissions} from '../../../../shared/AppEnum';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgxsCustomService} from '../../../../shared/services/ngxs-service/ngxs-custom.service';
import {AddModalButtonService} from '../../../../shared/services/add-modal-button/add-modal-button.service';
import {finalize, take} from 'rxjs/operators';
import {IApiResponse} from '../../../../shared/IApiResponse';
import {IsReloadRequired} from '../../../profiling/store/profiling.action';
import { IFeeItem } from '../models/IFeeItem';
import {FeeItemState} from '../store/fee-item.state';

@Component({
  selector: 'kt-create-fee-item',
  templateUrl: './create-fee-item.component.html',
  styleUrls: ['./create-fee-item.component.scss']
})
export class CreateFeeItemComponent extends AppComponentBase implements OnInit {


  // for permissions
  public permissions = Permissions;

  // Loader
  isLoading: boolean;

  // variable for feeItem Form
  feeItemForm: FormGroup;

  // feeItem Model
  feeItem: IFeeItem = {} as IFeeItem;

  title = 'Create Fee Item'

  // show Buttons
  showButtons = true;

  // for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // validation messages
  validationMessages = {
    name: {
      required: 'Name is required.'
    },
    accountId: {
      required: 'Account is required.'
    },
    amount: {
      required: 'Amount is required.'
    },
    stateId: {
      required: 'State is required.'
    },
    countryId: {
      required: 'Country is required.'
    },
    courseCode: {
      required: 'feeItem Code is required.'
    },
    creditHour: {
      required: 'Credit Hour is required.',
      min: 'Minimum Value 1'
    },
    totalMarks: {
      required: 'TotalMarks is required.',
      min: 'Minimum Value 1'
    },
  }

  // error keys
  formErrors: any = {
    name: '',
    accountId: '',
    amount: '',
    stateId: '',
    courseCode: '',
    creditHour: '',
    totalMarks: ''
  }

  // Injecting dependencies
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateFeeItemComponent>,
    private fb: FormBuilder,
    public ngxsService: NgxsCustomService,
    public addButtonService: AddModalButtonService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.feeItemForm = this.fb.group({
      name: ['', [Validators.required]],
      accountId: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      // courseCode: ['', [Validators.required]],
      // creditHour: ['', [Validators.required, Validators.min(0)]],
      // totalMarks: ['', [Validators.required, Validators.min(0)]]
    });

    if (this._id) {
      // TODO: check feeItem edit permission
      // this.showButtons = (this.permission.isGranted(this.permissions.FACULTY_EDIT));
      this.title = 'Edit Fee Item'
      this.isLoading = true
      this.getFeeItem(this._id);
    }

    // Get Data from Store
    this.ngxsService.getAccountLevel4FromState();
  }

  getFeeItem(id: number) {
    this.ngxsService.feeItemService.getById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe(
        (feeItem: IApiResponse<IFeeItem>) => {
          this.editCourse(feeItem.result);
          this.feeItem = feeItem.result;
        }
      );
  }

//  Edit feeItem form
  editCourse(feeItem: IFeeItem) {
    this.feeItemForm.patchValue({
      id: feeItem.id,
      name: feeItem.name,
      accountId: feeItem.accountId,
      amount: feeItem.amount,
      // courseCode: feeItem.courseCode,
      // creditHour: feeItem.creditHour,
      // totalMarks: feeItem.totalMarks,
    });

    // if user have no permission to edit, so disable all fields
    if (!this.showButtons) {
      this.feeItemForm.disable();
    }
  }

  onSubmit() {
    if (this.feeItemForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToClientModel();
    if (this.feeItem.id) {
      this.ngxsService.feeItemService.update(this.feeItem)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(FeeItemState, true))
            this.toastService.success('Updated Successfully', 'Fee Item')
            this.onCloseDialog();
          }
        );
    } else {
      delete this.feeItem.id;
      this.ngxsService.feeItemService.create(this.feeItem)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(() => {
            this.ngxsService.store.dispatch(new IsReloadRequired(FeeItemState, true))
            this.toastService.success('Created Successfully', 'Fee Item')
            this.onCloseDialog();
          }
        );
    }
  }

// map form values to the feeItem model
  mapFormValueToClientModel() {
    this.feeItem.name = this.feeItemForm.value.name;
    this.feeItem.accountId = this.feeItemForm.value.accountId;
    this.feeItem.amount = this.feeItemForm.value.amount;
    // this.feeItem.courseCode = this.CourseForm.value.courseCode;
    // this.feeItem.creditHour = this.CourseForm.value.creditHour;
    // this.feeItem.totalMarks = this.CourseForm.value.totalMarks;
  }

  reset() {
    this.formDirective.resetForm();
  }

  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
}
