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
    console.log('params', params);

    let isActive: boolean | any = '';
    let status = '';

    if (params?.filterModel?.isActive?.values.length === 1) {
      isActive = (params?.filterModel?.isActive?.values[0] === 'Yes') ? true : false
    }

    if (params?.filterModel?.status?.values.length === 1) {
      AppConst.filterStatus.forEach((val) => val.value === params.filterModel.status.values[0] ? status = (val.id).toString() : '')
    }

    let httpParams = new HttpParams();
    httpParams = httpParams.append('PageNumber', params.startRow);
    httpParams = httpParams.append('PageSize', params.endRow);
    httpParams = httpParams.append('Name', (params?.filterModel?.name?.filter || name) || '');
    httpParams = httpParams.append('Account', params?.filterModel?.accountTitle?.filter || '');
    
    httpParams = httpParams.append('docNo', (params?.filterModel?.docNo?.filter || params?.filterModel?.cnic?.filter) ||'');
    httpParams = httpParams.append('businessPartner', (params?.filterModel?.businessPartnerName?.filter || params?.filterModel?.customerName?.filter || params?.filterModel?.vendorName?.filter ||  params?.filterModel?.employee?.filter) || '');
    httpParams = httpParams.append('department', (params?.filterModel?.departmentName?.filter || params?.filterModel?.department?.filter) || '');
    httpParams = httpParams.append('designation', (params?.filterModel?.designationName?.filter || params?.filterModel?.designation?.filter) || '');
    httpParams = httpParams.append('isActive', isActive);
    httpParams = httpParams.append('itemCode', (params?.filterModel?.itemCode?.filter) || '' );
    httpParams = httpParams.append('docDate', date || '');
    httpParams = httpParams.append('dueDate', this.dateHelperService.transformDate(params?.filterModel?.dueDate?.dateFrom, 'MM/d/y') || '');
    httpParams = httpParams.append('state', status);
    // httpParams = httpParams.append('challanNumber', (params?.filterModel?.challanNumber?.filter) || '');
    // httpParams = httpParams.append('studentName', (params?.filterModel?.studentName?.filter) || '');
    // httpParams = httpParams.append('fatherName', (params?.filterModel?.fatherName?.filter) || '');
    // httpParams = httpParams.append('academicCampus', (params?.filterModel?.academicCampus?.filter) || '');
    // httpParams = httpParams.append('faculty', (params?.filterModel?.faculty?.filter) || '');
    // httpParams = httpParams.append('program', (params?.filterModel?.program?.filter) || '');
    // httpParams = httpParams.append('programType', (params?.filterModel?.programType?.filter) || '');
    // httpParams = httpParams.append('rollNumber', (params?.filterModel?.rollNumber?.filter) || '');
    // httpParams = httpParams.append('amount', (params?.filterModel?.netPayment?.filter) || '');
    // httpParams = httpParams.append('academicDepartment', (params?.filterModel?.academicDepartment?.filter) || '');
    // httpParams = httpParams.append('batchId', (params?.filterModel?.batchId?.filter) || '');
    // for Business Partner
    // httpParams = httpParams.append('name', (params?.filterModel?.businessPartner?.filter) || '');
    // httpParams = httpParams.append('entity', (params?.filterModel?.entity?.filter) || '');
    // httpParams = httpParams.append('type', (params?.filterModel?.type?.filter) || '');
    // httpParams = httpParams.append('cnic', (params?.filterModel?.docNo?.filter) || '');

    return httpParams
  }
}
