import { IApiResponse } from "src/app/views/shared/IApiResponse";
import { IPaginationResponse } from "src/app/views/shared/IPaginationResponse";
import { IBudgetLines } from "./IBudgetLines";

export interface IBudgetDropdown extends IApiResponse<IBudgetDropdown> {
    id: number;
    budgetName: string;
    from: string;
    to: string;
    budgetLines: IBudgetLines[]
}
