import { ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import { ActivatedRoute, Params} from "@angular/router";
import { GridOptions} from "ag-grid-community";
import { DomSanitizer} from "@angular/platform-browser";
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { PayrollTransactionService } from '../service/payroll-transaction.service';
import { IPayrollTransaction } from '../model/IPayrollTransaction';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';

@Component({
  selector: 'kt-print-payroll-transaction',
  templateUrl: './print-payroll-transaction.component.html',
  styleUrls: ['./print-payroll-transaction.component.scss']
})

export class PrintPayrollTransactionComponent extends AppComponentBase implements OnInit {

  gridOptions: GridOptions;
  payrollTransactionMaster: IPayrollTransaction | any;
  payrollTransactionLines: any

  constructor( private payrollTransactionService: PayrollTransactionService,
               private activatedRoute: ActivatedRoute,
               private cdRef: ChangeDetectorRef,
               public sanitizer: DomSanitizer,
               injector : Injector
             ) { super(injector) }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if(id){
        this.getPayrollTransactionData(id);
      }
    });
  }  

  printDiv(divName : any) {
    const printContents = document.getElementById(divName).innerHTML;
    window.document.body.innerHTML = printContents
    window.document.append('<link rel="stylesheet" href="print-invoice.component.scss">')
    window.print();
    window.document.close();
  }

  getPayrollTransactionData(id: number){
    this.payrollTransactionService.getPayrollTransactionById(id).subscribe((res: IApiResponse<IPayrollTransaction> | any) => {
        this.payrollTransactionMaster = res.result;
        this.payrollTransactionLines = res.result.payrollTransactionLines;
        this.cdRef.markForCheck();
      })
  }
}



