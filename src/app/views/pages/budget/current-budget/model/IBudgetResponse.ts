export interface IBudgetResponse {
    id: number;
    budgetName: string;
    from: string;
    to: string;
    campusId: number;
    budgetLines: [
        {
            id: number,
            accountId: number,  
            accountName: string, 
            amount: number
        }
    ]
}
