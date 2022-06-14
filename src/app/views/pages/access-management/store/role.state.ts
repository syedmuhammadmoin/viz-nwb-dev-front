
import {State} from '@ngxs/store';
import { defaultEntityState, ProfilingState, ProfilingStateModel } from 'src/app/views/pages/profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'Role',
  defaults: defaultEntityState()
})
export class RoleState extends ProfilingState<any> {
  constructor() {
    super(RoleState, 'Role');
  }
}

