import { Injectable } from '@angular/core';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../store/profiling.state';
import {State} from '@ngxs/store';

@State<ProfilingStateModel<any>>({
  name: 'AllBusinessPartner',
  defaults: defaultEntityState()
})
@Injectable()
export class AllBusinessPartnerState extends ProfilingState<any> {
  constructor() {
    super(AllBusinessPartnerState, 'AllBusinessPartner');
  }
}

