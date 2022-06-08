import { State } from '@ngxs/store';
import { defaultEntityState, ProfilingState, ProfilingStateModel } from 'src/app/views/pages/profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'AccountReceivable',
  defaults: defaultEntityState()
})
export class AccountReceivableState extends ProfilingState<any> {
  constructor() {
    super(AccountReceivableState, 'AccountReceivable');
  }
}

