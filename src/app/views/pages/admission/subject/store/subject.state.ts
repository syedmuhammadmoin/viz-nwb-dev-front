import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'subject',
  defaults: defaultEntityState()
})
export class SubjectState extends ProfilingState<any> {
  constructor() {
    super(SubjectState, 'subject');
  }
}
