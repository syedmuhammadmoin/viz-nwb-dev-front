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
export class GridFilterationComponent implements OnInit {
      //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;
  @Output() MonthYear:EventEmitter<IFilterationModel> =new EventEmitter<IFilterationModel>();

  FilterationForm: FormGroup;
  months = AppConst.Months;
  Model: IFilterationModel = {} as IFilterationModel; 
  year: number;
  month: number;

  formErrors = { 
    month: '',
    year: ''
  };

  constructor(
    private fb: FormBuilder,
  ) {
    
   }

  ngOnInit(): void {
    this.FilterationForm = this.fb.group({     
      month: [''],
      year: [''],
      
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
    this.Model.year = this.FilterationForm.value.year;
    this.Model.month = this.FilterationForm.value.month;
    
  }
  
  sendData(){
    console.log(this.FilterationForm,"FilterationForm");
    
    this.MonthYear.emit(this.Model)
  }
  
}
