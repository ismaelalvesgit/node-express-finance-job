import { inject, injectable } from "tsyringe";
import { ISystemRepository } from "../types/ISystemRepository";
import { tokens } from "@di/tokens";
import { IHttpAdapter, IHttpAdapterOption } from "@infrastructure/types/IHttpAdapter";
import { Config } from "@config/config";
import HttpClient from "@infrastructure/axios/http";
import EmailClient from "@infrastructure/email/email";
import { IEmailAdapterParams, IEmailAdapterReponse } from "@infrastructure/types/IEmailAdapter";
import { AxiosResponse } from "axios";

@injectable()
export default class SystemRepository implements ISystemRepository {

    private http: IHttpAdapter;

    constructor(
        @inject(tokens.Config)
        private config: Config,

        @inject(tokens.EmailClient)
        private emailClient: EmailClient,
    ) {
        this.http = new HttpClient({
            baseURL: this.config.get().backend.core
        });
    }

    sendEmailNotification(params: IEmailAdapterParams): Promise<AxiosResponse<IEmailAdapterReponse>> {
        return this.emailClient.send(params);
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

}