import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '../../app-component-base';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { NgxsCustomService } from '../../services/ngxs-service/ngxs-custom.service';
import { IFinanceFilteration } from './FinanceFilterationModel';

@Component({
  selector: 'kt-finance-grid-filteration',
  templateUrl: './finance-grid-filteration.component.html',
  styleUrls: ['./finance-grid-filteration.component.scss']
})
export class FinanceGridFilterationComponent extends AppComponentBase implements OnInit  {

      //for resetting form
      @ViewChild('formDirective') private formDirective: NgForm;
      @Output() MonthYear:EventEmitter<IFinanceFilteration> = new EventEmitter<IFinanceFilteration>();
    
      FilterationForm: FormGroup; 
      Model: IFinanceFilteration = {} as IFinanceFilteration; 
      dateCondition : boolean;
    
       //Limit Date
       maxDate: Date = new Date();
       minDate: Date
    
      constructor(
        private fb: FormBuilder,
        injector: Injector,
        public ngxsService:NgxsCustomService,
      ) {
        super(injector)
      }
    
      ngOnInit(): void {
        this.FilterationForm = this.fb.group({         
          startDate: [''],
          endDate: [''],
          businessPartnerName: [''],
        })
          //Get Data From Store
         this.ngxsService.getAllBusinessPartnerFromState();        
        
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
        this.sendData();
      } 
       //Mapping Form Values To Model 
       mapFormValuesToFilterationModel() {    
        this.Model.startDate =  this.transformDate(this.FilterationForm.value.startDate, 'yyyy-MM-dd') || '';
        this.Model.endDate = this.transformDate(this.FilterationForm.value.endDate, 'yyyy-MM-dd') || '';
        this.Model.businessPartnerName = this.FilterationForm.value.businessPartnerName || '';
      }
      
      sendData(){
        this.MonthYear.emit(this.Model)
      }
    }
    