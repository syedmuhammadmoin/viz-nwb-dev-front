export interface IAsset {
    id: number;
    name: string;
    acquisitionDate: string;
    depreciationId: number;
    purchaseCost: number;
    salvageValue: number;
    depValue: number;
    depMethod: string;
    usefulLife: number;
    prorataBasis: boolean;
}