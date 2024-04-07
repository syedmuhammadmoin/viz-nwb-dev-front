import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { defaultEntityState, ProfilingState, ProfilingStateModel } from 'src/app/views/pages/profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'AssetAccount',
  defaults: defaultEntityState()
})
@Injectable()
export class AssetAccountState extends ProfilingState<any> {
  constructor() {
    super(AssetAccountState, 'AssetAccount');
  }
}

