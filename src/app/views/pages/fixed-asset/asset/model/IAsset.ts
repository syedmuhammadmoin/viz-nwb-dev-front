export interface IAsset {
    id: number,
    dateofAcquisition:string,
    name: string,
    purchaseCost: number,
    categoryId:number,
    salvageValue:number,
    warehouseId:number,
    depreciationApplicability: boolean,
    depreciationId:number,
    modelType: string,
    assetAccountId: string,
    depreciationExpenseId: string,
    accumulatedDepreciationId: string,
    useFullLife:number,
    decLiningRate: number,
    isSubmit?: boolean,
    prorataBasis: boolean,
    active: boolean
  }


  