export interface IDisposal {

    id: number,
    fixedAssetId: number,
    productId: number,
    cost: number,
    salvageValue: number,
    usefulLife: number,
    accumulatedDepreciationId: string,
    disposalDate: string,
    disposalValue: number,
    warehouseId: number,
    isSubmit?: boolean

    

}

