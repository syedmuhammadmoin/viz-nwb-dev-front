import { defaultEntityState, ProfilingState, ProfilingStateModel } from '../../../profiling/store/profiling.state';
import { State } from '@ngxs/store';

@State<ProfilingStateModel<any>>({
  name: 'department',
  defaults: defaultEntityState()
})

export class DepartmentState extends ProfilingState<any> {
  constructor() {
    super(DepartmentState, 'department');
  }
}

