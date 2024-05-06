import { FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PermissionService } from '../pages/auth/service/permission.service';
import { DateHelperService } from './helpers/date-helper';
import { PaginationHelperService } from './pagination/pagination-helper.service';
import { DocType } from './AppEnum';
import {
  BILL,
  CREDIT_NOTE,
  DEBIT_NOTE, DISPOSAL,
  GOODS_RECEIVED_NOTE,
  GOODS_RETURN_NOTE,
  INVOICE,
  JOURNAL_ENTRY,
  PAYMENT,
  PAYROLL_TRANSACTION,
  PURCHASE_ORDER,
  RECEIPT,
  PETTY_CASH
} from './AppRoutes';
import { Router } from '@angular/router';

export abstract class AppComponentBase {
  datePipe: DatePipe
  toastService: ToastrService
  permission: PermissionService
  paginationHelper: PaginationHelperService
  dateHelperService: DateHelperService
  protected router: Router

  protected constructor(injector: Injector) {
    this.datePipe = injector.get(DatePipe);
    this.toastService = injector.get(ToastrService);
    this.permission = injector.get(PermissionService);
    this.paginationHelper = injector.get(PaginationHelperService)
    this.dateHelperService = injector.get(DateHelperService)
    this.router = injector.get(Router)
  }

  conditionalValidation(formGroup: FormGroup, condition: boolean, data: any[], ...validations: { validation: string, value: any }[]) {
    data.forEach(x => {
      if (condition) {
        const validators = []
        validators.push(Validators.required);

        if (validations) {
          validations.forEach((y) => {
            validators.push(Validators[y.validation](y.value))
          })
        }
        formGroup.get(x).setValidators([...validators])
        formGroup.get(x).updateValueAndValidity();
      } else {
        formGroup.get(x).clearValidators()
        formGroup.get(x).updateValueAndValidity();
      }
    })

  }

  transformDate(date: Date | string, format: string) {
    return this.datePipe.transform(date, format);
  }

  // For checking validation message
  logValidationErrors(formGroup: FormGroup, formErrors: any, validationMessages?: any): void {
    Object.keys(formGroup.controls).forEach((Key: string) => {
      const abstractControl = formGroup.get(Key);
      formErrors[Key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '' || abstractControl.untouched)) {
        const messages = validationMessages[Key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            formErrors[Key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl, formErrors);
      }
    });
  }

  valueFormatter(value: any, sign?: '-ve' | '+ve') {
    let convertedValue = 0
    let formattedValue
    try {
      convertedValue = Number(value);
      if (!sign) {
        formattedValue = Math.sign(convertedValue) === -1
          ? '(' + Math.abs(convertedValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ')'
          : convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      } else if (sign === '+ve') {
        formattedValue = convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      } else if (sign === '-ve') {
        formattedValue = '(' + Math.abs(convertedValue).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) + ')'
      }
    } catch (error) {
      formattedValue = '' + error
    }
    return formattedValue
  }

  generateArrayOfYears(): any[] {
    const min = new Date().getFullYear() - 10
    const max = min + 10
    const years = []

    for (let i = min; i <= max; i++) {
      years.push({value: i})
    }
    return years
  }

  formatDate(date: string) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  //disable provided fields
  public disableFields(form: FormGroup, ...args: string[]) {
    (args).forEach((key: string) => form.get(key).disable())
  }

  //disable provided lines fields
  public disableLinesFields(formLines: any, ...args: string[]) {
    formLines
      .forEach((control) => {
        (args).forEach((key: string) => {
          control.controls[key].disable()
        })
      })
  }

  //Reset provided field
  resetFields(form: FormGroup, ...args: string[]) {
    args.forEach((key: string) => form.get(key).reset())
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  calculateTotal(res: any, ...keys): any {
    const objectToReturn = {}
    keys.forEach((key) => {
      res.map((item) => {
        if (objectToReturn[key]) {
          objectToReturn[key] += item[key]
        } else {
          objectToReturn[key] = item[key]
        }
      })
    })
    return objectToReturn
  }

  createNavigationUrl(docType: DocType, documentId): string {
    switch (docType) {
      case DocType.PayrollTransaction:
        return `/payroll/transaction/detail/${documentId}`;
      case DocType.Invoice:
        return '/' + INVOICE.ID_BASED_ROUTE('details', documentId);
      case DocType.Bill:
        return BILL.ID_BASED_ROUTE('details', documentId);
      case DocType.JournalEntry:
        return JOURNAL_ENTRY.ID_BASED_ROUTE('details', documentId);
        case DocType.PettyCash:
          return PETTY_CASH.ID_BASED_ROUTE('details', documentId);
      /*case DocType.EmployeeBill:
          return `/bill/employee/detail/${documentId}`;*/
      case DocType.Payment:
        return PAYMENT.ID_BASED_ROUTE('details', documentId);
      case DocType.Receipt:
        return RECEIPT.ID_BASED_ROUTE('details', documentId);
      case DocType.PayrollPayment:
        return PAYROLL_TRANSACTION.ID_BASED_ROUTE('details', documentId);
      /*case DocType.ExternalReceipt:
          return `/payment/external/detail/${documentId}`;
      case DocType.InternalReceipt:
          return `/payment/internal/detail/${documentId}`;*/
      case DocType.DebitNote:
        return DEBIT_NOTE.ID_BASED_ROUTE('details', documentId);
      case DocType.CreditNote:
        return CREDIT_NOTE.ID_BASED_ROUTE('details', documentId);
      case DocType.PurchaseOrder:
        return PURCHASE_ORDER.ID_BASED_ROUTE('details', documentId);
      /*case DocType.SalesOrder:
        return  SALES_ORDER.ID_BASED_ROUTE('details', documentId);*/
      case DocType.GRN:
        return GOODS_RECEIVED_NOTE.ID_BASED_ROUTE('details', documentId);
      case DocType.GoodsReturnNote:
        return GOODS_RETURN_NOTE.ID_BASED_ROUTE('details', documentId);
      case DocType.Disposal:
        return DISPOSAL.ID_BASED_ROUTE('details', documentId);
      /*case DocType.Loan:
          return `/payroll/loan/issuance/detail/${documentId}`;*/
    }
  }

  async redirectToDocumentDetail(docType: DocType, documentId) {
    console.log(this.createNavigationUrl(docType, documentId));
    await this.router.navigateByUrl(this.createNavigationUrl(docType, documentId));
  }

  createExcelFile(data: any, fileName: string) {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Create a link for downloading
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.click();

    document.body.removeChild(a);
  }
}
