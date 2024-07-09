export interface IDepreciationAdjustment {
   id?: number;
   docNo?: string;
   dateOfDepreciationAdjustment?: string;
   description?: string;
   statusId?: number;
   status?: string;
   state?: number;
   transactionId?: number;
   isAllowedRole?: boolean;
   isSubmit?: boolean;
   remarksList?: IRemarksList[];
   depreciationAdjustmentLines?: IDepreciationAdjustmentLines[] | any;
}

export interface IRemarksList {
   remarks?: string;
   userName?: string;
   createdAt?: string;
}

export interface IDepreciationAdjustmentLines {
   id?: number;
   fixedAssetId?: number;
   fixedAsset?: string;
   level4Id?: string;
   level4?: string;
   description?: string;
   debit?: number;
   credit?: number;
   isActive?: boolean;
   masterId?: number;
}
