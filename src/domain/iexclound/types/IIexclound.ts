export interface IQoute {
    avgTotalVolume: number,
    calculationPrice: string,
    logourl: string,
    change: number,
    changePercent: number,
    close?: number,
    closeSource: string,
    closeTime?: number,
    companyName: string,
    currency: string,
    delayedPrice?: number,
    delayedPriceTime?: number,
    extendedChange?: number,
    extendedChangePercent?: number,
    extendedPrice?: number,
    extendedPriceTime?: number,
    high?: number,
    highSource?: number,
    highTime?: number,
    iexAskPrice: number,
    iexAskSize: number,
    iexBidPrice: number,
    iexBidSize: number,
    iexClose: number,
    iexCloseTime: number,
    iexLastUpdated: number,
    iexMarketPercent: number,
    iexOpen: number,
    iexOpenTime: number,
    iexRealtimePrice: number,
    iexRealtimeSize: number,
    iexVolume: number,
    lastTradeTime: number,
    latestPrice: number,
    latestSource: string,
    latestTime: string,
    latestUpdate: number,
    latestVolume: number,
    low?: number,
    lowSource?: number,
    lowTime?: number,
    marketCap: number,
    oddLotDelayedPrice?: number,
    oddLotDelayedPriceTime?: number,
    open?: number,
    openTime?: number,
    openSource: string,
    peRatio: number,
    previousClose: number,
    previousVolume: number,
    primaryExchange: string,
    symbol: string,
    volume: number,
    week52High: number,
    week52Low: number,
    ytdChange: number,
    isUSMarketOpen: boolean
}