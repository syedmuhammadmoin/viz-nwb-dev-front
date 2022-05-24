import { IPayrollTransLines } from "./IPayrollTransactionLines";

export interface  IPaymentProcess {
    campusId?: number;
    paymentDate?: string;
    paymentRegisterType?: number;
    paymentRegisterId?: string;
    description?: string;
    createPayrollTransLines?: IPayrollTransLines[];
 }
 
