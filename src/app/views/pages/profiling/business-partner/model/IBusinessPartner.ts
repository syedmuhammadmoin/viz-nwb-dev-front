export interface IBusinessPartner {
  id: number;
  businessPartnerType: string;
  //entity: string;
  address: string;
  // country: string;
  // state: string;
  // city: string;
  name: string;
  phone: string;
  mobile: string;
  //email: string;
  cnic:number;
  //website: string;
  incomeTaxId: string;
  bankName: string;
  branchCode: string;
  salesTaxId: string;
  bankAccountTitle: string;
  bankAccountNumber: string;
  accountPayableId: number;
  accountReceivableId: number;
}
