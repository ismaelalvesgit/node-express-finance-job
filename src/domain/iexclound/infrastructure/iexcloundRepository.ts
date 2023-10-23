import { inject, injectable } from "tsyringe";
import { IHttpAdapter } from "@infrastructure/types/IHttpAdapter";
import { IIexcloundRepository } from "../types/IIexcloundRepository";
import HttpClient from "@infrastructure/axios/http";
import { tokens } from "@di/tokens";
import { Config } from "@config/config";
import { IQoute } from "../types/IIexclound";
import { Logger } from "@infrastructure/logger/logger";
import IexcloundMapper from "../mapper/iexcloundMapper";

@injectable()
export default class IexcloundRepository implements IIexcloundRepository {

    private http: IHttpAdapter;

    constructor(
        @inject(tokens.Config)
        private config: Config
    ) {
        this.http = new HttpClient({
            baseURL: this.config.get().backend.iexclound,
            params: {
                token: this.config.get().token.iexclound
            }
        });
    }
    
    async getQoute(tickers: string[]): Promise<IQoute[]> {
        const ticker = tickers.join(",");
        try {
            const { data } = await this.http.send<IQoute[]>({
                url: `/v1/data/core/quote/${ticker}`
            });
            return IexcloundMapper.toQouteMap(data);
        } catch (error) {
            Logger.error(`Failed to get quote iexclound: ${ticker}, Error: ${error}`);
            throw error;
        }
    }
}