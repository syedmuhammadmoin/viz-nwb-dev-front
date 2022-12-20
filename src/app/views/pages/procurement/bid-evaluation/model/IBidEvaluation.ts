import { IBidEvaluationLines } from "./IBidEvaluationLines";

export interface IBidEvaluation {
    id: number;
    name: string;
    title: string;
    refNo: string;
    methodOfProcurement: string;
    tendorInquiryNumber: string;
    numberOfBids: number;
    dateOfOpeningBid: string;
    dateOfClosingBid: string;
    bidEvaluationCriteria: string;
    lowestEvaluatedBidder: string;
    isSubmit?: any;
    bidEvaluationLines: IBidEvaluationLines[]
}



