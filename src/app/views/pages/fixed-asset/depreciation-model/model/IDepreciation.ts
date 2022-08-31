export interface IDepreciation {
    id: number;
    name: string;
    method: number;
    assetAccountId: number;
    depExpenseAccountId: number;
    accumulatedDepAccountId: number;
    usefulLife: number;
    decliningRate: number;
    //assetCategoryId: number;
}