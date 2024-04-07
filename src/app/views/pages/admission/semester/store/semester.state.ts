import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';
import { Injectable } from '@angular/core';

@State<ProfilingStateModel<any>>({
  name: 'semester',
  defaults: defaultEntityState()
})
@Injectable()
export class SemesterState extends ProfilingState<any> {
  constructor() {
    super(SemesterState, 'semester');
  }
}
