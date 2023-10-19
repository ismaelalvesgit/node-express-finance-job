import { IHttpAdapterOption } from "@infrastructure/types/IHttpAdapter";
import { AxiosResponse } from "axios";
import { IEmailAdapterParams, IEmailAdapterReponse } from "@infrastructure/types/IEmailAdapter";

export interface ISystemRepository {
    sendEmailNotification(params: IEmailAdapterParams): Promise<AxiosResponse<IEmailAdapterReponse>>
    healthcheck(options?: IHttpAdapterOption): Promise<void>
}