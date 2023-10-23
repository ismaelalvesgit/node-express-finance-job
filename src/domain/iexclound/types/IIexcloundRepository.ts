import { IQoute } from "./IIexclound";

export interface IIexcloundRepository { 
    getQoute(tickers: string[]): Promise<IQoute[]>
}