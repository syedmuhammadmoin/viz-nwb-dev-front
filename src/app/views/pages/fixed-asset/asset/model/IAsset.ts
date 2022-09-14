export interface IAsset {
    id: number;
    name: string;
    assetType: number;
    acquisitionDate: string;
    depreciationModelId: number;
    purchasePrice: number;
    salvageValue: number;
    accumulatedDepreciation: number;
    accountingDate: string;
    depreciationMethod: number,
    usefulLife: number,
    decliningRate: number,
    categoryId: number,
    correspondingAccountId: number,
    prorataBasis: boolean;
}