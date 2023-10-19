import { IPagination, IQueryData } from "@helpers/ICommon";
import { IHttpAdapterOption } from "@infrastructure/types/IHttpAdapter";
import { IInvestment } from "./IInvestiment";
import { IEvent } from "./IEvent";
import { IDividends } from "./IDividends";

export interface ICoreService { 
    healthcheck(options?: IHttpAdapterOption): Promise<void>
    syncBalance(options?: IHttpAdapterOption): Promise<void>
    syncDividendsPaid(dueDate: Date, options?: IHttpAdapterOption): Promise<void>
    getInvestments(params: IQueryData, options?: IHttpAdapterOption): Promise<IPagination<IInvestment>>
    batchUpdateInvestment(data: Partial<IInvestment>[], options?: IHttpAdapterOption): Promise<void>
    batchCreatedEvent(data: Partial<IEvent>[], options?: IHttpAdapterOption): Promise<void>
    batchCreatedDividends(data: Partial<IDividends>[], options?: IHttpAdapterOption): Promise<void>
}