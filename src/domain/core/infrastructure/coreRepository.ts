import { inject, injectable } from "tsyringe";
import { IHttpAdapter, IHttpAdapterOption } from "@infrastructure/types/IHttpAdapter";
import { ICoreRepository } from "../types/ICoreRepository";
import HttpClient from "@infrastructure/axios/http";
import { tokens } from "@di/tokens";
import { Config } from "@config/config";
import { IPagination, IQueryData } from "@helpers/ICommon";
import { IInvestment } from "../types/IInvestiment";
import { IEvent } from "../types/IEvent";
import { IDividends } from "../types/IDividends";

@injectable()
export default class CoreRepository implements ICoreRepository {

    private http: IHttpAdapter;

    constructor(
        @inject(tokens.Config)
        private config: Config
    ) {
        this.http = new HttpClient({
            baseURL: this.config.get().backend.core
        });
    }

    private setHeaders(options?: IHttpAdapterOption){
        const headers = {};
        if (options?.requestId) {
            headers["requestId"] = options?.requestId; 
        }

        return headers;
    }
    
    async healthcheck(options?: IHttpAdapterOption): Promise<void> {
        const headers = this.setHeaders(options);
        await this.http.send({
            url: "/v1/system/healthcheck",
            headers
        });
    }

    async syncBalance(options?: IHttpAdapterOption): Promise<void> {
        const headers = this.setHeaders(options);
        await this.http.send({
            method: "PUT",
            url: "/v1/investment/syncBalance",
            headers
        });
    }

    async getInvestments(params: IQueryData, options?: IHttpAdapterOption): Promise<IPagination<IInvestment>> {
        const headers = this.setHeaders(options);
        const { data } = await this.http.send<IPagination<IInvestment>>({
            url: "/v1/investment",
            headers,
            params
        });
        return data;
    }

    async batchUpdateInvestment(data: Partial<IInvestment>[], options?: IHttpAdapterOption): Promise<void> {
        const headers = this.setHeaders(options);
        await this.http.send({
            method: "PUT",
            url: "/v1/investment/batch",
            headers,
            data
        });
    }

    async batchCreatedEvent(data: Partial<IEvent>[], options?: IHttpAdapterOption): Promise<void> {
        const headers = this.setHeaders(options);
        await this.http.send({
            method: "POST",
            url: "/v1/events/batch",
            headers,
            data
        });
    }

    async batchCreatedDividends(data: Partial<IDividends>[], options?: IHttpAdapterOption): Promise<void> {
        const headers = this.setHeaders(options);
        await this.http.send({
            method: "POST",
            url: "/v1/dividends/autoCreate",
            headers,
            data
        });
    }

    async syncDividendsPaid(dueDate: Date, options?: IHttpAdapterOption): Promise<void> {
        const headers = this.setHeaders(options);
        await this.http.send({
            method: "POST",
            url: "/v1/dividends/autoPaid",
            headers,
            data: {
                dueDate
            }
        });
    }
}