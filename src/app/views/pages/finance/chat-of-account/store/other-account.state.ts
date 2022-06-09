import { State } from '@ngxs/store';
import { defaultEntityState, ProfilingState, ProfilingStateModel } from 'src/app/views/pages/profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'OtherAccount',
  defaults: defaultEntityState()
})
export class OtherAccountState extends ProfilingState<any> {
  constructor() {
    super(OtherAccountState, 'OtherAccount');
  }
}

