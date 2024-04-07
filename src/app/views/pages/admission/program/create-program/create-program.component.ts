import {ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {AppConst} from 'src/app/views/shared/AppConst';
import {Permissions} from 'src/app/views/shared/AppEnum';
import {ProgramService} from '../service/program.service';
import {AddModalButtonService} from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import {NgxsCustomService} from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import {FirstDataRenderedEvent, RowDoubleClickedEvent} from 'ag-grid-community';
import {IProgram, ISemesterCoursesList} from '../models/IProgram';
import {finalize, take} from 'rxjs/operators';
import {PROGRAM} from '../../../../shared/AppRoutes';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'kt-create-program',
  templateUrl: './create-program.component.html',
  styleUrls: ['./create-program.component.scss']
})
export class CreateProgramComponent extends AppComponentBase implements OnInit {

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  currentIndex = 0

  searchText: string;

  allCources: any = [
    {
      name: 'Semester 1',
      courses: [
        {
          coursesName: 'Math',
          selected: false
        },
        {
          coursesName: 'English',
          selected: false
        },
        {
          coursesName: 'PakStudy',
          selected: false
        }
      ]
    },


  ]

  semesters = [
    {
      id: 1,
      name: 'One',
    },
    {
      id: 2,
      name: 'Two',
    },
    {
      id: 3,
      name: 'Three',
    },
    {
      id: 4,
      name: 'Four',
    },
    {
      id: 5,
      name: 'Five',
    },
    {
      id: 6,
      name: 'Six',
    },
    {
      id: 7,
      name: 'Seven',
    },
    {
      id: 8,
      name: 'Eight',
    },
  ]

  totalSemester = 1;

  // Declaring form variable
  programForm: FormGroup;

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // Payroll Model
  programModel: IProgram = {} as IProgram;

  // warehouseList: any = new BehaviorSubject<any>([])

  title = 'Create Program'

  isActiveChecked = true;

  // depApplicabilityToggle = false;

  // switch
  userStatus = 'Active'

  valueTitle = 'Value'

  // isModelType =  false;

  // show toast mesasge of on campus select
  showMessage = false;

  // per product cost
  // perProductCost : number;

  // show Buttons
  showButtons = true;

  // depreciation method
  method = AppConst.depreciationMethod;

  // for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // For Table Columns
  displayedColumns = ['semesterNumber', 'courseId', 'action']

  // Validation messages..
  validationMessages = {
    name: {
      required: 'Name is required.',
    },
    academicDepartmentId: {
      required: 'Department is required.',
    },
    totalSemesters: {
      required: 'Semester is required.',
    },
    degreeId: {
      required: 'courses is required.',
    }
  };

  // error keys..
  formErrors: any = {
    name: '',
    academicDepartmentId: '',
    totalSemesters: '',
    degreeId: '',

  };

  // Injecting in dependencies in constructor
  constructor(
    private fb: FormBuilder,
    private programService: ProgramService,
    public addButtonService: AddModalButtonService,
    public ngxsService: NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    // Creating Forms
    this.programForm = this.fb.group({
      name: ['', [Validators.required]],
      degreeId: ['', [Validators.required]],
      academicDepartmentId: ['', [Validators.required]],
      totalSemesters: ['', [Validators.required]],
      semesterCoursesList: this.fb.array([
        this.addCoursesLines()
      ])
    });


    // get Accounts from Accounts State

    this.ngxsService.getDegreeFromState();
    this.ngxsService.getAcademicDepartmentsFromState();
    this.ngxsService.getCoursesFromState();
    this.ngxsService.getDegreeFromState();


    this.activatedRoute.queryParams.subscribe((res) => {
      const isProgram = res.isProgram
      this.programModel.id = res.q;
      if (this.programModel.id) {
        this.title = 'Edit Program'
        this.isLoading = true;
        this.getProgram(this.programModel.id);
      }
    })
  }

  // Form Reset
  reset() {
    this.formDirective.resetForm();
    // this.depApplicabilityToggle = false
  }

  // Get CWIP data from Api
  private getProgram(id: number) {
    this.programService.getById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.programModel = res.result;
        this.patchProgram(res.result);
      });
  }

  // Edit Program Method
  public patchProgram(Program: IProgram) {
    this.programForm.patchValue({
      name: Program.name,
      degreeId: Program.degreeId,
      academicDepartmentId: Program.academicDepartmentId,
      totalSemesters: Program.totalSemesters,
    });
    this.programForm.setControl('semesterCoursesList', this.patchProgramLines(Program.semesterCourseList))
  }

  patchProgramLines(lines: ISemesterCoursesList[]): FormArray {
    const formArray = new FormArray([]);
    lines.forEach((line: ISemesterCoursesList) => {
      formArray.push(this.fb.group({
        id: line.id,
        semesterNumber: line.semesterNumber,
        courseId: line.courseId,
      }))
    })
    return formArray
  }


  // Submit Form Function
  onSubmit(): void {
    if (this.programForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.mapFormValuesToProgramModel();

    if (this.programModel?.id) {
      this.programService.update(this.programModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res) => {
          this.toastService.success('Updated Successfully', 'Program')
          this.cdRef.detectChanges();
          this.router.navigate(['/' + PROGRAM.LIST])
        })

    } else {
      delete this.programModel.id;

      this.programService.create(this.programModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res) => {
            this.toastService.success('Created Successfully', 'Program')
            this.router.navigate(['/' + PROGRAM.LIST])
          }
        );
    }
  }


  // Mapping Form Value to Model
  mapFormValuesToProgramModel() {
    this.programModel.name = this.programForm.value.name;
    this.programModel.degreeId = this.programForm.value.degreeId;
    this.programModel.academicDepartmentId = this.programForm.value.academicDepartmentId;
    this.programModel.totalSemesters = this.programForm.value.totalSemesters;
    this.programModel.semesterCourseList = this.programForm.value.semesterCoursesList;
  }

  // for save or submit
  isSubmit(val: number) {
    // this.cwipModel.isSubmit = (val === 0) ? false : true;
  }


  // Add Grn Line
  addProgramLineClick(): void {
    const controls = this.programForm.controls.semesterCoursesList as FormArray;
    controls.push(this.addCoursesLines());
    this.table.renderRows();
  }


  addCoursesLines(): FormGroup {
    return this.fb.group({
      semesterNumber: ['', [Validators.required]],
      courseId: ['', [Validators.required]],
    });
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    // this.router.navigate(['/' + INVOICE.ID_BASED_ROUTE('details', event.data.id)]);
  }

  removeProgramLineClick(i) {
    const semesterCoursesList = this.programForm.get('semesterCoursesList') as FormArray;
    semesterCoursesList.removeAt(i);
    semesterCoursesList.markAsDirty();
    semesterCoursesList.markAsTouched();
    this.table.renderRows();
  }
}
