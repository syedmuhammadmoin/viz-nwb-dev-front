import { TaxComputation, TaxType } from "src/app/views/shared/AppEnum";

export interface ITax {
    id: number;
    accountId: string;
    name: string;
    taxType: TaxType;
    taxComputation : TaxComputation
}

export interface TaxInvoicesLines{
    taxBase : number;
    accountId : string
}