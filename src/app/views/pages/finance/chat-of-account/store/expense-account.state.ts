import { State } from '@ngxs/store';
import { defaultEntityState, ProfilingState, ProfilingStateModel } from 'src/app/views/pages/profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'ExpenseAccount',
  defaults: defaultEntityState()
})
export class ExpenseAccountState extends ProfilingState<any> {
  constructor() {
    super(ExpenseAccountState, 'ExpenseAccount');
  }
}

