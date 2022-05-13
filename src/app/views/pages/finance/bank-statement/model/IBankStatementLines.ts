export class IBankStatementLines {
  id: number;
  reference: number;
  stmtDate: Date;
  label: string;
  debit: number;
  credit: number;
  cumulativeBalance?: number;
}
