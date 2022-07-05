import { IGoodsReturnNoteLines } from "./IGoodsReturnNoteLines"

export interface IGoodsReturnNote {
    id            : number;
    vendorId      : number;
    returnDate    : string;
    contact       : number;
    campusId      : number;
    grnId         : number;
    goodsReturnNoteLines : IGoodsReturnNoteLines[];
    isSubmit?     : boolean;
}




     