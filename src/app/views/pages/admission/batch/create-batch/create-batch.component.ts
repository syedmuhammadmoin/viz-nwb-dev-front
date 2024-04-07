import {ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {AddModalButtonService} from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import {NgxsCustomService} from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import {IBatch, IBatchLines} from '../model/IBatch';
import {ActivatedRoute} from '@angular/router';
import {Permissions} from '../../../../shared/AppEnum';
import {finalize, take} from 'rxjs/operators';
import {IsReloadRequired} from '../../../profiling/store/profiling.action';
import {BatchState} from '../store/batch.state';
import {BATCH, INVOICE} from '../../../../shared/AppRoutes';
import {ISemesterCoursesList} from '../../program/models/IProgram';

@Component({
  selector: 'kt-create-batch',
  templateUrl: './create-batch.component.html',
  styleUrls: ['./create-batch.component.scss']
})
export class CreateBatchComponent extends AppComponentBase implements OnInit {

  // For Table Columns
  displayedColumns = ['programId', 'action']

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // for permissions
  public permissions = Permissions;

  // Loader
  isLoading: boolean;

  // variable for batch Form
  batchForm: FormGroup;

  // batch Model
  batch: IBatch = {} as IBatch;

  title = 'Create batch'

  // show Buttons
  showButtons = true;

  // for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // validation messages
  validationMessages = {
    name: {
      required: 'Batch name is required.'
    },
    startDate: {
      required: 'Start Date is required.'
    },
    semesterId: {
      required: 'Semester is required.'
    },
    campusId: {
      required: 'Campus is required.'
    },
    shiftId: {
      required: 'Shift is required.'
    },
    isAdmissionOpen: {
      required: 'Admission is required.'
    }
  }

  // error keys
  formErrors: any = {
    name: '',
    startDate: '',
    semesterId: '',
    campusId: '',
    shiftId: '',
    isAdmissionOpen: '',
  }

  // Injecting dependencies
  constructor(
    private fb: FormBuilder,
    public ngxsService: NgxsCustomService,
    public addButtonService: AddModalButtonService,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.batchForm = this.fb.group({
      name: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      semesterId: ['', [Validators.required]],
      campusId: ['', [Validators.required]],
      shiftId: ['', [Validators.required]],
      isAdmissionOpen: ['', [Validators.required]],
      batchLines: this.fb.array([
        this.addBatchLines()
      ])
    });

    this.activatedRoute.params.subscribe((res) => {
      if (res.id) {
        this.batch.id = res.id
        this.showButtons = (this.permission.isGranted(this.permissions.ADMISSION_BATCH_EDIT));
        this.title = 'Edit Batch'
        this.isLoading = true
        this.getBatch(this.batch.id);
      }
    })

    // Get Data from Store
     this.ngxsService.getCampusFromState();
     this.ngxsService.getShiftsFromState();
     this.ngxsService.getProgramsFromState();
     this.ngxsService.getSemestersFromState();
  }

  // Add Invoice Lines
  addBatchLines(): FormGroup {
    return this.fb.group({
      programId: ['', Validators.required],
    });
  }

  //Remove Invoice Line
  removeBatchLineClick(invoiceLineIndex: number): void {
    const invoiceLineArray = this.batchForm.get('batchLines') as FormArray;
    invoiceLineArray.removeAt(invoiceLineIndex);
    invoiceLineArray.markAsDirty();
    invoiceLineArray.markAsTouched();
    this.table.renderRows();
  }

  //Add Invoice Lines
  addBatchLineClick(): void {
    const controls = this.batchForm.controls.batchLines as FormArray;
    controls.push(this.addBatchLines());
    this.table.renderRows();
  }

  isSubmit(value) {}

  getBatch(id: number) {
    this.ngxsService.batchService.getById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe(
        (batch) => {
          this.editFaculty(batch.result);
          this.batch = batch.result;
        }
      );
  }

//  Edit Warehouse form
  editFaculty(batch: IBatch) {
    this.batchForm.patchValue({
      id: batch.id,
      name: batch.name,
      startDate: batch.startDate,
      semesterId: batch.semesterId,
      campusId: batch.campusId,
      shiftId: batch.shiftId,
      isAdmissionOpen: batch.isAdmissionOpen,
    });

    // if user have no permission to edit, so disable all fields
    if (!this.showButtons) {
      this.batchForm.disable();
    }
    this.batchForm.setControl('batchLines', this.patchBatchLines(batch.batchLines))
  }

  patchBatchLines(lines: ISemesterCoursesList[]): FormArray {
    const formArray = new FormArray([]);
    lines.forEach((line: IBatchLines) => {
      formArray.push(this.fb.group({
        id: line.id,
        programId: line.programId,
      }))
    })
    return formArray
  }
  onSubmit() {
    if (this.batchForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValueToClientModel();
     if (this.batch.id) {
       this.ngxsService.batchService.update(this.batch)
       .pipe(
         take(1),
          finalize(() => {
           this.isLoading = false;
           this.cdRef.detectChanges();
          })
        )
         .subscribe(() => {
             this.ngxsService.store.dispatch(new IsReloadRequired(BatchState, true))
             this.toastService.success('Updated Successfully', 'Batch')
             this.router.navigate(['/' + BATCH.LIST]);
           }
         );
     } else {
       delete this.batch.id;
       this.ngxsService.batchService.create(this.batch)
       .pipe(
         take(1),
          finalize(() => {
           this.isLoading = false;
           this.cdRef.detectChanges();
          })
        )
         .subscribe((res) => {
             this.ngxsService.store.dispatch(new IsReloadRequired(BatchState, true))
             this.toastService.success('Created Successfully', 'Batch')
             this.router.navigate(['/' + BATCH.LIST]);
           }
         );
     }
  }

// map form values to the batch model
  mapFormValueToClientModel() {
    this.batch.name = this.batchForm.value.name;
    this.batch.startDate = this.batchForm.value.startDate;
    this.batch.semesterId = this.batchForm.value.semesterId;
    this.batch.campusId = this.batchForm.value.campusId;
    this.batch.shiftId = this.batchForm.value.shiftId;
    this.batch.isAdmissionOpen = this.batchForm.value.isAdmissionOpen;
    this.batch.batchLines = this.batchForm.value.batchLines;
  }

  reset() {
    this.formDirective.resetForm();
  }
}
