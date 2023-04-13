import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'programState',
  defaults: defaultEntityState()
})
export class ProgramState extends ProfilingState<any> {
  constructor() {
    super(ProgramState, 'programState');
  }
}
