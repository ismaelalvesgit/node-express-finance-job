import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IInvestRepository } from "../types/IInvestRepository";
import { ECategoryType } from "@domain/core/types/ICategory";
import { IProvent } from "../types/IInvest";
import { IInvestService } from "../types/IInvestService";
import { IEvent } from "@domain/core/types/IEvent";

@injectable()
export default class InvestService implements IInvestService {

    constructor(
        @inject(tokens.InvestRepository)
        private investRepository: IInvestRepository
    ) { }

    getDividens(type: ECategoryType, ticker: string, years?: 0 | 1 | 2): Promise<IProvent[]> {
        return this.investRepository.getDividens(type, ticker, years);
    }

    getReport(category: ECategoryType, ticker: string): Promise<IEvent[]> {
        return this.investRepository.getReport(category, ticker);
    }

}
