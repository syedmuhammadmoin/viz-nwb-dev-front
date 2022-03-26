export interface IDebitNoteLines {
    id: number;
    itemId: number;
    description: string;
    cost: number;
    quantity: number;
    tax: number;
    accountId: number;
    warehouseId: number;
    //locationId: number;
}