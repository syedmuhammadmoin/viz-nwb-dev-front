
import {State} from '@ngxs/store';
import { defaultEntityState, ProfilingState, ProfilingStateModel } from 'src/app/views/pages/profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'Status',
  defaults: defaultEntityState()
})
export class StatusState extends ProfilingState<any> {
  constructor() {
    super(StatusState, 'Status');
  }
}
