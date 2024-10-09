import { Periodicity } from "src/app/views/shared/AppEnum";

export interface ITaxSettingModel {
    salesTaxId: number;
    purchaseTaxId: number;
    periodicity: Periodicity;
    remindPeriod: number;
    journalAccountId: number;
    roundPerLine: boolean;
    roundGlobally: boolean;
    europeVAT: boolean;
    countryId: number;
}