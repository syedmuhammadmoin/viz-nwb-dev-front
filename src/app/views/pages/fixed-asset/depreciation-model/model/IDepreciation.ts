export interface IDepreciation {
    id: number;
    name: string;
    method: number;
    assetAccount: string;
    depExpenseAccount: string;
    accumulatedDepAccount: string;
    usefulLife: number;
    decliningRate: number;
    assetCategoryId: number;
}