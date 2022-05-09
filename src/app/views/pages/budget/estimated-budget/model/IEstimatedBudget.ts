import { IEstimatedBudgetLines } from "./IEstimatedBudgetLines";

export interface IEstimatedBudget {
    id: number;
    budgetId: number;
    estimatedBudgetName: string;
    estimatedBudgetLines: IEstimatedBudgetLines[]
}

