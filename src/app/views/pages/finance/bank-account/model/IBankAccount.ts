export interface IBankAccount {
    id: number;
    accountNumber: number;
    accountTitle: string;
    bankName: string;
    branch: string;
    campusId: number;
    openingBalance: number;
    openingBalanceDate: Date;
    currency: string;
}