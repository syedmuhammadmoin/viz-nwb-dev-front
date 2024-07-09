import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { defaultEntityState, ProfilingState, ProfilingStateModel } from 'src/app/views/pages/profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'AccountPayable',
  defaults: defaultEntityState()
})
@Injectable()
export class AccountPayableState extends ProfilingState<any> {
  constructor() {
    super(AccountPayableState, 'AccountPayable');
  }
}

