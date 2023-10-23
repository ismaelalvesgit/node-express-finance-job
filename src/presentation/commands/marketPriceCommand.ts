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
import { IIexcloundService } from "@domain/iexclound/types/IIexcloundtService";

@injectable()
export default class MarketPriceCommand implements ICommands {

    private name = "market-price";
    private group = ECommandSchedule.MINUTE;
    private schedule = "*/30 9-20 * * 1-5";

    constructor(
        @inject(tokens.CoreService)
        private coreService: ICoreService,

        @inject(tokens.BrapiService)
        private brapiService: IBrapiService,

        @inject(tokens.IexcloundService)
        private iexcloundService: IIexcloundService
    ) { }

    private async marketPriceBR(investments: IInvestment[]): Promise<IInvestment[]> {
        const content: IInvestment[] = [];
        await Promise.all(investments.map(async (investment) => {
            try {
                const market = await this.brapiService.getQoute(investment.name, investment.category.name);
                const invest = investment;
                
                if (isAfter(parseISO(market.regularMarketTime), parseISO(String(invest.updatedAt)))) {
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
                    invest.variationDay = Number(market.regularMarketChange?.toFixed(2)) || 0;
                    invest.variationTotal = Common.parsePercent(changePercentTotal, priceAverage) * Number(invest.qnt ?? 0);
                    content.push(invest);
                }
            } catch (error) {
                Logger.error(`Faill to update investment: ${investment.name} - error: ${error}`);
            }
        }));
        
        return content;
    }
    
    private async marketPriceUSD(investments: IInvestment[]): Promise<IInvestment[]> {
        const content: IInvestment[] = [];
        const symbols = investments.map((investment)=> investment.name);
        const marketPrices = await this.iexcloundService.getQoute(symbols);

        marketPrices.map((market) => {
            const invest = investments.find((investment)=> investment.name === market.symbol);

            if (
                invest !== undefined && 
                isAfter(parseISO(new Date(market.latestUpdate).toISOString()), parseISO(String(invest.updatedAt)))
            ) {
                Logger.info(`Updating values investment: ${invest.name}`);
                const priceDay = market.latestPrice ?? 0;
                const priceAverage = invest.priceAverage ?? 0;
                const changePercentTotal = Common.diffPercent(priceDay, priceAverage);
                invest.priceAverage = priceAverage;
                invest.priceDay = priceDay;
                invest.changePercentTotal = changePercentTotal;
                invest.currency = market.currency;
                invest.longName = market.companyName;
                invest.logoUrl = invest.logoUrl || market.logourl;
                invest.priceDayHigh = market?.high ?? 0;
                invest.priceDayLow = market?.low ?? 0;
                invest.changePercentDay = market.changePercent ?? 0;
                invest.volumeDay = market.volume ?? 0;
                invest.previousClosePrice = market.previousClose ?? invest.previousClosePrice;
                invest.variationDay = Number(market.change) || 0;
                invest.variationTotal = Common.parsePercent(changePercentTotal, priceAverage) * Number(invest.qnt ?? 0);
                content.push(invest);
            }
        });
        
        return content;
    }

    async execute(requestId: string): Promise<void> {
        const content: IInvestment[] = [];
        const investments = await this.coreService.getInvestments({filterBy: [
            `balance ${EWhereOperator.GreaterThan} 0`
        ]});
        
        const investmentsUSD = investments.items.filter((investment)=> !Common.categoryIsBR(investment.category.name));
        const investmentsBR = investments.items.filter((investment)=> Common.categoryIsBR(investment.category.name));

        const processUSD = await this.marketPriceUSD(investmentsUSD);
        const processBR = await this.marketPriceBR(investmentsBR);
        content.push(...processUSD, ...processBR);

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
