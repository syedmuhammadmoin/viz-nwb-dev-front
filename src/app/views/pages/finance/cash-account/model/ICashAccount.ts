export interface ICashAccount {
    id              : number;
    cashAccountName : string;
    handler         : string;
    openingBalance  : number;
    currency        : string;
}