import { IEntity } from "@helpers/ICommon";
import { ICategory } from "./ICategory";

export interface IInvestment extends IEntity {
    name: string
    longName: string
    logoUrl: string
    balance: number
    priceAverage: number
    qnt: number
    tradingAmount: number
    percent: number
    percentCategory: number
    currency: string
    sector: string
    volumeDay: number
    previousClosePrice: number
    variationDay: number
    variationDayTotal: number
    variationTotal: number
    changePercentDay: number
    changePercentTotal: number
    priceDay: number
    priceDayHigh: number
    priceDayLow: number
    category: ICategory
}