export interface IDisposal {

    id: number,
    assetId: number,
    categoryId: number,
    purchaseCost: number,
    salvageValue: number,
    usefulLife: number,
    accumulatedDepreciationId: string,
    bookValue: number,
    disposalDate: string,
    disposalValue: number,
    warehouseId: number,
    isSubmit: boolean

}
