import { IGoodsReturnNoteLines } from "./IGoodsReturnNoteLines"

export interface IGRN {
    id            : number;
    vendorId      : number;
    returnDate    : string;
    contact       : number;
    campusId      : number;
    purchaseOrderId: number;
    goodsReturnNoteLines : IGoodsReturnNoteLines[];
    isSubmit?     : boolean;
}




     