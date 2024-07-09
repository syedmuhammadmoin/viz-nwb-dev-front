import { Component, Inject, Injector, OnInit, Optional} from '@angular/core';
import { FormGroup, FormBuilder, Validators,} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { AppComponentBase } from '../../app-component-base';

@Component({
  selector: 'kt-custom-remarks',
  templateUrl: './custom-remarks.component.html',
  styleUrls: ['./custom-remarks.component.scss']
})
export class CustomRemarksComponent extends AppComponentBase implements OnInit {

  remarksForm: FormGroup

  remarks: string;

  //validation message
  validationMessages = {
    remarks: {
      maxlength: "Remarks can't be more than 200 characters."
    }
  }

  //error
  formErrors: any = {
    remarks : ''
  }

  constructor(
      public dialogRef: MatDialogRef<CustomRemarksComponent>,
      private fb: FormBuilder,
      @Optional() @Inject(MAT_DIALOG_DATA) private data: string,
      injector: Injector
    ) { super(injector) }

  ngOnInit(): void {
    this.remarksForm = this.fb.group({
      remarks: ['', [Validators.maxLength(200)]]
    })
  }

  // submitting Campus Form
  onSubmit(): void {
    if(this.remarksForm.invalid){
      return
    }
    this.remarks = this.remarksForm.value.remarks;
      this.dialogRef.close({data: this.remarks});
  }

  // Dialogue close function
  onCloseRemarksDialog() {
    this.dialogRef.close();
  }
}



