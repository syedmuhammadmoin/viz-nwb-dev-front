export interface ICwip {

    id: number,
    dateOfAcquisition: string,
    cwipAccountId: string,
    costOfAsset: number,
    assetAccountId: string,
    salvageValue: number,
    depreciationApplicability: boolean,
    depreciationId: number,
    modelType: number,
    depreciationExpenseId: string,
    accumulatedDepreciationId: string,
    useFullLife: number,
    quantinty: number,
    decLiningRate: number,
    prorataBasis: boolean,
    active: boolean

}
