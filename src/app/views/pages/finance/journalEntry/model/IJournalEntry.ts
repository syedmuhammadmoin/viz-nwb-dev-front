import { IJournalEntryLines } from "./IJournalEntryLines";

export interface IJournalEntry {
      id                : number;
      date              : string;
      description       : string;
      campusId : number;
      journalEntryLines : IJournalEntryLines[];
      isSubmit?         : any;
}
