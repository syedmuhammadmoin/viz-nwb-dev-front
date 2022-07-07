import { IIssuanceLines } from "./IssuanceLines";

export interface IIssuance {
    id : number;
    employeeId : string;
    issuanceDate : string;
    campusId: number;
    isSubmit?: any;
    requisitionId?: number;
    issuanceLines: IIssuanceLines[];
}
