import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { TaxService } from '../../profiling/tax/service/tax.service';
import { ITax } from '../../profiling/tax/model/ITax';
import { lastValueFrom } from 'rxjs';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { AppConst } from 'src/app/views/shared/AppConst';

@Component({
  selector: 'vl-accounting',
  templateUrl: './accounting.component.html',
  styleUrl: './accounting.component.scss'
})
export class AccountingComponent extends AppComponentBase implements OnInit {
  
  form : FormGroup;
  isLoading : boolean;
  taxList : ITax[];
  PeriodicityList = AppConst.Periodicity;
  MonthList = AppConst.Months;
  
  constructor(private injector : Injector,
    private fb : FormBuilder,
    public ngxsService : NgxsCustomService,
    private taxService : TaxService,
  ) {super(injector)

  }
  ngOnInit(): void {
   this.form = this.fb.group({
    salesTaxId : [null],
    purchaseTaxId : [null],
    prices : [null],
    periodicity : [null],
    journalAccountId : [null],
    reminder : [null],
    journal : [null],
    roundPerLine : [true],
    roundGlobally : [false],
    europeVAT : [false],
    fiscalCountry : [1],
    currency : [null],
    lastMonth : [12],
    lastDay : [31],
    dynamicReports : [true],
    thresholdDate : [null],
    taxCashbaseId : [null],
    BaseTaxReceivedAccountId : [null]
   })

   this.getTaxes();
   this.ngxsService.getOtherAccountsFromState();
   this.ngxsService.getCountryFromState();
   this.ngxsService.getCountryFromState();
  }

  getTaxes(){
    lastValueFrom(this.taxService.getTaxes()).then(res => {
       this.taxList = res.result
    })
    }

  onSubmit(){
    console.log(this.form,"Form");
    
  }
  reset()
  {

  }



}
