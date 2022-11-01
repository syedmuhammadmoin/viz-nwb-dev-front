export interface IBankAccount {
    id: number;
    accountNumber: string;
    accountTitle: string;
    bankName: string;
    branch: string;
    iban: string;
    campusId: number;
    bankAccountType: number,
    purpose: string,
    accountCode: string,
    openingBalance: number;
    openingBalanceDate: string;
    currency: string;
}