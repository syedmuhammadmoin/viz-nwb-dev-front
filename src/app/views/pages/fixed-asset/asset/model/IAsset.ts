export interface IAsset {
    id: number,
    dateofAcquisition:string,
    name: string,
    purchaseCost: number,
    categoryId:number,
    salvageValue:number,
    depreciationApplicability: boolean,
    depreciationId:number,
    modelType: string,
    assetAccountId: string,
    depreciationExpenseId: string,
    accumulatedDepreciationId: string,
    useFullLife:number,
    decLiningRate: number,
    prorataBasis: true,
    active: boolean
  }

//   id: number;
//   name: string;
//   assetType: number;
//   acquisitionDate: string;
//   depreciationModelId: number;
//   purchasePrice: number;
//   salvageValue: number;
//   accumulatedDepreciation: number;
//   accountingDate: string;
//   depreciationMethod: number,
//   usefulLife: number,
//   decliningRate: number,
//   categoryId: number,
//   correspondingAccountId: number,
//   prorataBasis: boolean;
//   isActive: boolean;

  