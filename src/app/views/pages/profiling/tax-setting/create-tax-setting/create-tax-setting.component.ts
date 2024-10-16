import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { TaxsettingService } from '../service/taxsetting.service';
import { TaxService } from '../../tax/service/tax.service';
import { lastValueFrom } from 'rxjs';
import { ITax } from '../../tax/model/ITax';
import { AppConst } from 'src/app/views/shared/AppConst';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { ITaxSettingModel } from '../model/ITaxSettingModel';

@Component({
  selector: 'vl-create-tax-setting',
  templateUrl: './create-tax-setting.component.html',
  styleUrl: './create-tax-setting.component.scss'
})
export class CreateTaxSettingComponent extends AppComponentBase implements OnInit {



  title = 'Tax Setting'
  isLoading = false;
  form: FormGroup;
  model : ITaxSettingModel;
  taxList : ITax[]
  PeriodicityList = AppConst.Periodicity;


  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private service: TaxsettingService,
    public ngxsService : NgxsCustomService,
    private taxService : TaxService,
    public route: ActivatedRoute,
  ) { super(injector) }

  ngOnInit(): void {

    this.route.queryParams.subscribe((param: Params) => {
      const id = param.q;      
      if (id) {
        this.title = 'Edit Tax'
        this.getTax(id);
      }
    })

    this.form = this.fb.group({
      salesTaxId : [null],
      purchaseTaxId : [null],
      periodicity : [null],
      remindPeriod : [null],
      journalAccountId : [null],
      roundPerLine : [false],
      roundGlobally : [false],
      europeVAT : [false],
      countryId : [null]
    })

    this.getTaxes();
    this.ngxsService.getOtherAccountsFromState();
    this.ngxsService.getCountryFromState();
    lastValueFrom(this.service.getById(1)).then(res => {
     this.form.patchValue(res.result)
      
    })
  }
  getTaxes(){
  lastValueFrom(this.taxService.getTaxes()).then(res => {
     this.taxList = res.result
  })
  }
  onSubmit(){
    this.model = this.form.value;
    lastValueFrom(this.service.add(this.model)).then(res => {
      console.log(res.result);    
    })
    
  }
  reset(){
 
  }

  getTax(id : number){
    lastValueFrom(this.taxService.getTax(id)).then(res => {
      this.form.patchValue(res.result)
    })
  }
}
