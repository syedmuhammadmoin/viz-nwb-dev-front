import { TaxComputation, TaxIncluded, TaxType } from "src/app/views/shared/AppEnum";

export interface ITax {
    id: number;
    accountId: string;
    name: string;
    taxType: TaxType;
    legalNotes:string;
    taxScope:string;
    description:string;
    percent:string;
    labelOninv :string; 
    company : string;
    includedPrice : TaxIncluded;
    sabsequentTaxes:boolean;
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
    id : number;
    taxId:number;
    name :string;
    taxComputation: TaxComputation;
    amount : number;
}
export interface TaxRefundLines{
    taxBase : number;
    accountId : string
}