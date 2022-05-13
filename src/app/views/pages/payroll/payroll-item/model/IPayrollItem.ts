
export interface IPayrollItem {
    id: number,
    itemCode: string,
    name: string,
    payrollType: number,
    payrollItemType: number,
    value: number,
    accountId: string,
    isActive: boolean,
    remarks: string,
    employeeIds: number[]
}

