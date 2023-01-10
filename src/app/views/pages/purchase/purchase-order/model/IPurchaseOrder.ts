import {IPurchaseOrderLines} from "./IPurchaseOrderLines"

export interface IPurchaseOrder {
    id: number;
    vendorId: number;
    poDate: string;
    dueDate: string;
    contact: string;
    campusId: number;
    requisitionId?: number;
    purchaseOrderLines: IPurchaseOrderLines[];
    isSubmit?: boolean;
}
