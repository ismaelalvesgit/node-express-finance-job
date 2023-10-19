import { inject, injectable } from "tsyringe";
import { ICoreService } from "../types/ICoreService";
import { tokens } from "@di/tokens";
import { ICoreRepository } from "../types/ICoreRepository";
import { IHttpAdapterOption } from "@infrastructure/types/IHttpAdapter";
import { IQueryData, IPagination } from "@helpers/ICommon";
import { IEvent } from "../types/IEvent";
import { IInvestment } from "../types/IInvestiment";
import { IDividends } from "../types/IDividends";

@injectable()
export default class CoreService implements ICoreService {

    constructor(
        @inject(tokens.CoreRepository)
        private coreRepository: ICoreRepository
    ) { }

    healthcheck(options?: IHttpAdapterOption): Promise<void> {
        return this.coreRepository.healthcheck(options);
    }

    syncBalance(options?: IHttpAdapterOption): Promise<void> {
        return this.coreRepository.syncBalance(options);
    }

    syncDividendsPaid(dueDate: Date, options?: IHttpAdapterOption): Promise<void> {
        return this.coreRepository.syncDividendsPaid(dueDate, options);
    }

    getInvestments(params: IQueryData, options?: IHttpAdapterOption): Promise<IPagination<IInvestment>> {
        return this.coreRepository.getInvestments(params, options);
    }

    batchUpdateInvestment(data: Partial<IInvestment>[], options?: IHttpAdapterOption): Promise<void> {
        return this.coreRepository.batchUpdateInvestment(data, options);
    }
    
    batchCreatedEvent(data: Partial<IEvent>[], options?: IHttpAdapterOption): Promise<void> {
        return this.coreRepository.batchCreatedEvent(data, options);
    }
    
    batchCreatedDividends(data: Partial<IDividends>[], options?: IHttpAdapterOption): Promise<void> {
        return this.coreRepository.batchCreatedDividends(data, options);
    }

}
