import { IVendorBillLines } from "./IVendorBillLines";

export interface IVendorBill {
    id: number;
    vendorId: number;
    billDate: string;
    dueDate: string;
    grnId: number;
    campusId: number;
    billLines: IVendorBillLines[];
    isSubmit?: any;
}
