export interface IInvoiceLines {
    id: number;
    itemId: number;
    description: string;
    price: number;
    quantity: number;
    tax: number;
    accountId: number;
    warehouseId: number;
}
