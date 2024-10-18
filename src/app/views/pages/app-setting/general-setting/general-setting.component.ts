import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';

@Component({
  selector: 'vl-general-setting',
  templateUrl: './general-setting.component.html',
  styleUrl: './general-setting.component.scss'
})
export class GeneralSettingComponent extends AppComponentBase implements OnInit {

  form : FormGroup;
  isLoading : boolean;  

  constructor(injector : Injector,
    private fb : FormBuilder
  ){super(injector)}
  ngOnInit(): void {
    this.form = this.fb.group({
      headerColor : [null],
      buttonColor : [null],
      comTransactions : [false]
    })
  }

  onSubmit(){    
    console.log(this.form,"form");  
  }
  reset(){

  }

}
