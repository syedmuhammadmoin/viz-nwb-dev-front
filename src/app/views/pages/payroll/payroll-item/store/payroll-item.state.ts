import {defaultEntityState, ProfilingState, ProfilingStateModel} from "../../../profiling/store/profiling.state";
import {State} from "@ngxs/store";

@State<ProfilingStateModel<any>>({
  name: 'payrollItem',
  defaults: defaultEntityState()
})
export class PayrollItemState extends ProfilingState<any> {
  constructor() {
    super(PayrollItemState, 'payrollItem');
  }
}
