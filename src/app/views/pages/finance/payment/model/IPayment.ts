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
  salesTax: number;
  incomeTax: number;
  srbTax : number;
  campusId: number;
  documentLedgerId: number;
  chequeNo?: number;
  deduction: number;
  deductionAccountId: number;
  isSubmit?: any;
}
