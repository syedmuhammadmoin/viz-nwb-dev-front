import {ICreditNoteLines} from './ICreditNoteLines'

export interface ICreditNote {
    id: number;
    customerId: number;
    noteDate: string;
    documentLedgerId?: number,
    campusId: number;
    creditNoteLines: ICreditNoteLines[];
    isSubmit?: any
}
