import { inject, injectable } from "tsyringe";
import { IEmailAdapter, IEmailAdapterParams } from "@infrastructure/types/IEmailAdapter";
import path from "path";
import { tokens } from "@di/tokens";
import { Config } from "@config/config";
import ejs, { Data } from "ejs";
import HttpClient from "@infrastructure/axios/http";
import { IHttpAdapter } from "@infrastructure/types/IHttpAdapter";
import { AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";

@injectable()
export default class EmailClient implements IEmailAdapter {

    protected templatePath: string;
    protected httpClient: IHttpAdapter;

    constructor(
        @inject(tokens.Config)
        private config: Config
    ) {
        const { email: { apiKey, secret, apiUrl } } = this.config.get();
        this.templatePath = path.resolve(__dirname, "..", "..", "presentation", "views", "mail");
        this.httpClient = new HttpClient({
            baseURL: apiUrl,
            auth: {
                username: apiKey,
                password: secret
            }
        });
    }

    /**
     * 
     * https://dev.mailjet.com/email/guides/send-api-v31/#send-a-basic-email
     *  
     */
    async send({
        to,
        subject,
        data,
        template,
        attachments,
        from,
        requestId
    }: IEmailAdapterParams): Promise<AxiosResponse> {
        return new Promise((resolver, reject) => {
            ejs.renderFile(`${this.templatePath}/${template}.ejs`, data as Data, async (err, HTMLPart) => {
                if(err){
                    reject(err);
                }

                this.httpClient.send({
                    method: "POST",
                    url: "/v3.1/send",
                    headers: {
                        requestId: requestId || uuidv4()
                    },
                    data: {
                        Messages: [
                            {
                              From: {
                                Email: from?.email ? from?.email : this.config.get().email.notificator,
                                Name: from?.name ? from.name : this.config.get().serviceName,
                              },
                              To: [
                                {
                                  Email: to.email ? to.email : this.config.get().email.notificator,
                                  Name: to.name,
                                },
                              ],
                              Subject: subject,
                              HTMLPart,
                              Attachments: attachments
                            },
                        ],
                    }
                }).then(resolver).catch(reject);
            });
        });
    }

}