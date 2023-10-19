import { EDividendsType } from "@domain/core/types/IDividends";

export interface IProvent {
    price: number
    type: EDividendsType
    dateBasis: string
    dueDate: string
    currency: string
}

export interface IAssetEarningsModels {
    y: number
    m: number
    d: number
    ed: string
    pd: string
    et: string
    v: number
    sv: string
    sov: string
    adj: boolean
}

export interface ITickerProvents {
    assetEarningsModels: IAssetEarningsModels[]
}

export interface ITickerReports {
    dataReferencia: string
    linkPdf: string
    assunto?: string
    tipo?: string
}

export interface ITickerReportsFunds {
    id: number,
    assetMainId: number,
    rank: number,
    dataReferencia: string,
    status: number,
    statusName: string,
    link: string,
    dataEntrega: string,
    description: string
}

export interface ITickerSearch {
    id: number,
    parentId: number,
    nameFormated: string,
    name: string,
    normalizedName: string,
    code: string,
    price: string,
    variation: string,
    variationUp: boolean,
    type: number,
    url: string
}