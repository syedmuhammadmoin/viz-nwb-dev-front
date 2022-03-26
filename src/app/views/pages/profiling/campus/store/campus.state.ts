import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../store/profiling.state';
import {State} from '@ngxs/store';

@State<ProfilingStateModel<any>>({
  name: 'campus',
  defaults: defaultEntityState()
})
export class CampusState extends ProfilingState<any> {
  constructor() {
    super(CampusState, 'campus');
  }
}

