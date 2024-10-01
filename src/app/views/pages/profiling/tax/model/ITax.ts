import { TaxComputation, TaxType } from "src/app/views/shared/AppEnum";

export interface ITax {
    id: number;
    accountId: string;
    name: string;
    taxType: TaxType;
    legalNotes:string;
    taxScope:string;
    description:string;
    amount:string;
    taxComputation : TaxComputation;
    ChildrenTaxes : ITax[];
    taxRefundlines : TaxInvoicesLines[];
    taxInvoicelines : TaxRefundLines[]
}

export interface TaxInvoicesLines{
    taxBase : number;
    accountId : string
}
export interface ChildrenList{
    taxId:number;
    name :string;
    taxComputation: string;
    amount : number;
}
export interface TaxRefundLines{
    taxBase : number;
    accountId : string
}