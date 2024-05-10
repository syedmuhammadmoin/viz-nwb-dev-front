import {AppConst} from './AppConst';
import {HttpParams} from '@angular/common/http';
import {Injector} from '@angular/core';
import {DateHelperService} from './helpers/date-helper';

export abstract class AppServiceBase {
  dateHelperService: DateHelperService

  protected constructor(injector: Injector) {
    this.dateHelperService = injector.get(DateHelperService)
  }


  getfilterParams(params: any, date?: any, name?: any) {
    let isActive: boolean | any = '';
    let status = '';

    if (params?.filterModel?.isActive?.values.length === 1) {
      isActive = (params?.filterModel?.isActive?.values[0] === 'Yes') ? true : false
    }

    if (params?.filterModel?.status?.values.length === 1) {
      AppConst.filterStatus.forEach((val) => val.value === params.filterModel.status.values[0] ? status = (val.id).toString() : '')
    }

    let httpParams = new HttpParams();
    httpParams = httpParams.append('PageStart', params?.startRow);
    httpParams = httpParams.append('PageEnd', params?.endRow);
    httpParams = httpParams.append('Name', (params?.filterModel?.name?.filter || name) || '');
    httpParams = httpParams.append('Account', params?.filterModel?.accountTitle?.filter || '');
    
    httpParams = httpParams.append('docNo', (params?.filterModel?.docNo?.filter || params?.filterModel?.cnic?.filter) ||'');
    httpParams = httpParams.append('title', (params?.filterModel?.title?.filter || "") || '');
    httpParams = httpParams.append('category', (params?.filterModel?.category?.filter || "") || '');
    httpParams = httpParams.append('description', (params?.filterModel?.description?.filter || "") || '');
    httpParams = httpParams.append('unitOfMeasurement', (params?.filterModel?.unitOfMeasurement?.filter || "") || '');
    httpParams = httpParams.append('availableQuantity', (params?.filterModel?.availableQuantity?.filter || "") || '');
    httpParams = httpParams.append('reservedQuantity', (params?.filterModel?.reservedQuantity?.filter || "") || '');
    httpParams = httpParams.append('tendorInquiryNumber', (params?.filterModel?.tendorInquiryNumber?.filter || "") || '');
    httpParams = httpParams.append('businessPartner', (params?.filterModel?.businessPartnerName?.filter || params?.filterModel?.businessPartner?.filter || params?.filterModel?.customerName?.filter || params?.filterModel?.vendorName?.filter ||  params?.filterModel?.employee?.filter ||  params?.filterModel?.employeeName?.filter || params?.filterModel?.bankName?.filter) || '');
    httpParams = httpParams.append('department', (params?.filterModel?.departmentName?.filter || params?.filterModel?.department?.filter) || '');
    httpParams = httpParams.append('designation', (params?.filterModel?.designationName?.filter || params?.filterModel?.designation?.filter) || '');
    httpParams = httpParams.append('warehouse', (params?.filterModel?.warehouseName?.filter || ''));
    httpParams = httpParams.append('isActive', isActive);
    httpParams = httpParams.append('itemCode', (params?.filterModel?.itemCode?.filter) || '' );
    httpParams = httpParams.append('docDate', date || '');
    httpParams = httpParams.append('dueDate', this.dateHelperService.transformDate(params?.filterModel?.dueDate?.dateFrom, 'MM/d/y') || '');
    httpParams = httpParams.append('callForQuotationDate', this.dateHelperService.transformDate(params?.filterModel?.callForQuotationDate?.dateFrom, 'MM/d/y') || '');
    httpParams = httpParams.append('state', status);
    
    return httpParams
  }
}
