import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';
import { Injectable } from '@angular/core';

@State<ProfilingStateModel<any>>({
  name: 'subject',
  defaults: defaultEntityState()
})
@Injectable()
export class SubjectState extends ProfilingState<any> {
  constructor() {
    super(SubjectState, 'subject');
  }
}
