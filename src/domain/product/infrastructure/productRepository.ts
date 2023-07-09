import { inject, injectable } from "tsyringe";
import { IHttpAdapter, IHttpAdapterOption } from "@infrastructure/types/IHttpAdapter";
import { IProductRepository } from "../types/IProductRepository";
import HttpClient from "@infrastructure/axios/http";
import { IProduct } from "../types/IProduct";
import { tokens } from "@di/tokens";
import { Config } from "@config/config";

@injectable()
export default class ProductRepository implements IProductRepository {

    private http: IHttpAdapter;

    constructor(
        @inject(tokens.Config)
        private config: Config
    ) {
        this.http = new HttpClient({
            baseURL: this.config.get().backend.core
        });
    }

    async create(data: IProduct, options?: IHttpAdapterOption): Promise<void> {
        const headers = {};
        if (options?.requestId) {
            headers["requestId"] = options?.requestId; 
        }
        await this.http.send({
            method: "POST",
            url: "/v1/product/async",
            data,
            headers
        });
    }
}