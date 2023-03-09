import {State} from '@ngxs/store';
import { defaultEntityState, ProfilingState, ProfilingStateModel } from 'src/app/views/pages/profiling/store/profiling.state';

@State<ProfilingStateModel<any>>({
  name: 'DisposalDropdown',
  defaults: defaultEntityState()
})
export class DisposalDropdownState extends ProfilingState<any> {
  constructor() {
    super(DisposalDropdownState, 'DisposalDropdown');
  }
}

