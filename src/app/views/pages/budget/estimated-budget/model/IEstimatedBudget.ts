import { IBudget } from "../../current-budget/model/IBudget";
import { IEstimatedBudgetLines } from "./IEstimatedBudgetLines";

export interface IEstimatedBudget {
    id: number;
    budgetId: number;
    from :string;
    to: string;
    campusId: number;
    previousBudget: IBudget;
    estimatedBudgetName: string;
    estimatedBudgetLines: IEstimatedBudgetLines[],
    isSubmit?: any;
}

