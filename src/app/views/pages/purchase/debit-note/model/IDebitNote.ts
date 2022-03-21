import { IDebitNoteLines } from "./IDebitNoteLines";

export interface IDebitNote {
    id: number;
    vendorId: number;
    noteDate: string;
    //billTransactionId?: number;
    debitNoteLines: IDebitNoteLines[];
    isSubmit?: any;
}
