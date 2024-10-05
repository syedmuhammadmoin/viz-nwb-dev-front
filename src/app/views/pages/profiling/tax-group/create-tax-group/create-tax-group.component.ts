import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ITaxGroupModel } from '../model/ITaxGroupModel';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateCountryComponent } from '../../../admission/country/create-country/create-country.component';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { TaxGroupService } from '../service/tax-group.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'vl-create-tax-group',
  standalone: false,
  templateUrl: './create-tax-group.component.html',
  styleUrl: './create-tax-group.component.scss'
})
export class CreateTaxGroupComponent extends AppComponentBase implements OnInit {

 
  @ViewChild('formDirective') private formDirective: NgForm;
  model : ITaxGroupModel;
  form : FormGroup
  showButtons = true;
  isLoading: boolean;
  title = 'Create Tax Group';


  formErrors: any = {
    name: '',
  };
  validationMessages = {
    name: {
      required: 'Group Name is required.',
    },
  };



  constructor(private fb : FormBuilder,injector:Injector,
    public addButtonService: AddModalButtonService,
    private _service : TaxGroupService,
    private dialog : MatDialog,
    public dialogRef: MatDialogRef<CreateTaxGroupComponent>,
    public ngxsService : NgxsCustomService
  ){ super(injector)}


  ngOnInit() {
  this.form = this.fb.group({
    id:[0],
    name:['',[Validators.required]],
    countryId : [''],
    company : [''],
    sequence : [''],
    payableAccountid : ['']  ,
    receivableAccountid : [''],
    advanceAccountid : [''],
    preceedingTtl : ['']
  })


  this.ngxsService.getOtherAccountsFromState();
  this.ngxsService.getCountryFromState();
  }
  CreateCountyModal() {   
   this.dialog.open(CreateCountryComponent)
  }
  reset(){
    this.formDirective.resetForm();   
  }
  onSubmit(){
    this.model = this.form.value;    
    lastValueFrom(this._service.add(this.model)).then(res => {
      this.dialogRef.close();
    })  
  }
  onCloseDialog() {
    this.dialogRef.close();
  }
  
}
