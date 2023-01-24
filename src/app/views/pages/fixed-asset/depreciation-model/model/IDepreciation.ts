export interface IDepreciation{
    id: number,
    modelName: string,
    useFullLife: number,
    assetAccountId: string,
    depreciationExpenseId: string,
    accumulatedDepreciationId: string,
    modelType: number,
    decliningRate: number
  }

