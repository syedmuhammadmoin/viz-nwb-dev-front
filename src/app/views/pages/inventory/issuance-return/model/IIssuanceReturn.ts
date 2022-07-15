import { IIssuanceReturnLines } from "./IIssuanceReturnLines";

export interface IIssuanceReturn {
    id            : number;
    vendorId      : number;
    issuanceReturnDate : string;
    contact       : number;
    campusId      : number;
    issuanceId    : number;
    issuanceReturnLines : IIssuanceReturnLines[];
    isSubmit?     : boolean;
}




     