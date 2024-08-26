import { JournalType } from "src/app/views/shared/AppEnum";
import { IJournalLines } from "./IJournalLines";

export interface IJournal {
      id                : number;
      name              : string;
      type              : JournalType;
      DefaultAccount    : string;
      campusId          : number;
      JournalLines : IJournalLines[];
      isSubmit?         : any;
}
