import {State} from '@ngxs/store';
import {defaultEntityState, ProfilingState, ProfilingStateModel} from '../../../profiling/store/profiling.state';
import { Injectable } from '@angular/core';

@State<ProfilingStateModel<any>>({
  name: 'qualification',
  defaults: defaultEntityState()
})
@Injectable()
export class QualificationState extends ProfilingState<any> {
  constructor() {
    super(QualificationState, 'qualification');
  }
}
