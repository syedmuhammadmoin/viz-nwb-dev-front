import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild , EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { FirstDataRenderedEvent, GridOptions} from 'ag-grid-community';
import { MatDialog} from "@angular/material/dialog";
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { isEmpty } from 'lodash';
import { finalize, take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { IFilterationModel } from './FilterationModel';

@Component({
  selector: 'kt-grid-filteration',
  templateUrl: './grid-filteration.component.html',
  styleUrls: ['./grid-filteration.component.scss']
})
export class GridFilterationComponent extends AppComponentBase implements OnInit {
      //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;
  @Output() MonthYear:EventEmitter<IFilterationModel> =new EventEmitter<IFilterationModel>();

  FilterationForm: FormGroup; 
  Model: IFilterationModel = {} as IFilterationModel; 
  dateCondition : boolean;

   //Limit Date
   maxDate: Date = new Date();
   minDate: Date

  formErrors = {   
    startDate:'',
    endDate:'',

  };

  constructor(
    private fb: FormBuilder,
    injector: Injector
  ) {
    super(injector)
  }

  ngOnInit(): void {
    this.FilterationForm = this.fb.group({         
      startDate: [''],
      endDate: [''],
      
    })
     //handling dueDate logic
     this.FilterationForm.get('startDate').valueChanges.subscribe((value) => {
      this.minDate = new Date(value);
      this.dateCondition = this.FilterationForm.get('endDate').value < this.FilterationForm.get('startDate').value
    })
  }
  resetForm(){    
    this.formDirective.resetForm();  
    window.location.reload();
    
  }
  GetFilteredRecord() {      
    this.mapFormValuesToFilterationModel() 
    this.sendData()
    
  } 
   //Mapping Form Values To Model 
   mapFormValuesToFilterationModel() {       
    this.Model.startDate =  this.transformDate(this.FilterationForm.value.startDate, 'yyyy-MM-dd');
    this.Model.endDate = this.transformDate(this.FilterationForm.value.endDate, 'yyyy-MM-dd');
    
  }
  
  sendData(){
    console.log(this.FilterationForm,"FilterationForm");
    
    this.MonthYear.emit(this.Model)
  }
  
}
