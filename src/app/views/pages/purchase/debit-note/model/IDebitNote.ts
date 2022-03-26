import { IDebitNoteLines } from "./IDebitNoteLines";

export interface IDebitNote {
    id: number;
    vendorId: number;
    noteDate: string;
    //billTransactionId?: number;
    campusId: number;
    debitNoteLines: IDebitNoteLines[];
    isSubmit?: any;
}
