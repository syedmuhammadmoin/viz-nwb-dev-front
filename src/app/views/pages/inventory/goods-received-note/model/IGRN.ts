import { IGRNLines } from "./IGRNLines"

export interface IGRN {
    id            : number;
    vendorId      : number;
    grnDate       : string;
    contact       : number;
    campusId      : number;
    purchaseOrderId: number;
    issuanceId    : number;
    grnLines      : IGRNLines[];
    isSubmit?     : boolean;
}




     