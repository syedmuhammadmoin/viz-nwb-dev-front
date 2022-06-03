import { WORKFLOW } from './../../../../shared/AppRoutes';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { ActivatedRoute, Router} from '@angular/router';
import { finalize, take} from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ActionButton, DocumentStatus} from 'src/app/views/shared/AppEnum';
//import {AddModalButtonService} from 'src/app/shared/service/add-modal-button.service';
import { AccessManagementService } from '../../../access-management/service/access-management.service';

import { IWorkflow} from '../model/IWorkflow';
import { WorkflowService} from '../service/workflow.service';
import { AppConst } from 'src/app/views/shared/AppConst';
import { Observable } from 'rxjs';
import { FormsCanDeactivate } from 'src/app/views/shared/route-guards/form-confirmation.guard';
import { IStatus } from '../../status/model/IStatus';
import { StatusService } from '../../status/service/status.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service'

@Component({
  selector: 'kt-create-workflow',
  templateUrl: './create-workflow.component.html',
  styleUrls: ['./create-workflow.component.scss']
})
  
export class CreateWorkflowComponent extends AppComponentBase implements OnInit, FormsCanDeactivate {

  documents = AppConst.Documents
  docStatus = DocumentStatus
  actionButton = ActionButton
  workflowForm: FormGroup;

  // busy loading
  isLoading: boolean;

  // For Table Columns
  // displayedColumns = ['itemId', 'description', 'accountId', 'quantity', 'salesPrice', 'salesTax', 'subTotal', 'action']
  displayedColumns = ['currentStatusId', 'action', 'nextStatusId', 'allowedRoleId', 'delete']

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // Invoice Model
  workflowModel = ({} as IWorkflow);

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  title: string = 'Create Workflow'

  // Validation messages..
  validationMessages = {
    name: {
      required: 'Workflow Name is required.',
    },
    docType: {
      required: 'Document Type is required.',
    },
  };

  // error keys..
  formErrors = {
    name: '',
    docType: '',
  };
  // workflowMaster: any;
  statuses: IStatus[] = [] as IStatus[];

