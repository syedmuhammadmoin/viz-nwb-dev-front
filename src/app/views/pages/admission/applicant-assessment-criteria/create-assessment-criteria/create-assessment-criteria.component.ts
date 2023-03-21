import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { IApplicantAssessmentCriteria } from '../model/IApplicant-criteria';
import { Criteria } from '../../../../shared/AppEnum';
import { AppConst } from 'src/app/views/shared/AppConst';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'kt-create-assessment-criteria',
  templateUrl: './create-assessment-criteria.component.html',
  styleUrls: ['./create-assessment-criteria.component.scss']
})
export class CreateAssessmentCriteriaComponent extends AppComponentBase implements OnInit {


 // for permissions
 public permissions = Permissions;

 selectedValue = 'and';

 CriteriaFld = AppConst.CriteriaField;
 Naturefld = AppConst.NatureField;
 
 //Loader
 isLoading: boolean;
 isDeclining: boolean = false;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // For Table Columns
  displayedColumns = ['description', 'criteria', 'nature', 'default', 'radio', 'action']


 //variable for warehouse Form
 ApplicantAssessmentCriteriaForm: FormGroup;

 //Department Model
 ApplicantAssessmentCriteria: IApplicantAssessmentCriteria= {} as IApplicantAssessmentCriteria;

 title: string = 'Applicant assessment criteria'

 //show Buttons
 showButtons: boolean = true; 

  // Getting Table by id
 @ViewChild('table', { static: false }) table: any;

 //validation messages
 validationMessages = {
  program: {
    required: 'Program name is required.'
  }, 
 }

 //error keys
 formErrors = {
  program: '',
  description: '',
  criteria: '',
  nature: '',
  default: ''
 }

 //Injecting dependencies
 constructor(
   private fb: FormBuilder,    
   public ngxsService:NgxsCustomService,
   private cdRef : ChangeDetectorRef,
   injector: Injector) {
   super(injector);   
 }

 ngOnInit() {
  

   this.ApplicantAssessmentCriteriaForm = this.fb.group({
    program: ['', [Validators.required]],
    addApplicantLines: this.fb.array([
      this.addBudgetLines()
    ])
   });

  

  //  if (this._id) {
  //    this.showButtons = (this.permission.isGranted(this.permissions.FACULTY_EDIT)) ? true : false;
  //    this.title = 'Edit Faculty'
  //    this.isLoading = true
  //    this.getFaculty(this._id);
  //  } 

   //Get Data from Store
  //  this.ngxsService.getCampusFromState();
 }

//  getFaculty(id: number) {
//    this.ngxsService.warehouseService.getWarehouse(id)
//    .pipe(
//      take(1),
//       finalize(() => {
//        this.isLoading = false;
//        this.cdRef.detectChanges();
//       })
//     )
//      .subscribe(
//        (warehouse: IApiResponse<IWarehouse>) => {
//          this.editWarehouse(warehouse.result);
//          this.warehouse = warehouse.result;
//        }
//      );
//  }

//  Edit AcademicDepartment form
 editAcademicDepartment(ADepartment: IApplicantAssessmentCriteria) {
   this.ApplicantAssessmentCriteriaForm.patchValue({
    //  id: ADepartment.id,
    //  facultyId: ADepartment.facultyId,
    //  AcademicDepartment: ADepartment.AcademicDepartment
   });

   //if user have no permission to edit, so disable all fields
   if(!this.showButtons) {
     this.ApplicantAssessmentCriteriaForm.disable();
   }
 }

 onSubmit() {

  if (this.ApplicantAssessmentCriteriaForm.get('addApplicantLines').invalid) {
    this.ApplicantAssessmentCriteriaForm.get('addApplicantLines').markAllAsTouched();
  }

  const controls = this.ApplicantAssessmentCriteriaForm.controls.addApplicantLines as FormArray;
  if (controls.length === 0) {
    this.toastService.error('Please add Applicant assessment criteria Lines', 'Applicant Assessment Criteria')
    return;
  }

  if (this.ApplicantAssessmentCriteriaForm.invalid) {
    return;
  }

  this.mapFormValueToClientModel();
  this.isLoading = true
  //  if (this.warehouse.id) {
  //    this.ngxsService.warehouseService.updateWarehouse(this.warehouse)
  //    .pipe(
  //      take(1),
  //       finalize(() => {
  //        this.isLoading = false;
  //        this.cdRef.detectChanges();
  //       })
  //     )
  //      .subscribe(() => {            
  //          this.ngxsService.store.dispatch(new IsReloadRequired(WarehouseState, true))
  //          this.toastService.success('Updated Successfully', 'Store')
  //          this.onCloseDialog();
  //        }
  //      );
  //  } else {
  //    delete this.warehouse.id;
  //    this.ngxsService.warehouseService.addWarehouse(this.warehouse)
  //    .pipe(
  //      take(1),
  //       finalize(() => {
  //        this.isLoading = false;
  //        this.cdRef.detectChanges();
  //       })
  //     )
  //      .subscribe(() => {          
  //          this.ngxsService.store.dispatch(new IsReloadRequired(WarehouseState, true))
  //          this.toastService.success('Created Successfully', 'Store')
  //          this.onCloseDialog();
  //        }
  //      );
  //  }
 }
// map form values to the warehouse model
 mapFormValueToClientModel() {
  //  this.ApplicantAssessmentCriteria.facultyId = this.ApplicantAssessmentCriteriaForm.value.faculty;
  //  this.ApplicantAssessmentCriteria.AcademicDepartment = this.ApplicantAssessmentCriteriaForm.value.AcademicDepartment;
 }

  reset() {
    this.formDirective.resetForm();
  }

  addBudgetLines(): FormGroup {
  return this.fb.group({
    description: ['', [Validators.required]],
    criteria: ['', [Validators.required]],
    nature: ['', [Validators.required]],
    default: ['', [Validators.required]],
    radio: [0, [Validators.required]],
  });
  }

  //Add Lines
  addLineClick(): void {
    const controls = this.ApplicantAssessmentCriteriaForm.controls.addApplicantLines as FormArray;
    controls.push(this.addBudgetLines());
    this.table.renderRows();
    this.cdRef.detectChanges()
  }

  removeLineClick(budgetLineIndex: number): void {
    const budgetLineArray = this.ApplicantAssessmentCriteriaForm.get('addApplicantLines') as FormArray;
    budgetLineArray.removeAt(budgetLineIndex);
    budgetLineArray.markAsDirty();
    budgetLineArray.markAsTouched();
    this.table.renderRows();
    this.cdRef.detectChanges();
  }

  selectionChangeEvent(event:any, index:number ){
    this.ApplicantAssessmentCriteriaForm.get('addApplicantLines')['controls'][0].value.nature;
  }

  onItemChange(selectedValue: string) {
    this.selectedValue = selectedValue;
    console.log(" Value is : ", selectedValue);
    return this.selectedValue;
  }

  methodChange(event: MatRadioChange, i){
    console.log(event.value, 'this is event');
    console.log(i, 'this is index');
    // this.ApplicantAssessmentCriteriaForm.get('addApplicantLines')['controls'][i].value.radio = event.value
  }

  // selectionRadioEvent(event :MatRadioChange , i:number){
  //   console.log(event.value, 'this is event');
  //   console.log(i, 'this is index');
  //   // this.ApplicantAssessmentCriteriaForm.get('addApplicantLines')['controls'][i].value.radio = ''
  // }

}

