import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IBrapiRepository } from "../types/IBrapiRepository";
import { IQoute } from "../types/IBrapi";
import { IBrapiService } from "../types/IBrapitService";
import { ECategoryType } from "@domain/core/types/ICategory";
import BrapiMapper from "../mapper/brapiMapper";

@injectable()
export default class BrapiService implements IBrapiService {

    constructor(
        @inject(tokens.BrapiRepository)
        private brapiRepository: IBrapiRepository
    ) { }

    async getQoute(ticker: string, category: ECategoryType): Promise<IQoute> {
        if(category === ECategoryType.CRIPTOMOEDA){
            const coin = await this.brapiRepository.getCoin(ticker);
            return BrapiMapper.coinToQouteMap(coin);
        }
        return this.brapiRepository.getQoute(ticker);
    }

}
