import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'faculty',
  defaults: defaultEntityState()
})
export class FacultyState extends ProfilingState<any> {
  constructor() {
    super(FacultyState, 'faculty');
  }
}
