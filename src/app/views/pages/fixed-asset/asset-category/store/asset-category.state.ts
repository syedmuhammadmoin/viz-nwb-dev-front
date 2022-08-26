
import {State} from '@ngxs/store';
import { defaultEntityState, ProfilingState, ProfilingStateModel } from 'src/app/views/pages/profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'AssetCategory',
  defaults: defaultEntityState()
})
export class AssetCategoryState extends ProfilingState<any> {
  constructor() {
    super(AssetCategoryState, 'AssetCategory');
  }
}

