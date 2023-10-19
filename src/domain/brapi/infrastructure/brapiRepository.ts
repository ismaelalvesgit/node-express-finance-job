import { inject, injectable } from "tsyringe";
import { IHttpAdapter } from "@infrastructure/types/IHttpAdapter";
import { IBrapiRepository } from "../types/IBrapiRepository";
import HttpClient from "@infrastructure/axios/http";
import { tokens } from "@di/tokens";
import { Config } from "@config/config";
import { IQoute, ICoin } from "../types/IBrapi";
import { v4 as uuidv4 } from "uuid";
import { Logger } from "@infrastructure/logger/logger";

@injectable()
export default class BrapiRepository implements IBrapiRepository {

    private http: IHttpAdapter;

    constructor(
        @inject(tokens.Config)
        private config: Config
    ) {
        this.http = new HttpClient({
            baseURL: this.config.get().backend.brapi,
            params: {
                token: this.config.get().token.brapi
            },
            headers: {
                "User-Agent": uuidv4()
            }
        });
    }

    async getCoin(ticker: string): Promise<ICoin> {
        try {
            const { data } = await this.http.send<{coins: ICoin[]}>({
                url: "/v2/crypto",
                params: {
                    coin: ticker,
                    currency: "BRL"
                }
            });
            return data.coins[0];
        } catch (error) {
            Logger.error(`Failed to get quote coin brapi: ${ticker}, Error: ${error}`);
            throw error;
        }
    }
    
    async getQoute(ticker: string): Promise<IQoute> {
        try {
            const { data } = await this.http.send<{results: IQoute[]}>({
                url: `/quote/${ticker.toLocaleUpperCase()}`,
                params: {
                    fundamental: true
                }
            });
            return data.results[0];
        } catch (error) {
            Logger.error(`Failed to get quote brapi: ${ticker}, Error: ${error}`);
            throw error;
        }
    }
}