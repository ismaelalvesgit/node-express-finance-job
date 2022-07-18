import { investmentService, brapiService, queueService } from "../services";
import { isAfter, parseISO } from "date-fns";
import { Logger } from "../logger";
import { diffPercent, getPercent, parsePercent } from "../utils";
import categoryType from "../enum/categoryType";

const name = "notify-crypto-price";
const group = "second";
const schedule = "*/30 * * * * *";
const deadline = 180;

const command = async () => {
    const key = "/update-investment";
    const router = "notify-price";
    const routingKey = "notify-price-socket";
    const investments = await investmentService.findAll({"category.name": categoryType.CRIPTOMOEDA});
    await Promise.all(investments.map(async (invest) => {
        try {
            const qoute = await brapiService.findQouteCoin2(invest.name);
            if (isAfter(parseISO(qoute.regularMarketTime), parseISO(invest.updatedAt))) {
                const priceAverage = invest.priceAverage ?? 0;
                const priceDay =  Number(qoute.regularMarketPrice || 0);
                const priceDayHigh = qoute.regularMarketDayHigh ?? invest.priceDayHigh;
                const priceDayLow = qoute.regularMarketDayLow ?? invest.priceDayLow;
                const volumeDay = qoute.regularMarketVolume;
                const previousClosePrice = Number(qoute.regularMarketPreviousClose || 0);
                const variationDay = previousClosePrice - priceDay;
                const changePercentDay = getPercent(variationDay, priceDay);
                const changePercentTotal = diffPercent(priceDay, priceAverage); 
                const variationTotal = parsePercent(changePercentTotal, priceAverage) * Number(invest.qnt ?? 0);
                await queueService.publishQeue({
                    router,
                    routingKey,
                    content: {
                        key,
                        data: Object.assign(invest, {
                            priceDay,
                            priceDayHigh,
                            priceDayLow,
                            volumeDay,
                            previousClosePrice,
                            variationDay,
                            changePercentDay,
                            changePercentTotal,
                            variationTotal,
                            updatedAt: new Date()
                        })
                    }
                });
            }
        } catch (error) {
            Logger.error(`Faill to notify investment: ${invest.name} - error: ${error}`);
        }
    }));

    return `Execute ${name} done`;
};

export {
    command,
    name,
    group,
    schedule,
    deadline,
};