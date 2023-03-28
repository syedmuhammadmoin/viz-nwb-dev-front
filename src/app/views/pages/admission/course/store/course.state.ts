import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'course',
  defaults: defaultEntityState()
})
export class CourseState extends ProfilingState<any> {
  constructor() {
    super(CourseState, 'course');
  }
}
