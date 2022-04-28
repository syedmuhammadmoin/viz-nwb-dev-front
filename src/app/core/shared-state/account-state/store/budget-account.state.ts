
import {State} from '@ngxs/store';
import { defaultEntityState, ProfilingState, ProfilingStateModel } from 'src/app/views/pages/profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'BudgetAccount',
  defaults: defaultEntityState()
})
export class BudgetAccountState extends ProfilingState<any> {
  constructor() {
    super(BudgetAccountState, 'BudgetAccount');
  }
}

