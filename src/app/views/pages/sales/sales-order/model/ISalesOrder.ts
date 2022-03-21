import { ISalesOrderLines } from "./ISalesOrderLines";

export interface ISalesOrder {
    id: number;
    customerId: number;
    salesOrderDate: string;
    dueDate: string;
    contact: string;
    salesOrderLines: ISalesOrderLines[];
    isSubmit?: any;
}
