import { inject, injectable } from "tsyringe";
import { IHttpAdapter } from "@infrastructure/types/IHttpAdapter";
import { IInvestRepository } from "../types/IInvestRepository";
import HttpClient from "@infrastructure/axios/http";
import { tokens } from "@di/tokens";
import { Config } from "@config/config";
import { IProvent, ITickerProvents, ITickerReports, ITickerReportsFunds, ITickerSearch } from "../types/IInvest";
import { v4 as uuidv4 } from "uuid";
import { ECategoryType } from "@domain/core/types/ICategory";
import R from "ramda";
import { Logger } from "@infrastructure/logger/logger";
import InvestMapper from "../mapper/investMapper";
import FormData from "form-data";
import { IEvent } from "@domain/core/types/IEvent";

@injectable()
export default class InvestRepository implements IInvestRepository {

    private http: IHttpAdapter;

    constructor(
        @inject(tokens.Config)
        private config: Config
    ) {
        this.http = new HttpClient({
            baseURL: this.config.get().backend.invest,
            headers: {
                "User-Agent": uuidv4()
            }
        });
    }

    async searchSymbol(ticker: string): Promise<ITickerSearch[]> {
        try {
            const { data } = await this.http.send<ITickerSearch[]>({
                url: "/home/mainsearchquery",
                params: {
                    q: ticker
                }
            });
    
            return data;
        } catch (error) {
            Logger.error(`Failed to get search investment: ${ticker}, Error: ${error}`);
            throw error;
        } 
    }

    private async getReportFunds(ticker: string, id?: number): Promise<IEvent[]> {
        try {
            let fundId = id;
            if(fundId === undefined){
                const searchSymbol = await this.searchSymbol(ticker);
                fundId = searchSymbol[0].id;
            }

            const { data } = await this.http.send<{initialList: ITickerReportsFunds[]}>({
                url: "/fii/getassetreports",
                params: {
                    code: ticker,
                    fundId
                }
            });
    
            return InvestMapper.reportFundsMap(data.initialList.filter((report)=> report.status === 0));
        } catch (error) {
            Logger.error(`Failed to get report investment: ${ticker}, Error: ${error}`);
            throw error;
        }
    }

    async getReport(category: ECategoryType, ticker: string): Promise<IEvent[]>{  
        if(
            category === ECategoryType.ACAO ||
            category === ECategoryType.BDR
        ){
            return this.getAssetReport(category, ticker);
        }
        return this.getReportFunds(ticker);
    }

    private async getAssetReport(category: ECategoryType,ticker: string): Promise<IEvent[]> {
        try {
            const url = category === ECategoryType.ACAO ? "/acao/getassetreports" : "/bdr/getassetreports";
            const formData = new FormData();
            formData.append("year", new Date().getFullYear().toString());
            formData.append("code", ticker);
            const { data } = await this.http.send({
                url,
                data: formData,
                headers: formData.getHeaders(), 
                method: "POST"
            });
    
            return InvestMapper.reportMap((<{data: ITickerReports[]}> <unknown>data).data);
        } catch (error) {
            Logger.error(`Failed to get report investment: ${ticker}, Error: ${error}`);
            throw error;
        }
    }
    
    async getDividens(type: ECategoryType, ticker: string, years?: 0 | 1 | 2): Promise<IProvent[]> {
        try {
            let url = "";

            switch (type) {
                case ECategoryType.FIIS:
                    url = "/fii/companytickerprovents";
                    break;
                case ECategoryType.FII_AGRO:
                    url = "/fiagro/tickerprovents";
                    break;
                case ECategoryType.FIP:
                    url = "/fip/tickerprovents";
                    break;
                case ECategoryType.FIA:
                    url = "/fia/tickerprovents";
                    break;
                case ECategoryType.FIDC:
                    url = "/fidc/tickerprovents";
                    break;
                case ECategoryType.FIINFRA:
                    url = "/fundosetorial/tickerprovents";
                    break;
                case ECategoryType.FUNDO_SETORIAL:
                    url = "/fiinfra/tickerprovents";
                    break;
                case ECategoryType.STOCKS:
                    url = "/stock/companytickerprovents";
                    break;
                case ECategoryType.ETF_EXT:
                    url = "/etfexterior/companytickerprovents";
                    break;
                case ECategoryType.REITS:
                    url = "/reit/companytickerprovents";
                    break;
                case ECategoryType.BDR:
                    url = "/bdr/companytickerprovents";
                    break;
                default:
                    url = "/acao/companytickerprovents";
            }
    
            const { data } = await this.http.send<ITickerProvents>({
                url,
                params: R.reject(R.isNil, {
                    ticker,
                    chartProventsType: years
                }),
            });
            
            return InvestMapper.proventMap(data, type);
        } catch (error) {
            Logger.error(`Failed to get provents investment: ${ticker}, Error: ${error}`);
            throw error;
        }
    }
}