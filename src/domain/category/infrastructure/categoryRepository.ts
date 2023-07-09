import { inject, injectable } from "tsyringe";
import { IHttpAdapter, IHttpAdapterOption } from "@infrastructure/types/IHttpAdapter";
import { ICategoryRepository } from "../types/ICategoryRepository";
import HttpClient from "@infrastructure/axios/http";
import { ICategory } from "../types/ICategory";
import { tokens } from "@di/tokens";
import { Config } from "@config/config";
import { IQueryData, IPagination } from "@helpers/ICommon";

@injectable()
export default class CategoryRepository implements ICategoryRepository {

    private http: IHttpAdapter;

    constructor(
        @inject(tokens.Config)
        private config: Config
    ) {
        this.http = new HttpClient({
            baseURL: this.config.get().backend.core
        });
    }
    
    async find(params: Partial<IQueryData>, options?: IHttpAdapterOption): Promise<IPagination<ICategory>> {
        
        const headers = {};
        if (options?.requestId) {
            headers["requestId"] = options?.requestId; 
        }
        const { data } = await this.http.send<IPagination<ICategory>>({
            method: "GET",
            url: "/v1/category",
            headers,
            params
        });

        return data;
    }

    async create(data: ICategory, options?: IHttpAdapterOption): Promise<void> {
        const headers = {};
        if (options?.requestId) {
            headers["requestId"] = options?.requestId; 
        }

        await this.http.send({
            method: "POST",
            url: "/v1/category/async",
            data,
            headers
        });
    }
}