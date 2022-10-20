import { defaultEntityState, ProfilingState, ProfilingStateModel } from '../../../profiling/store/profiling.state';
import { State } from '@ngxs/store';

@State<ProfilingStateModel<any>>({
  name: 'employeePayments',
  defaults: defaultEntityState()
})

export class EmployeePaymentState extends ProfilingState<any> {
  constructor() {
    super(EmployeePaymentState, 'employeePayments');
  }
}

