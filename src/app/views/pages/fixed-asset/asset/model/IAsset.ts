export interface IAsset {
    id ?: number,
    dateofAcquisition:string,
    name: string,
    cost: number,
    productId:number,
    warehouseId:number,
    salvageValue:number,
    depreciationApplicability: boolean,
    depreciationModelId:number,
    useFullLife:number,
    assetAccountId: string,
    depreciationExpenseId: string,
    accumulatedDepreciationId: string,
    modelType: string,
    decLiningRate: number,
    prorataBasis: boolean,
    isActive: boolean,
    docId: number,
    doctype: number,
    quantity ?: number,
    isSubmit?: boolean,
  }




  