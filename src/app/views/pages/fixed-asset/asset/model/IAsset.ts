export interface IAsset {
    id: number;
    name: string;
    acquisitionDate: string;
    depreciationModelId: number;
    purchaseCost: number;
    salvageValue: number;
    depreciableValue: number;
    accountingDate: string;
    depreciationMethod: number,
    usefulLife: number,
    decliningFactor: number,
    categoryId: number,
    correspondingAccountId: number,
    prorataBasis: boolean;
}