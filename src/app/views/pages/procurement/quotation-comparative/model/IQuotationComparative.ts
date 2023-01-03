export interface IAwardVendor {
    id: number;
    remarks: string;
    awardedVendor: string;
    quotationId: number;
}



export interface IQuotationComparativeLines {
  quotationId: number;
  isSelected: boolean;
}

export interface IQuotationComparative {
    id: number;
    requisitionId: number;
    quotationComparativeDate: string;
    //remarks: string;
    isSubmit ?: any;
    quotationComparativeLines: IQuotationComparativeLines[];
}



