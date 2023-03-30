import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'qualification',
  defaults: defaultEntityState()
})
export class QualificationState extends ProfilingState<any> {
  constructor() {
    super(QualificationState, 'qualification');
  }
}
