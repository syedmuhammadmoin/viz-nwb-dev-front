import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';
import { Injectable } from '@angular/core';

@State<ProfilingStateModel<any>>({
  name: 'degree',
  defaults: defaultEntityState()
})
@Injectable()
export class DegreeState extends ProfilingState<any> {
  constructor() {
    super(DegreeState, 'degree');
  }
}
