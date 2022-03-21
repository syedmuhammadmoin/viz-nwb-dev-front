export interface IGeneralLedger {
   ledgerId?: number;
   accountId?: string;
   accountName?: string;
   transactionId?: number;
   docDate?: string;
   docDate2?: string;
   docType?: number;
   docNo?: string;
   description?: string;
   debit?: number;
   credit?: number;
   balance?: number;
   bId?: number;
   businessPartnerName?: string;
   organization?: string;
   department?: string;
   warehouse?: string;
   location?: string;
   isOpeningBalance?: boolean;
}
