import { IBudgetLines } from "./IBudgetLines";

export interface IBudget {
    id: number;
    budgetName: string;
    from: string;
    to: string;
    budgetLines: IBudgetLines[]
}
