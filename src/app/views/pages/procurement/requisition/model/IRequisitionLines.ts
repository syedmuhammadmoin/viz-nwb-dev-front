export interface IRequisitionLines {
    id: number;
    accountId: number;
    itemId: number;
    description: string;
    quantity: number;
    cost: number;
    tax : number;
    warehouseId: number;
}