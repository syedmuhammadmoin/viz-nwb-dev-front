import { TaxType } from "src/app/views/shared/AppEnum";

export interface ITax {
    id: number;
    accountId: string;
    name: string;
    taxType: TaxType;
}