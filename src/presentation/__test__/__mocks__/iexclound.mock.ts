import Common from "@helpers/Common";
import { investmentGet } from "./core.mock";

const investmentUSD = investmentGet.items.filter((invest) => !Common.categoryIsBR(invest.category.name));

export const getQoute = investmentUSD.map((invest) => {
    return {
        avgTotalVolume: 25607271,
        calculationPrice: "close",
        change: 4.48,
        changePercent: 0.01286,
        close: null,
        closeSource: "official",
        closeTime: null,
        companyName: invest.longName,
        currency: "USD",
        delayedPrice: null,
        delayedPriceTime: null,
        extendedChange: null,
        extendedChangePercent: null,
        extendedPrice: null,
        extendedPriceTime: null,
        high: null,
        highSource: null,
        highTime: null,
        iexAskPrice: 0,
        iexAskSize: 0,
        iexBidPrice: 0,
        iexBidSize: 0,
        iexClose: 353.46,
        iexCloseTime: 1699277630775,
        iexLastUpdated: 1699277630775,
        iexMarketPercent: 0.0024379732015927234,
        iexOpen: 353.46,
        iexOpenTime: 1699277630775,
        iexRealtimePrice: 353.46,
        iexRealtimeSize: 2,
        iexVolume: 379,
        lastTradeTime: 1699041599923,
        latestPrice: 352.8,
        latestSource: "Close",
        latestTime: "November 3, 2023",
        latestUpdate: 1699041600401,
        latestVolume: 155457,
        low: null,
        lowSource: null,
        lowTime: null,
        marketCap: 2622102149671,
        oddLotDelayedPrice: 352.95,
        oddLotDelayedPriceTime: 1699041583529,
        open: null,
        openTime: null,
        openSource: "official",
        peRatio: 34.15,
        previousClose: 348.32,
        previousVolume: 24348072,
        primaryExchange: "NASDAQ",
        symbol: invest.name,
        volume: 0,
        week52High: 366.01,
        week52Low: 217.86,
        ytdChange: 0.4940012680466862,
        isUSMarketOpen: false
    };
});