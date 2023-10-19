import { ICoin, IQoute } from "../types/IBrapi";

export default class BrapiMapper {

    static coinToQouteMap(data: ICoin): IQoute {
        return {
            symbol: data.coin,
            longName: data.coinName,
            logourl: data.coinImageUrl,
            currency: data.currency,
            currencyRateFromUSD: data.currencyRateFromUSD,
            regularMarketPrice: data.regularMarketPrice,
            regularMarketDayHigh: data.regularMarketDayHigh,
            regularMarketDayLow: data.regularMarketDayLow,
            regularMarketDayRange: data.regularMarketDayRange,
            regularMarketChange: data.regularMarketChange,
            regularMarketChangePercent: data.regularMarketChangePercent,
            regularMarketTime: new Date(Number(data.regularMarketTime) * 1000).toISOString(),
            marketCap: data.marketCap,
            regularMarketVolume: data.regularMarketVolume,
        } as IQoute;
    }
}