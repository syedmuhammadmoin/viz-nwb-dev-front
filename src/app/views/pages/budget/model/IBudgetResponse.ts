import { IPaginationResponse } from "src/app/views/shared/IPaginationResponse";
import { IBudgetLines } from "./IBudgetLines";

export interface IBudgetResponse extends IPaginationResponse<IBudgetResponse> {
    id: number;
    budgetName: string;
    from: string;
    to: string;
    budgetLines: IBudgetLines[]
}
