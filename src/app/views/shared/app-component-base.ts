import { WarehouseService } from 'src/app/views/pages/profiling/warehouse/services/warehouse.service';
import { OrganizationService } from 'src/app/views/pages/profiling/organization/services/organization.service';
import { LocationService } from 'src/app/views/pages/profiling/location/service/location.service';
import {FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Injector} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import { PermissionService } from '../pages/auth/service/permission.service';
import { BusinessPartnerService } from '../pages/profiling/business-partner/service/businessPartner.service';
import { Select, Store } from '@ngxs/store';


import { CategoryService } from '../pages/profiling/category/service/category.service';
import { ProductService } from '../pages/profiling/product/service/product.service';
import { ChartOfAccountService } from '../pages/finance/chat-of-account/service/chart-of-account.service';
import { DepartmentService } from '../pages/profiling/department/service/department.service';
import { DepartmentState } from '../pages/profiling/department/store/department.state';
import { ProductState } from '../pages/profiling/product/store/product.state.state';
import { BusinessPartnerState } from '../pages/profiling/business-partner/store/business-partner.state';
import { CategoryState } from '../pages/profiling/category/store/category.state';
import { LocationState } from '../pages/profiling/location/store/location.state';
import { OrganizationState } from '../pages/profiling/organization/store/organization.state';
import { WarehouseState } from '../pages/profiling/warehouse/store/warehouse.state';
import{ GetList} from '../pages/profiling/store/profiling.action'

export abstract class AppComponentBase {
  datePipe: DatePipe
  toastService: ToastrService
  permission: PermissionService
 
  protected constructor(injector: Injector) {
    this.datePipe = injector.get(DatePipe);
    this.toastService = injector.get(ToastrService);
    this.permission = injector.get(PermissionService);
  }

  // //selector region start
  // datePipe: DatePipe
  // toastService: ToastrService
  // permission: PermissionService
 
  transformDate(date: Date, format: string) {
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


  
}
