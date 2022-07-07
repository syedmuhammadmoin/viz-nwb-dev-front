import {FormControl, FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Injector} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import { PermissionService } from '../pages/auth/service/permission.service';
import { DateHelperService } from './helpers/date-helper';
import { PaginationHelperService } from './pagination/pagination-helper.service';

export abstract class AppComponentBase {
  datePipe: DatePipe
  toastService: ToastrService
  permission: PermissionService
  paginationHelper: PaginationHelperService
  dateHelperService: DateHelperService
 
  protected constructor(injector: Injector) {
    this.datePipe = injector.get(DatePipe);
    this.toastService = injector.get(ToastrService);
    this.permission = injector.get(PermissionService);
    this.paginationHelper = injector.get(PaginationHelperService)
    this.dateHelperService = injector.get(DateHelperService)
  }

  // //selector region start
  // datePipe: DatePipe
  // toastService: ToastrService
  // permission: PermissionService
 
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
        formattedValue = '(' + Math.abs(convertedValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ')'
      }
    } catch (error) {
      formattedValue = '' + error
    }
    return formattedValue
  }

  generateArrayOfYears(): any[] {
    const min = new Date().getFullYear() - 10
    const max = min + 100
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
  public disableFields (form : FormGroup , ...args: string[] ) {
    (args).forEach((key: string) => form.get(key).disable())
  }

  //disable provided lines fields
  public disableLinesFields(formLines : any , ...args: string[]) {
    formLines
    .forEach((control) => { 
      (args).forEach((key: string) => {
        control.controls[key].disable()
      })
    })
  }

  //Reset provided field
  resetFields(form : FormGroup , ...args: string[]) {
    args.forEach((key: string) => form.get(key).reset())
  }
}
