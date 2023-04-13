import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'batch',
  defaults: defaultEntityState()
})
export class BatchState extends ProfilingState<any> {
  constructor() {
    super(BatchState, 'batch');
  }
}
