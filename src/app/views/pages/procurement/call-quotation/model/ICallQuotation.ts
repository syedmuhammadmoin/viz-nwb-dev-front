import { ICallForQuotationLines } from "./ICallQuotationLines";

export interface ICallQuotation {
    id: number;
    vendorId: number;
    callForQuotationDate: string;
    description: string;
    isSubmit ?: any;
    callForQuotationLines: ICallForQuotationLines[];
}



