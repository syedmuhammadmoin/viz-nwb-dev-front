import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../profiling/store/profiling.state';
import { Injectable } from '@angular/core';

@State<ProfilingStateModel<any>>({
  name: 'asset',
  defaults: defaultEntityState()
})
@Injectable()
export class AssetState extends ProfilingState<any> {
  constructor() {
    super(AssetState, 'asset');
  }
}
