import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'district',
  defaults: defaultEntityState()
})
export class DistrictState extends ProfilingState<any> {
  constructor() {
    super(DistrictState, 'district');
  }
}
