import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { IProgram} from '../model/Iprogram';
import { ICourses} from '../model/ICourses';
import { ProgramService } from '../service/program.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { Router } from '@angular/router';
import { FirstDataRenderedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'kt-create-program',
  templateUrl: './create-program.component.html',
  styleUrls: ['./create-program.component.scss']
})
export class CreateProgramComponent extends AppComponentBase implements OnInit{

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  currentIndex = 0

  searchText: string;

  allCources: any = [
    { name : "Semester 1",
    courses : [
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

semester  = [ 
  { id : 1,
    name : 'One',
  },
  { id : 2,
    name : 'Two',
  },
  { id : 3,
    name : 'Three',
  },
  { id : 4,
    name : 'Four',
  },
]

totalSemester = 1;

  // Declaring form variable
  programForm: FormGroup;

    /** The selection for checklist */
    checklistSelection = new SelectionModel<any>(true /* multiple */);

  // Getting Table by id
  @ViewChild('table', { static: true }) table: any;

  // Payroll Model
  programModel: IProgram = {} as IProgram;

  // warehouseList: any = new BehaviorSubject<any>([])

  title: string = 'Create Program'

  isActiveChecked = true;

  // depApplicabilityToggle = false;

  // switch
  userStatus = 'Active'

  valueTitle: string = 'Value'

  // isModelType =  false;

   //show toast mesasge of on campus select
   showMessage: boolean = false;

   // per product cost
  // perProductCost : number;

  //show Buttons
  showButtons: boolean = true;

  //depreciation method
  method = AppConst.depreciationMethod;

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

    // For Table Columns
    displayedColumns = ['courcesList']

  // Validation messages..
  validationMessages = {

    name : {
      required: 'Name is required.',
    },
    department : {
      required: 'Department is required.',
    },                        
    semester : {
      required: 'Semester is required.',
    },                        
    cources : {
      required: 'cources is required.',
    }
  };

  // error keys..
  formErrors = {
    name : '',
    department : '',                        
    semester : '',                        
    cources : '',
    
  };

  // Injecting in dependencies in constructor
  constructor(private fb: FormBuilder,
    private programService: ProgramService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateProgramComponent>,
    public dialog: MatDialog,
    public addButtonService: AddModalButtonService,
    public ngxsService: NgxsCustomService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    // Creating Forms
    this.programForm = this.fb.group({
      name:['', [Validators.required]],
      department: ['', [Validators.required]],
      semester: ['', [Validators.required]],
      cources: this.fb.array([
        this.addCourcesLines()
      ])
    });

    

    //get Accounts from Accounts State

    this.ngxsService.getDepreciationModelFromState()
    this.ngxsService.getOtherAccountsFromState();
    this.ngxsService.getAssetAccountFromState();
    this.ngxsService.getProductFromState();
    this.ngxsService.getWarehouseFromState();

    if (this.data?.id) {
      this.title = 'Edit Capital Work In progress'
      this.programModel.id = this.data.id;
      this.isLoading = true;
      this.getCwip(this.data.id);
    }

  }

  // Form Reset
  reset() {
    this.formDirective.resetForm();
    // this.depApplicabilityToggle = false
  }

  //Get CWIP data from Api
  private getCwip(id: number) {
    // this.cwipService.getCwipById(id)
    //   .pipe(
    //     take(1),
    //     finalize(() => {
    //       this.isLoading = false;
    //       this.cdRef.detectChanges();
    //     })
    //   )
    //   .subscribe((res) => {
    //     this.cwipModel = res.result;
    //     this.patchCwip(res.result);
    //     this.getCost(res.result.cost)
    //     this.depApplicabilityToggle = res.result.depreciationApplicability;
    //   });
  }

  //Edit CWIP Method
  public patchProgram(Program: IProgram | any) {
    this.programForm.patchValue({
      dateOfAcquisition: Program.dateOfAcquisition,
      name: Program.name,
      cwipAccountId:Program.cwipAccountId,
      cost:Program.cost,
      assetAccountId:Program.assetAccountId,
      salvageValue:Program.salvageValue,
      productId: Program.productId,
      warehouseId: Program.warehouseId,
      depreciationApplicability:Program.depreciationApplicability,
      depreciationModelId:Program.depreciationModelId,
      modelType:Program.modelType,
      depreciationExpenseId:Program.depreciationExpenseId,
      accumulatedDepreciationId:Program.accumulatedDepreciationId,
      useFullLife:Program.useFullLife,
      quantity:Program.quantity,
      decLiningRate:Program.decLiningRate,
      prorataBasis: Program.prorataBasis,
      isActive:Program.isActive 
    });
    // this.onChangeDepApplicability({checked : cwip.depreciationApplicability})
    // this.getModelType(cwip.modelType)
    // this.onCampusSelected(cwip.productId)
  }


  //Submit Form Function
  onSubmit(): void {

    // if (this.cwipForm.invalid) {
    //   return;
    // }

    // this.isLoading = true;
    // this.mapFormValuesTocwipModel();

    // if (this.data?.id) {
    //   console.log("edit")
    //   this.cwipService.updateCwip(this.cwipModel)
    //     .pipe(
    //       take(1),
    //       finalize(() => {
    //         this.isLoading = false;
    //         this.cdRef.detectChanges();
    //       })
    //     )
    //     .subscribe((res: IApiResponse<ICwip>) => {
    //       this.toastService.success('Updated Successfully', 'CWIP')
    //       this.onCloseDialog();
    //       this.cdRef.detectChanges();
    //       this.router.navigate(['/' + CWIP.LIST])
    //     })

    // } else {
    //   delete this.cwipModel.id;

    //   this.cwipService.createCwip(this.cwipModel)
    //     .pipe(
    //       take(1),
    //       finalize(() => {
    //         this.isLoading = false;
    //         this.cdRef.detectChanges();
    //       })
    //     )
    //     .subscribe((res: IApiResponse<ICwip>) => {
    //       this.toastService.success('Created Successfully', 'CWIP')
    //       this.onCloseDialog();
    //       this.router.navigate(['/' + CWIP.LIST])
    //       //this.router.navigate(['/' + PAYROLL_ITEM.LIST])
    //     }
    //     );
    // }
  }





  //Mapping Form Value to Model
  mapFormValuesTocwipModel() {
    // this.cwipModel.dateOfAcquisition =  this.dateHelperService.transformDate(this.cwipForm.value.dateOfAcquisition, 'yyyy-MM-dd'),
    // this.cwipModel.name = this.cwipForm.value.name,
    // this.cwipModel.cwipAccountId = this.cwipForm.value.cwipAccountId
    // this.cwipModel.cost = this.cwipForm.value.cost,
    // this.cwipModel.assetAccountId = this.cwipForm.value.assetAccountId,
    // this.cwipModel.salvageValue = (this.cwipForm.value.salvageValue) ? this.cwipForm.value.salvageValue : 0,
    // this.cwipModel.productId = this.cwipForm.value.productId,
    // this.cwipModel.warehouseId = this.cwipForm.value.warehouseId,
    // this.cwipModel.depreciationApplicability = this.cwipForm.value.depreciationApplicability,
    // this.cwipModel.depreciationModelId = this.cwipForm.value.depreciationModelId,
    // this.cwipModel.modelType = this.cwipForm.value.modelType,
    // this.cwipModel.depreciationExpenseId = this.cwipForm.value.depreciationExpenseId,
    // this.cwipModel.accumulatedDepreciationId = this.cwipForm.value.accumulatedDepreciationId,
    // this.cwipModel.useFullLife = this.cwipForm.value.useFullLife,
    // this.cwipModel.quantity = this.cwipForm.value.quantity,
    // this.cwipModel.decLiningRate = this.cwipForm.value.decLiningRate,
    // this.cwipModel.prorataBasis =  this.cwipForm.value.prorataBasis,
    // this.cwipModel.isActive = this.cwipForm.value.isActive 
  }

  getSemesters(count : any){
    // console.log(count.value);
    // this.totalSemester = count.value
    this.addGRNLineClick(count.value)  
}



  onRoleChange(FirstIndes: number, $event: MatCheckboxChange , secondIndex : number ) {
    
    // console.log(this.allCources[FirstIndes].courses[secondIndex].selected = $event.checked + ' value ');
    
    
    
    this.allCources[FirstIndes].courses[secondIndex].selected = $event.checked
    console.log(this.allCources);
  }


  //for save or submit
  isSubmit(val: number) {
    // this.cwipModel.isSubmit = (val === 0) ? false : true;
  }

  
  //Add Grn Line
  addGRNLineClick(semester : number): void {
    let count = 0;
    let arr = ''

    const controls = this.programForm.controls.cources as FormArray;
    if(semester > controls.length){
      count = semester - controls.length
      for (let i = 0; i < count; i++) {
        this.allCources.push(this.allCources[0])
        controls.push(this.addCourcesLines());
      }
    }
    if(semester < controls.length){
      count = controls.length - semester;
      for (let i = controls.length -1; i >= semester; i--) {
        this.allCources.pop()
        controls.removeAt(i);
      }
      
    }
    // controls.clear()
    console.log(this.allCources);
   
    this.table.renderRows();
  }



  addCourcesLines(): FormGroup {
    return this.fb.group({
      listofCources: [[], [Validators.required]],
    });
  }

    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(node : any): void {
      this.checklistSelection.toggle(node);
    }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    //this.router.navigate(['/' + INVOICE.ID_BASED_ROUTE('details', event.data.id)]);
  }




  // Dialogue close function
  onCloseDialog() {
    this.dialogRef.close();
  }

}
