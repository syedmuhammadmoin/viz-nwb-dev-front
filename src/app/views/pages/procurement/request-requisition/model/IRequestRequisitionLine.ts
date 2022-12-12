export interface IRequestRequisitionLines {
    id: number;
    description: string;
    quantity: number;
    cost?: number;
    tax?: number;
    accountId?: number;
    warehouseId: number;
}