export interface IRequisitionLines {
    id: number;
    itemId: number;
    description: string;
    quantity: number;
    purchasePrice?: number;
    tax?: number;
    accountId?: number;
    warehouseId: number;
}
