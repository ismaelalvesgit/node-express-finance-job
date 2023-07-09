import { inject, injectable } from "tsyringe";
import { ISystemRepository } from "../types/ISystemRepository";
import { tokens } from "@di/tokens";
import { IHttpAdapter } from "@infrastructure/types/IHttpAdapter";
import { Config } from "@config/config";
import HttpClient from "@infrastructure/axios/http";

@injectable()
export default class SystemRepository implements ISystemRepository {

    private http: IHttpAdapter;

    constructor(
        @inject(tokens.Config)
        private config: Config
    ) {
        this.http = new HttpClient({
            baseURL: this.config.get().backend.core
        });
    }

    async healthcheck(): Promise<void> {
        await this.http.send({
            url: "/v1/system/healthcheck"
        });
    }

}