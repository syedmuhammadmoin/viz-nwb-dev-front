export interface IAsset {
    id: number;
    name: string;
    acquisitionDate: string;
    depreciationModelId: number;
    purchaseCost: number;
    salvageValue: number;
    depValue: number;
    //depMethod: string;
    //usefulLife: number;
    prorataBasis: boolean;
}