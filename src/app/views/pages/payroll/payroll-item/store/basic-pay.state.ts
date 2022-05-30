import {defaultEntityState, ProfilingState, ProfilingStateModel} from "../../../profiling/store/profiling.state";
import {State} from "@ngxs/store";

@State<ProfilingStateModel<any>>({
  name: 'basicPay',
  defaults: defaultEntityState()
})
export class BasicPayState extends ProfilingState<any> {
  constructor() {
    super(BasicPayState, 'basicPay');
  }
}
