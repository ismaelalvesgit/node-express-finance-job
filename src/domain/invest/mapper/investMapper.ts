import { ECategoryType } from "@domain/core/types/ICategory";
import { IProvent, ITickerProvents, ITickerReports, ITickerReportsFunds } from "../types/IInvest";
import { EDividendsType } from "@domain/core/types/IDividends";
import { IEvent } from "@domain/core/types/IEvent";
import { format } from "date-fns";
import Common from "@helpers/Common";

export default class InvestMapper {

    static parseStringToDividendType(value: string){
        switch (value) {
            case "JCP":
                return EDividendsType.JCP;
            default:
                return EDividendsType.DIVIDEND;
        }
    }

    static reportFundsMap(data: ITickerReportsFunds[]): IEvent[]{
        return data.map((report)=>{
            const dateReference = format(Common.stringToDate(report.dataReferencia, "dd/MM/yyyy", "/") || new Date(), "yyyy-MM-dd"); 
            const dateDelivery = format(Common.stringToDate(report.dataEntrega, "dd/MM/yyyy", "/") || new Date(), "yyyy-MM-dd");
            return {
                dateReference,
                dateDelivery,
                description: report.description,
                link: report.link
            } as unknown as IEvent;
        });
    }

    static reportMap(data: ITickerReports[]): IEvent[]{
        return data.map((report)=>{
            return {
                dateReference: report.dataReferencia,
                dateDelivery: new Date().toISOString(),
                link: report.linkPdf,
                description: report.assunto || report.tipo || "",
            } as unknown as IEvent;
        });
    }

    static proventMap(data: ITickerProvents, type: ECategoryType): IProvent[] {
        const currency = (type === ECategoryType.STOCKS || ECategoryType.ETF_EXT) ? "USD" : "BRL";
        const provents = data?.assetEarningsModels.filter((assets) => !assets.adj);
        return provents.map((e)=>{
            return {
                price: e.v,
                type: InvestMapper.parseStringToDividendType(e.et),
                dateBasis: e.ed,
                dueDate: e.pd,
                currency
            };
        });
    }
}