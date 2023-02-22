export interface ICwip {

    id: number,
    name: string,
    dateOfAcquisition: string,
    cwipAccountId: string,
    cost: number,
    productId: number,
    warehouseId: number,
    salvageValue: number,
    depreciationApplicability: boolean,
    depreciationModelId: number,
    useFullLife: number,
    assetAccountId: string,
    depreciationExpenseId: string,
    accumulatedDepreciationId: string,
    modelType: number,
    decLiningRate: number,
    quantity: number,
    prorataBasis: boolean,
    isActive: boolean,
    isSubmit: boolean

}

