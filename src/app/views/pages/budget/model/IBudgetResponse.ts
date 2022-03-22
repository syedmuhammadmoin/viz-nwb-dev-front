import { IBudgetLines } from "./IBudgetLines";

export interface IBudgetResponse {
    id: number;
    budgetName: string;
    from: string;
    to: string;
    budgetLines: IBudgetLines[]
}
