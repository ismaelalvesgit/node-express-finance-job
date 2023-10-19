import { inject, injectable } from "tsyringe";
import { ECommandSchedule, ICommands, ICommandsProps } from "@presentation/types/ICommand";
import { tokens } from "@di/tokens";
import { ICoreService } from "@domain/core/types/ICoreService";
import { EWhereOperator } from "@helpers/ICommon";
import { Logger } from "@infrastructure/logger/logger";
import { IInvestment } from "@domain/core/types/IInvestiment";
import Common from "@helpers/Common";
import { IBrapiService } from "@domain/brapi/types/IBrapitService";
import { isAfter, parseISO } from "date-fns";

@injectable()
export default class MarketPriceCommand implements ICommands {

    private name = "market-price";
    private group = ECommandSchedule.MINUTE;
    private schedule = "*/30 9-20 * * 1-5";

    constructor(
        @inject(tokens.CoreService)
        private coreService: ICoreService,

        @inject(tokens.BrapiService)
        private brapiService: IBrapiService
    ) { }

    private async marketPriceBR(investment: IInvestment): Promise<IInvestment | null> {
        const market = await this.brapiService.getQoute(investment.name, investment.category.name);
        const invest = investment;
        
        if (isAfter(parseISO(market.regularMarketTime), parseISO(invest.updatedAt.toISOString()))) {
            Logger.info(`Updating values investment: ${invest.name}`);
            const priceDay = market.regularMarketPrice ?? 0;
            const priceAverage = invest.priceAverage ?? 0;
            const changePercentTotal = Common.diffPercent(priceDay, priceAverage);

            invest.priceAverage = priceAverage;
            invest.priceDay = priceDay;
            invest.changePercentTotal = changePercentTotal;
            invest.currency = market.currency;
            invest.longName = market.longName;
            invest.logoUrl = invest.logoUrl || market.logourl;
            invest.priceDayHigh = market.regularMarketDayHigh ?? 0;
            invest.priceDayLow = market.regularMarketDayLow ?? 0;
            invest.changePercentDay = market.regularMarketChangePercent ?? 0;
            invest.volumeDay = market.regularMarketVolume ?? 0;
            invest.previousClosePrice = market.regularMarketPreviousClose ?? invest.previousClosePrice;
            invest.variationDay = Number(market.regularMarketChange?.toFixed(2));
            invest.variationTotal = Common.parsePercent(changePercentTotal, priceAverage) * Number(invest.qnt ?? 0);
            return invest;
        }

        return null;
    }

    async execute(requestId: string): Promise<void> {
        const content: IInvestment[] = [];
        const investments = await this.coreService.getInvestments({filterBy: [
            `balance ${EWhereOperator.GreaterThan} 0`
        ]});
        
        await Promise.all(investments.items.map(async (investment) => {
            try {
                const categoryIsBR = Common.categoryIsBR(investment.category.name);
                if(categoryIsBR){
                    const marketPrice = await this.marketPriceBR(investment);
                    if (marketPrice) content.push(marketPrice);
                }
            } catch (error) {
                Logger.error(`Faill to update investment: ${name} - error: ${error}`);
            }
        }));

        if(content.length > 0){
            await this.coreService.batchUpdateInvestment(content, {requestId});
        }
    }

    get props(): ICommandsProps {
        return {
            execute: (identify) => this.execute(identify),
            name: this.name,
            group: this.group,
            schedule: this.schedule,
        };
    }
}
