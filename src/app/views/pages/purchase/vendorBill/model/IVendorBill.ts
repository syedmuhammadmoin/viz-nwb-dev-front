import { IVendorBillLines } from "./IVendorBillLines";

export interface IVendorBill {
    id: number;
    vendorId: number;
    //vendorBillRef: string;
    billDate: string;
    dueDate: string;
    //contact: string;
    campusId: number;
    billLines: IVendorBillLines[];
    isSubmit?: any;
}
