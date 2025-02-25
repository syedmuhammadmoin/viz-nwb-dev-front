export interface ICategory {
    id: number;
    name: string;
    inventoryAccountId: number;
    revenueAccountId: number;
    costAccountId: number;
    isFixedAsset: boolean;
    depreciationModelId: number
}