export class IPayrollTransaction {
    id: number;
    month: number;
    year: number;
    employeeId: number;
    workingDays: number;
    presentDays: number;
    leaveDays: number;
    transDate: string;
    accountPayableId: string;
    isSubmit: boolean;
  }