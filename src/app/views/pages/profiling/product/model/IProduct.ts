export interface IProduct {
    id: number;
    productName: string;
    productType: number;
    categoryId: number;
    salesPrice: number;
    purchasePrice: number;
    costAccountId?: number,
    inventoryAccountId?: number,
    revenueAccountId?: number,
    unitOfMeasurementId: number;
    salesTax: number;
    barcode: string;
    acquisitionDate: Date;
    depreciationModelId: number;
    salvageValue: number;
    depreciableValue: number;
    method: string;
    usefulLife: number;
    decliningRate: number;
    prorataBasis: boolean;
}
