export interface IVendorBillLines {
    id: number;
    itemId: number;
    description: string;
    cost: number;
    quantity: number;
    tax: number;
    anyOtherTax: number;
    accountId: number;
    warehouseId: number;
}
