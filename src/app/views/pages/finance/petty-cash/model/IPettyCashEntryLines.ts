export interface IPettyCashEntryLines {
    id              : number;
    accountId         : number;
    businessPartnerId : number;
    description     : string;
    debit           : number;
    credit          : number;
    date            : Date;
}