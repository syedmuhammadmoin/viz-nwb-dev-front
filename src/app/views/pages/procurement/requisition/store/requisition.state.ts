import { Injectable } from '@angular/core';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';
import {State} from '@ngxs/store';

@State<ProfilingStateModel<any>>({
  name: 'requisition',
  defaults: defaultEntityState()
})
@Injectable()
export class RequisitionState extends ProfilingState<any> {
  constructor() {
    super(RequisitionState, 'requisition');
  }
}

