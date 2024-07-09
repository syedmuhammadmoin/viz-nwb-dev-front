import { Injectable } from "@angular/core";
import {defaultEntityState, ProfilingState, ProfilingStateModel} from "../../../profiling/store/profiling.state";
import {State} from "@ngxs/store";

@State<ProfilingStateModel<any>>({
  name: 'payrollItem',
  defaults: defaultEntityState()
})
@Injectable()
export class PayrollItemState extends ProfilingState<any> {
  constructor() {
    super(PayrollItemState, 'payrollItem');
  }
}
