import { Injectable } from '@angular/core';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../store/profiling.state';
import {State} from '@ngxs/store';

@State<ProfilingStateModel<any>>({
  name: 'businessPartner',
  defaults: defaultEntityState()
})
@Injectable()
export class BusinessPartnerState extends ProfilingState<any> {
  constructor() {
    super(BusinessPartnerState, 'businessPartner');
  }
}
