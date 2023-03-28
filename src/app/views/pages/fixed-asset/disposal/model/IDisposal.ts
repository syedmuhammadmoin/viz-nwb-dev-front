export interface IDisposal {
  id?: number;
  docNo?: string;
  fixedAssetId?: number;
  fixedAsset?: string;
  productId?: number;
  product?: string;
  cost?: number;
  assetAcountId?: string;
  assetAcount?: string;
  salvageValue?: number;
  useFullLife?: number;
  accumulatedDepreciationId?: string;
  accumulatedDepreciation?: string;
  accumulatedDepreciationAmount?: number;
  accountReceivableId?: string;
  accountReceivable?: string;
  bookValue?: number;
  disposalDate?: string;
  disposalValue?: number;
  warehouseId?: number;
  warehouse?: string;
  businessPartnerId?: number;
  businessPartnerName?: string;
  statusId?: number;
  ledgerId?: number;
  campusId?: number;
  status?: string;
  state?: number;
  remarksList?: IRemarksList[];
  isAllowedRole?: boolean;
  isSubmit?: boolean;
}

export interface IRemarksList {
  remarks?: string;
  userName?: string;
  createdAt?: string;
}
