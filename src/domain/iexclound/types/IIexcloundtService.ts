import { IQoute } from "./IIexclound";

export interface IIexcloundService { 
    getQoute(tickers: string[]): Promise<IQoute[]>
}