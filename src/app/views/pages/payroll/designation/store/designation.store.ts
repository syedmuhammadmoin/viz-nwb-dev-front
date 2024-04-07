import { Injectable } from '@angular/core';
import { defaultEntityState, ProfilingState, ProfilingStateModel } from '../../../profiling/store/profiling.state';
import { State } from '@ngxs/store';

@State<ProfilingStateModel<any>>({
  name: 'designation',
  defaults: defaultEntityState()
})
@Injectable()
export class DesignationState extends ProfilingState<any> {
  constructor() {
    super(DesignationState, 'designation');
  }
}

