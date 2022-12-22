import { ICallQuotationLines } from "./ICallQuotationLines";

export interface ICallQuotation {
    id: number;
    vendorId: number;
    callForQuotationDate: string;
    description: string;
    isSubmit ?: any;
    callQuotationLines: ICallQuotationLines[];
}



