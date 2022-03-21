import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params} from "@angular/router";
import { InvoiceService} from "../services/invoice.service";
import { GridOptions} from "ag-grid-community";
import { DomSanitizer} from "@angular/platform-browser";
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IInvoice } from '../model/IInvoice';

@Component({
  selector: 'kt-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PrintInvoiceComponent implements OnInit {

  gridOptions: GridOptions;
  invoiceMaster: any;
  invoiceLines: any;

  constructor( private invoiceService: InvoiceService,
               private activatedRoute: ActivatedRoute,
               private cdr: ChangeDetectorRef,
               public sanitizer: DomSanitizer
             ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if(id){
        this.getInvoiceData(id);
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

  getInvoiceData(id: number){
    this.invoiceService.getInvoiceById(id).subscribe((res: IApiResponse<IInvoice>) =>
      {
        console.log(res.result)
        this.invoiceMaster = res.result;
        this.invoiceLines = res.result.invoiceLines;
        this.cdr.markForCheck();
      })
  }
}
