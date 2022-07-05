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
}
