import { ICoin, IQoute } from "./IBrapi";

export interface IBrapiRepository { 
    getQoute(ticker: string): Promise<IQoute>
    getCoin(ticker: string): Promise<ICoin>
}