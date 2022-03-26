import { IInvoiceLines } from "./IInvoiceLines";

export interface IInvoice {
    id: number;
    customerId: number;
    invoiceDate: string;
    dueDate: string;
    // contact: string;
    campusId: number;
    invoiceLines: IInvoiceLines[];
    isSubmit?: any;
}

