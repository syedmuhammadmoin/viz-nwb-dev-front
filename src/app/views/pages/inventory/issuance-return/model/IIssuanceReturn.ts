import { IIssuanceReturnLines } from "./IIssuanceReturnLines";

export interface IIssuanceReturn {
    id            : number;
    employeeId      : number;
    issuanceReturnDate : string;
    contact       : number;
    campusId      : number;
    issuanceId    : number;
    issuanceReturnLines : IIssuanceReturnLines[];
    isSubmit?     : boolean;
}




     