import { ECategoryType } from "@domain/core/types/ICategory";
import { IProvent, ITickerSearch } from "./IInvest";
import { IEvent } from "@domain/core/types/IEvent";

export interface IInvestRepository { 
    getDividens(type: ECategoryType, ticker: string, years?: 0 | 1 | 2): Promise<IProvent[]>
    getReport(category: ECategoryType, ticker: string): Promise<IEvent[]>
    searchSymbol(ticker: string): Promise<ITickerSearch[]>
}