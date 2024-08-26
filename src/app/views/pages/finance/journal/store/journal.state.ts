
import { Injectable } from '@angular/core';
import {State} from '@ngxs/store';
import { defaultEntityState, ProfilingState, ProfilingStateModel } from 'src/app/views/pages/profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'DefaultAccount',
  defaults: defaultEntityState()
})
@Injectable()
export class DefaultAccountState extends ProfilingState<any> {
  constructor() {
    super(DefaultAccountState, 'DefaultAccount');
  }
}

