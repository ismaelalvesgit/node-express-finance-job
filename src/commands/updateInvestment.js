import { iexcloundService, coreApiService } from "../services";
import { isAfter, parseISO } from "date-fns";
import { Logger } from "../logger";
import { categoryIsBR, diffPercent, findBrapiQoute, parsePercent } from "../utils";

const name = "update-investment";
const group = "minute";
const schedule = "*/10 9-20 * * 1-5";
const deadline = 180;

const command = async () => {
    const content = [];
    const investments = await coreApiService.getInvestment();
    await Promise.all(investments.map(async (invest) => {
        try {
            const qoute = categoryIsBR(invest.category.name) ? await findBrapiQoute(invest.category.name, invest.name) :
                await iexcloundService.findQoute(invest.name);

            if (isAfter(parseISO(qoute.regularMarketTime), parseISO(invest.updatedAt))) {
                Logger.info(`Updating values investment: ${invest.name}`);
                const currency = qoute.currency;
                const priceAverage = invest.priceAverage ?? 0;
                const longName = qoute.longName;
                const logoUrl = qoute.logourl;
                const priceDay = qoute.regularMarketPrice;
                const priceDayHigh = qoute.regularMarketDayHigh;
                const priceDayLow = qoute.regularMarketDayLow;
                const changePercentDay = qoute.regularMarketChangePercent;
                const volumeDay = qoute.regularMarketVolume;
                const previousClosePrice = qoute.regularMarketPreviousClose ?? invest.previousClosePrice;
                const variationDay = qoute.regularMarketChange?.toFixed(2);
                const changePercentTotal = diffPercent(priceDay, priceAverage);
                const variationTotal = parsePercent(changePercentTotal, priceAverage) * Number(invest.qnt ?? 0);
                content.push({
                    id: invest.id,
                    logoUrl,
                    longName,
                    priceDay,
                    priceDayHigh,
                    priceDayLow,
                    changePercentDay,
                    volumeDay,
                    previousClosePrice,
                    variationDay,
                    changePercentTotal,
                    variationTotal,
                    currency
                });
            }
        } catch (error) {
            Logger.error(`Faill to update investment: ${invest.name} - error: ${error}`);
        }
    }));
    if(content.length > 0){
        await coreApiService.batchInvestment(content);
    }
    return `Execute ${name} done`;
};

export {
    command,
    name,
    group,
    schedule,
    deadline,
};