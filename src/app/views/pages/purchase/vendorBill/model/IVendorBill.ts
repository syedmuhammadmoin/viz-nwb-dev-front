import { IVendorBillLines } from "./IVendorBillLines";

export interface IVendorBill {
    id: number;
    vendorId: number;
    //vendorBillRef: string;
    billDate: Date;
    dueDate: Date;
    //contact: string;
    billLines: IVendorBillLines[];
    isSubmit?: any;
}
