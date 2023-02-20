export interface IIssuanceLines {
    id: number;
    itemId: number;
    description: string;
    quantity: number;
    cost?: number;
    tax?: number;
    accountId?: number;
    warehouseId: number;
    fixedAssetId: number;
}
