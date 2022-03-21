import {ICreditNoteLines} from './ICreditNoteLines'

export interface ICreditNote {
    id: number;
    customerId: number;
    noteDate: string;
    //invoiceTransactionId?: any,
    creditNoteLines: ICreditNoteLines[];
    isSubmit?: any
}
