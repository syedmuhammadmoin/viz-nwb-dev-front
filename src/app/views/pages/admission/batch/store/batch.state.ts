import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';
import { Injectable } from '@angular/core';

@State<ProfilingStateModel<any>>({
  name: 'batch',
  defaults: defaultEntityState()
})
@Injectable()
export class BatchState extends ProfilingState<any> {
  constructor() {
    super(BatchState, 'batch');
  }
}
