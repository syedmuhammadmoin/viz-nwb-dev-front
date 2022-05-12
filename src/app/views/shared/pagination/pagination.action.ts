import {Type} from '@angular/core';
import {EntityActionType, generateActionObject} from '../../pages/profiling/store/profiling.state';
import {PaginationState} from './pagination.state';

export class GetPageNumber<T> {
  static readonly type = 'Get Page Number'

  constructor(target: Type<PaginationState<T>>, payload: any) {
    console.log('get list method called' ,payload)
    return generateActionObject(EntityActionType.getPageNumber, target, payload);
  }
}

export class SetPageNumber<T> {
  static readonly type = 'Set Page Number'

  constructor(target: Type<PaginationState<T>>, payload: any) {
    console.log('get list method called' ,payload)
    return generateActionObject(EntityActionType.setPageNumber, target, payload);
  }
}
