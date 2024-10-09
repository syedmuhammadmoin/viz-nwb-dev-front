export interface ICurrency {
    id: number;
    code: string
    symbol: string
    name: string
    unit: string
    subUnit: string
    UnitPerUSD: number
    USDPerUnit: number
    currencyLines:ICurrencyLine[]
}

export interface ICurrencyLine {
    id: number
    currencyId: number;
    date: Date;
    unitPerUSD: number;
    USDPerUnit: number
}

