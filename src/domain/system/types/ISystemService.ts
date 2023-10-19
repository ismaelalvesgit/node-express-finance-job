import { IEmailAdapterParams } from "@infrastructure/types/IEmailAdapter";
import { IHttpAdapterOption } from "@infrastructure/types/IHttpAdapter";
import { AxiosResponse } from "axios";

export interface ISystemService {
    sendEmailNotification(params: IEmailAdapterParams): Promise<AxiosResponse>
    healthcheck(options?: IHttpAdapterOption): Promise<void>
}