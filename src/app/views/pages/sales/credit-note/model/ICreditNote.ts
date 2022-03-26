import {ICreditNoteLines} from './ICreditNoteLines'

export interface ICreditNote {
    id: number;
    customerId: number;
    noteDate: string;
    //invoiceTransactionId?: any,
    campusId: number;
    creditNoteLines: ICreditNoteLines[];
    isSubmit?: any
}
