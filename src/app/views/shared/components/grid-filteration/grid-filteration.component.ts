import { Component, Injector, OnInit, ViewChild , EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
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
    this.Model.startDate =  this.transformDate(this.FilterationForm.value.startDate, 'yyyy-MM-dd') || '';
    this.Model.endDate = this.transformDate(this.FilterationForm.value.endDate, 'yyyy-MM-dd') || '';
  }
  
  sendData(){
    this.MonthYear.emit(this.Model)
  }
}
