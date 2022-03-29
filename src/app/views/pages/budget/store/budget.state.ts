
import {State} from '@ngxs/store';
import { defaultEntityState, ProfilingState, ProfilingStateModel } from 'src/app/views/pages/profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'Budget',
  defaults: defaultEntityState()
})
export class BudgetState extends ProfilingState<any> {
  constructor() {
    super(BudgetState, 'Budget');
  }
}

