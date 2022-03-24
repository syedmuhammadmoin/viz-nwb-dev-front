export interface IBudgetResponse {
    id: number;
    budgetName: string;
    from: string;
    to: string;
    budgetLines: [
        {
            id: number,
            accountId: number,  
            accountName: string, 
            amount: number
        }
    ]
}
