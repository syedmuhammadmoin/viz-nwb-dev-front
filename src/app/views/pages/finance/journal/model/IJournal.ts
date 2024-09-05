import { JournalType } from "src/app/views/shared/AppEnum";
import { IJournalLines } from "./IJournalLines";

export interface IJournal {
      id: number;
      name: string;
      type: JournalType;
      defaultAccountId: string;
      campusId: number;
      isSubmit?: any;
      suspenseAccountId: string;
      profitAccountId: string;
      lossAccountId: string;
      bankAcountId: string;
      bankAccountNumber: string;
      cashAccountId: string;
}
