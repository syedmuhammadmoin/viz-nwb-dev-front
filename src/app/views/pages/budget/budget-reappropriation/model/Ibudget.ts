import { IBudgetLines } from './IbudgetLines'

export interface IBudget {
    id: number;
    budgetId: string
    budgetReappropriationDate: string
    budgetReappropriationLines: IBudgetLines[];
    isSubmit?: true
} 
