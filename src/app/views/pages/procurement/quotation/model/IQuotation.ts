import { IQuotationLines } from "./IQuotationLines";

export interface IQuotation {
    id: number;
    vendorId: number;
    quotationDate: string;
    timeframe: string;
    isSubmit ?: any;
    requisitionId: number;
    quotationLines: IQuotationLines[];
}



