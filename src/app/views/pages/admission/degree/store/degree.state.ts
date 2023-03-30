import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'degree',
  defaults: defaultEntityState()
})
export class DegreeState extends ProfilingState<any> {
  constructor() {
    super(DegreeState, 'degree');
  }
}