  constructor(
    private fb: FormBuilder,
   // public addNewButtonService: AddModalButtonService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private route: Router,
    public activatedRoute: ActivatedRoute,
    private workflowService: WorkflowService,
    public ngxsService: NgxsCustomService,
    public statusService: StatusService,
    public accessManagementService: AccessManagementService,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.workflowForm = this.fb.group({
      name: ['', Validators.required],
      docType: ['', Validators.required],
      isActive: [true],
      workflowLines: this.fb.array([this.addWorkflowLines()])
    })
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (id) {
        this.title = 'Edit Workflow'
        this.getWorkflow(id);
      }
    })
    //get statuses from state
    this.ngxsService.getStatusesFromState()

    //for check status on add new line button
    // this.ngxsService.statuses$.subscribe((res) => {
    //   this.statuses = res.result
    // });

    this.statusService.getStatusesDropdown().subscribe((res) => {
      this.statuses = res.result
    });
  }

  getWorkflow(id: any) {
    this.workflowService.getWorkflow(id).subscribe((res) => {
      //for mapping, getting values from invoiceMaster because of fields disablility
      this.workflowModel = res.result;
      this.patchWorkflow(res.result);
    });
  }

  patchWorkflow(result: any) {
    this.workflowForm.patchValue({
      name: result.name,
      docType: result.docType,
      isActive: result.isActive,
    })
    this.workflowForm.setControl('workflowLines', this.patchWorkflowLines(result.workflowTransitions))
  }

  patchWorkflowLines(workflowTransitions: any): FormArray {
    const formArray = new FormArray([]);
    workflowTransitions.forEach(element => {
      formArray.push(this.fb.group({
        currentStatusId: element.currentStatusId,
        action: element.action,
        nextStatusId: element.nextStatusId,
        allowedRoleId: element.allowedRoleId,
      }))
    });
    return formArray
  }

  // Form Reset
  reset() {
    const workflowLineArray = this.workflowForm.get('workflowLines') as FormArray;
    this.formDirective.resetForm();
    workflowLineArray.clear();
    this.table.renderRows();
  }

  // Add Invoice Line Click
  addWorkflowLineClick(): void {
    const controls = this.workflowForm.controls.workflowLines as FormArray;
    if (!controls.value.some(x => this.statuses.find(y => y.id === x.nextStatusId).state === this.docStatus.Unpaid)) {
      controls.push(this.addWorkflowLines());
      this.table.renderRows();
    } else {
      this.toastService.error('Document cannot move any further after approve', 'Workflow Error')
    }
  }

  // Add Invoice Lines
  addWorkflowLines(): FormGroup {
    return this.fb.group({
      currentStatusId: ['', Validators.required],
      action: ['', Validators.required],
      nextStatusId: ['', [Validators.required]],
      allowedRoleId: ['', [Validators.required]],
    });
  }

  // Remove Invoice Line
  removeInvoiceLineClick(invoiceLineIndex: number): void {
    const workflowLineArray = this.workflowForm.get('workflowLines') as FormArray;
    workflowLineArray.removeAt(invoiceLineIndex);
    workflowLineArray.markAsDirty();
    workflowLineArray.markAsTouched();
    this.table.renderRows();
  }

  // Submit Form Function
  onSubmit(): void {
    if (this.workflowForm.get('workflowLines').invalid) {
      this.workflowForm.get('workflowLines').markAllAsTouched();
      return;
    }
    if (this.workflowForm.invalid) {
      return;
    }
    const controls = this.workflowForm.controls.workflowLines as FormArray;
    if (controls.length === 0) {
      this.toastService.error('Please add workflow transitions', 'Error')
      return
    }
    if (!controls.value.some(x => this.statuses.find(y => y.id === x.nextStatusId).state === this.docStatus.Unpaid)) {
      this.toastService.error('Approve status is required to complete the Workflow.', 'Workflow Error!');
      return;
    }
    if (controls.value.some(x => this.statuses.find(y => y.id === x.currentStatusId).state === this.docStatus.Unpaid)) {
      this.toastService.error('Current status can\'t be Approved.', 'Workflow Error!');
      return;
    }

    this.isLoading = true
    this.mapFormValuesToworkflowModel();
   // console.log(this.workflowModel);
    if (this.workflowModel.id) {
      this.workflowService.updateWorkflow(this.workflowModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe(
          () => {
            this.toastService.success('Updated Successfully', 'Workflow')
            this.route.navigate(['/'+WORKFLOW.LIST])
          },
          (err: any) => {
            this.toastService.error('' + err?.error.message, 'Error Updating')
            this.isLoading = false;
            this.cdRef.detectChanges();
            console.log(err)
          }
        )
    } else {
      delete this.workflowModel.id;
      this.workflowService.createWorkflow(this.workflowModel)
        .pipe(
          take(1),
          finalize(() => this.isLoading = false))
        .subscribe(
          () => {
            this.toastService.success('Created Successfully', 'Workflow')
            this.route.navigate(['/'+WORKFLOW.LIST])
          },
          (err: any) => {
            this.toastService.error('' + err?.error.message, 'Error Creating')
            this.isLoading = false;
            this.cdRef.detectChanges();
          }
        );
    }
  }

  // Mapping value to model
  mapFormValuesToworkflowModel() {
    this.workflowModel.name = this.workflowForm.value.name;
    this.workflowModel.docType = this.workflowForm.value.docType;
    this.workflowModel.isActive = this.workflowForm.value.isActive;
    this.workflowModel.workflowTransitions = this.workflowForm.value.workflowLines
  }

  openStatusDialog() {
  }

  canDeactivate(): boolean | Observable<boolean> {
    return !this.workflowForm.dirty;
  }

}
