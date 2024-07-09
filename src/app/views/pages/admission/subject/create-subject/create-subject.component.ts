import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { ISubject } from '../model/ISubject';
import { SubjectService } from '../service/subject.service';

@Component({
  selector: 'kt-create-subject',
  templateUrl: './create-subject.component.html',
  styleUrls: ['./create-subject.component.scss']
})
export class CreateSubjectComponent extends AppComponentBase implements OnInit {



  // for permissions
  public permissions = Permissions;
 
  //Loader
  isLoading: boolean;
 
  //variable for SubjectForm
  SubjectForm: FormGroup;
 
  //SubjectForm Model
  SubjectModel: ISubject= {} as ISubject;
 
  title: string = 'Create Subject'
 
  //show Buttons
  isEditButtonShow: boolean = false; 
 
  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;
 
  //validation messages
  validationMessages = {
   subject: {
    required: 'Subject is required.'
   },
   qualification: {
    required: 'Qualification is required.'
   }
  }
 
  //error keys
  formErrors: any = {
   subject: '',
   qualification: ''
  }
 
  //Injecting dependencies
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private _id: number,
    public dialogRef: MatDialogRef<CreateSubjectComponent>,
    private fb: FormBuilder,    
    public ngxsService:NgxsCustomService,
    private subjectService: SubjectService,
    public addButtonService:AddModalButtonService,
    private cdRef : ChangeDetectorRef,
    injector: Injector) {
    super(injector);   
  }
 
  ngOnInit() {
    this.SubjectForm = this.fb.group({
     subject: ['', [Validators.required]],
     qualification: ['', [Validators.required]],
    });
 
    if (this._id) {
     this.isEditButtonShow = true;
     this.title = 'Subject Detail';
 
     //disable all fields
     this.isLoading = true;
     this.SubjectForm.disable();
     this.getSubject(this._id);
   } else {
     this.SubjectModel = {
       id: null,
       name: '',
       qualificationId: null,
     };
   }
    //Get Data from Store
    this.ngxsService.getQualificationFromState();
  }
 
    //Edit Form
   toggleEdit() {
     this.isEditButtonShow = false;
     this.title = 'Edit Subject'
     this.SubjectForm.enable()
   }
 
  getSubject(id: number) {
   this.subjectService.getSubjectById(id)
   .pipe(
     take(1),
      finalize(() => {
       this.isLoading = false;
       this.cdRef.detectChanges();
      })
    )
    .subscribe(
     (res) => {
       this.editSubject(res.result),
         this.SubjectModel = res.result;
     }
     );
  }
 
 //  Edit Subject form
  editSubject(subject: ISubject) {
    this.SubjectForm.patchValue({
     id:subject.id,
     subject:subject.name,
     qualification: subject.qualificationId,
    });
 
  }
 
  onSubmit() {
 
    if (this.SubjectForm.invalid) {
      return;
    }
 
    this.isLoading = true
    this.mapFormValueToClientModel();
 
     if (this.SubjectModel.id) {
       this.isLoading = true;
       this.subjectService.updateSubject(this.SubjectModel)
       .pipe(
         take(1),
          finalize(() => {
           this.isLoading = false;
           this.cdRef.detectChanges();
          })
        )
         .subscribe(() => {
            this.toastService.success('Update Successfully', 'Subject')
            this.onCloseDialog();
          }
         );
     } else {
       delete this.SubjectModel['id'];
       this.isLoading = true;
       this.subjectService.createSubject(this.SubjectModel)
         .pipe(
           take(1),
           finalize(() => {
             this.isLoading = false;
             this.cdRef.detectChanges();
           })
         )
         .subscribe((res) => {
           this.toastService.success('Created Successfully', 'Subject');
           this.onCloseDialog();
         });
 
     }
  }
 
 // map form values to the SubjectModel model
  mapFormValueToClientModel() {
    this.SubjectModel.name = this.SubjectForm.value.subject;
    this.SubjectModel.qualificationId = this.SubjectForm.value.qualification;
  }
 
  reset() {
    this.formDirective.resetForm();
  }
 
  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }
 }
 
 