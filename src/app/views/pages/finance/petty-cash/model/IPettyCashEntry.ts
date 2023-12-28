import { IPettyCashEntryLines } from "./IPettyCashEntryLines";

export interface IPettyCashEntry {
      id                : number;
      date              : string;
      description       : string;
      campusId          : number;
      openingBalance    : number;
      closingBalance    : number;
      pettyCashLines    : IPettyCashEntryLines[];
      isSubmit?         : any;
      accountId         :number;
}
