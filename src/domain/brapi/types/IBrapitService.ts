import { ECategoryType } from "@domain/core/types/ICategory";
import { IQoute } from "./IBrapi";

export interface IBrapiService { 
    getQoute(ticker: string, category: ECategoryType): Promise<IQoute>
}