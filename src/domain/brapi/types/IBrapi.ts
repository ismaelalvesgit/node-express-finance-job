export interface IQoute {
    symbol: string
    shortName: string
    logourl: string
    longName: string
    currency: string
    currencyRateFromUSD: number
    regularMarketPrice: number
    regularMarketOpen: number
    regularMarketPreviousClose: number
    regularMarketDayHigh: number
    regularMarketDayLow: number
    regularMarketVolume: number
    regularMarketDayRange: string
    regularMarketChange: number
    regularMarketChangePercent: number
    regularMarketTime: string
    averageDailyVolume3Month: number
    averageDailyVolume10Day: number
    fiftyTwoWeekLowChange: number
    fiftyTwoWeekLowChangePercent?: number
    fiftyTwoWeekRange: string
    fiftyTwoWeekHighChange: number
    fiftyTwoWeekHighChangePercent: number
    fiftyTwoWeekLow: number
    fiftyTwoWeekHigh: number
    priceEarnings: number
    earningsPerShare: number
    marketCap: number
    updatedAt: Date
    historicalDataPrice: IQouteHistoricalPrice[]
}

export interface IQouteHistoricalPrice {
    date: number
    open: number
    high: number
    low: number
    close: number
    volume: number
    adjustedClose: number
}

export enum ERangeTime {
    D1 = "1d",
    D5 ="5d",
    MO1 = "1mo",
    MO3 = "3mo",
    MO6 = "6mo",
    Y1 = "1y",
    Y2 = "2y",
    Y5 = "5y",
    Y10 = "10y",
    YTD = "ytd",
    MAX ="max"
}

export interface ICoin {
    currency: string
    currencyRateFromUSD: number
    coinName: string
    coin: string
    regularMarketChange: number
    regularMarketPrice: number
    regularMarketChangePercent: number
    regularMarketDayLow: number
    regularMarketDayHigh: number
    regularMarketDayRange: string
    regularMarketVolume: number
    marketCap: number
    regularMarketTime: number
    coinImageUrl: string
}