import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IIexcloundRepository } from "../types/IIexcloundRepository";
import { IQoute } from "../types/IIexclound";
import { IIexcloundService } from "../types/IIexcloundtService";

@injectable()
export default class IexcloundService implements IIexcloundService {

    constructor(
        @inject(tokens.IexcloundRepository)
        private iexcloundRepository: IIexcloundRepository
    ) { }

    async getQoute(tickers: string[]): Promise<IQoute[]> {
        return this.iexcloundRepository.getQoute(tickers);
    }

}
