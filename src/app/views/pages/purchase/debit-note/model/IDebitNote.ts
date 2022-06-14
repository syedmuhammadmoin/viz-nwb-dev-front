import { IDebitNoteLines } from "./IDebitNoteLines";

export interface IDebitNote {
    id: number;
    vendorId: number;
    noteDate: string;
    documentLedgerId?: number;
    campusId: number;
    debitNoteLines: IDebitNoteLines[];
    isSubmit?: any;
}
