import { ECategoryType } from "@domain/core/types/ICategory";
import { IProvent } from "./IInvest";
import { IEvent } from "@domain/core/types/IEvent";

export interface IInvestService { 
    getDividens(type: ECategoryType, ticker: string, years?: 0 | 1 | 2): Promise<IProvent[]>
    getReport(category: ECategoryType, ticker: string): Promise<IEvent[]>
}