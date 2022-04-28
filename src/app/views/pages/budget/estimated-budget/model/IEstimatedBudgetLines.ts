export interface IEstimatedBudgetLines {
    id: number;
    accountId: number;   
    amount: number;
    calculationType: number;
    value: number;
    estimatedValue?: number;
}
