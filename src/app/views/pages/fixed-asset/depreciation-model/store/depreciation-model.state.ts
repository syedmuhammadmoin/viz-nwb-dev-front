
import {State} from '@ngxs/store';
import { defaultEntityState, ProfilingState, ProfilingStateModel } from 'src/app/views/pages/profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'DepreciationModel',
  defaults: defaultEntityState()
})
export class DepreciationModelState extends ProfilingState<any> {
  constructor() {
    super(DepreciationModelState, 'DepreciationModel');
  }
}

