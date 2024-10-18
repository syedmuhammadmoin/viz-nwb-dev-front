import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';

@Component({
  selector: 'vl-create-fiscal-year',
  templateUrl: './create-fiscal-year.component.html',
  styleUrl: './create-fiscal-year.component.scss'
})
export class CreateFiscalYearComponent extends AppComponentBase implements OnInit {

  form : FormGroup;
  title : string = 'Create Fiscal Year';
  isLoading : boolean;

  validationMessages = {
    name: {
      required: 'Name is required.',
    },  
  }

  // Error keys..
  formErrors: { [key: string]: string } = {  
    name: '',
  }

  constructor(injector : Injector,
    private fb: FormBuilder
  ){super(injector)}

  ngOnInit(): void {
    this.form = this.fb.group({
      startDate : [null],
      endDate : [null],
      name : [null,[Validators.required]],
      company : [null]
    })
  }

  onSubmit(){
    if (this.form.invalid) {
      this.toastService.error("Please fill all required fields!", "Journal")
      return;
    }
    console.log(this.form);
    
  }
  reset(){

  }
 

}
export interface IFiscalYearModel{
  name : string;
  startDate : string;
  endDate : string;
  company : string;
}