import { IGRNLines } from "./IGRNLines"

export interface IGRN {
    id            : number;
    vendorId      : number;
    grnDate       : string;
    contact       : number;
    grnLines: IGRNLines[];
    isSubmit?: any;
}



