import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'feeItem',
  defaults: defaultEntityState()
})
export class FeeItemState extends ProfilingState<any> {
  constructor() {
    super(FeeItemState, 'feeItem');
  }
}
