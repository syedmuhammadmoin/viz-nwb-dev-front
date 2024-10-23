import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { TaxService } from '../../profiling/tax/service/tax.service';
import { ITax } from '../../profiling/tax/model/ITax';
import { lastValueFrom } from 'rxjs';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { AppConst } from 'src/app/views/shared/AppConst';
import { environment } from 'src/environments/environment';
import { AccountingService } from './service/accounting.service';
import { CurrencyService } from '../../finance/Currency/service/currency.service';
import { ICurrency } from '../../finance/Currency/model/ICurrency';

@Component({
  selector: 'vl-accounting',
  templateUrl: './accounting.component.html',
  styleUrl: './accounting.component.scss'
})
export class AccountingComponent extends AppComponentBase implements OnInit {
  
  form : FormGroup;
  model : IAccountingSettingModel;
  isLoading : boolean;
  currencyList : ICurrency[];
  taxList : ITax[];
  PeriodicityList = AppConst.Periodicity;
  MonthList = AppConst.Months;
  isCashBasisChecked: boolean = false;
  ShowAvatax :boolean = false;
  
  constructor(private injector : Injector,
    private fb : FormBuilder,
    public ngxsService : NgxsCustomService,
    private taxService : TaxService,
    private service : AccountingService,
    private currencyService : CurrencyService
  ) {super(injector)

  }
  ngOnInit(): void {
   this.form = this.fb.group({
    salesTaxId : [null],
    purchaseTaxId : [null], 
    periodicity : [null],
    journalAccountId : [null],
    reminder : [null],   
    roundPerLine : [true],
    roundGlobally : [false],
    europeVAT : [false],
    countryId : [null],   
    lastMonth : [12],
    lastDay : [31],
    dynamicReports : [true],
    thresholdDate : [null],
    taxCashBasisId : [""],
    baseTaxReceivedAccountId : [null],  
    isAvatax:[true],
    caseBasis : [true],
    environment : [null],
    apiId : [null],
    apiKey : [null],
    companyCode : [null],
    useUPC : [false],
    commitTransactions : [false],
    addressValidation : [null],
    currencyId :[null]
   })
   
   this.getTaxes();
   this.getCurrencies();   
   this.ngxsService.getOtherAccountsFromState();
   this.ngxsService.getCountryFromState();
   this.ngxsService.getCountryFromState();
   this.getAccountingSetting(1);
  }
getAccountingSetting(id : number){
lastValueFrom(this.service.getById(id)).then( res=> {
 this.form.patchValue(res.result);
 this.ShowAvatax = res.isAvatax;
 this.isCashBasisChecked = res.caseBasis; 
 this.IsShowAvaTax();
 this.ShowCashBasis();
 console.log(res.result,"get response");
 
})
}
  getTaxes(){
    lastValueFrom(this.taxService.getTaxes()).then(res => {
       this.taxList = res.result
    })
    }

  onSubmit(){
    this.model = this.form.value; 
    console.log(this.form.value,"Form");
    
    lastValueFrom(this.service.add(this.model)).then(res => {
      console.log(res.result);    
    })
    
    
  }
  reset()
  {

  }
  ShowCashBasis(){
    this.isCashBasisChecked = !this.isCashBasisChecked
    console.log(this.isCashBasisChecked,"CheckSCash");
    
  }
  IsShowAvaTax(){
    this.ShowAvatax = !this.ShowAvatax;
    console.log(this.ShowAvatax,"CheckSAvtax");
  }
getCurrencies(){
  lastValueFrom(this.currencyService.getCurrencyes()).then(res => {
    this.currencyList = res.result
  })
}

}


export interface IAccountingSettingModel{
  salesTaxId : boolean;
    purchaseTaxId : boolean;
    periodicity : boolean;
    journalAccountId : boolean;
    reminder : number;  
    roundPerLine : boolean;
    roundGlobally : boolean;
    europeVAT : boolean;
    countryId : number;   
    lastMonth : number;
    lastDay : number;
    dynamicReports : boolean
    thresholdDate : string;
    taxCashBasisId : string;
    baseTaxReceivedAccountId : number;  
    environment : string;
    apiId : string;
    apiKey : string;
    companyCode : string;
    useUPC : boolean;
    isAvatax: boolean;
    commitTransactions : boolean;
    addressValidation : boolean;
    currencyId:number;
    caseBasis : boolean;
}