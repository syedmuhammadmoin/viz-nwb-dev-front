import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'asset',
  defaults: defaultEntityState()
})
export class AssetState extends ProfilingState<any> {
  constructor() {
    super(AssetState, 'asset');
  }
}
