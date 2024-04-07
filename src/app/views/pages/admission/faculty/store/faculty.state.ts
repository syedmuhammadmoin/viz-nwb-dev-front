import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';
import { Injectable } from '@angular/core';

@State<ProfilingStateModel<any>>({
  name: 'faculty',
  defaults: defaultEntityState()
})
@Injectable()
export class FacultyState extends ProfilingState<any> {
  constructor() {
    super(FacultyState, 'faculty');
  }
}
