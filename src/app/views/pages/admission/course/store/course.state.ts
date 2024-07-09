import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';
import { Injectable } from '@angular/core';

@State<ProfilingStateModel<any>>({
  name: 'course',
  defaults: defaultEntityState()
})
@Injectable()
export class CourseState extends ProfilingState<any> {
  constructor() {
    super(CourseState, 'course');
  }
}
