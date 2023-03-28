import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'semester',
  defaults: defaultEntityState()
})
export class SemesterState extends ProfilingState<any> {
  constructor() {
    super(SemesterState, 'semester');
  }
}
