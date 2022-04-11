export interface IBankAccount {
    id: number;
    accountNumber: number;
    accountTitle: string;
    bankName: string;
    branch: string;
    campusId: number;
    bankAccountType: number,
    purpose: string,
    openingBalance: number;
    openingBalanceDate: string;
    currency: string;
}