import { IPayrollTransactionLines } from "./IPayrollTransactionLines";

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
    designationId:number;
    campusId:number;
    departmentId:number;
    bpsName:string;
    totalAllowances:number;
    totalDeductions:number;
    netIncrement:number;
    taxDeduction:number;
    grossPay:number;
    netSalary:number;
    basicSalary:number;
    religion : string;
    employeeType : string;
    EmployeeCNIC:string;
    payrollTransactionLines: IPayrollTransactionLines[];
  }