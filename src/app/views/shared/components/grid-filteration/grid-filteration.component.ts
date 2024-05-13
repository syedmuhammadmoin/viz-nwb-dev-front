import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
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

@Component({
  selector: 'kt-grid-filteration',
  templateUrl: './grid-filteration.component.html',
  styleUrls: ['./grid-filteration.component.scss']
})
export class GridFilterationComponent implements OnInit {

  months = AppConst.Months
  FilterationForm: FormGroup;

  formErrors = { 
    month: '',
    year: ''
  };
    //for resetting form
    @ViewChild('formDirective') private formDirective: NgForm;
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
    console.log("Reset Form");
    
  }
  createProcess() {

    console.log();
    
  }
  
}
