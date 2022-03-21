export interface IPayment {
  id: number;  
  accountId: number;
  businessPartnerId: number;
  paymentType: number;
  paymentRegisterType: number;
  paymentDate: string;
  paymentRegisterId: number;
  description: string;
  grossPayment: number;
  discount: number;
  salesTax: number;
  incomeTax: number;
  //documentTransactionId: number;
  isSubmit?: any;
}
