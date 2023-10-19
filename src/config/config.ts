import { injectable } from "tsyringe";
import { Configuration, EEnvironmentType } from "./types/IConfig";

@injectable()
export class Config {
    private readonly config: Configuration;

    constructor() {
        this.config = this.getConfigFromEnv();
    }

    public get(): Configuration {
        return this.config;
    }

    private getConfigFromEnv(): Configuration {
        return {
            ...this.getServiceConfig(),
            docs: this.getDocsConfig(),
            db: this.getDbConfig(),
            backend: this.getBackendConfig(),
            token: this.getTokenConfig(),
            apm: this.getApmConfig(),
            email: this.getEmailConfig(),
        };
    }

    private getServiceConfig() {
        return {
            serviceName: process.env["SERVICE_NAME"] || "finance-job",
            environment: process.env["NODE_ENV"] || EEnvironmentType.Develop,
            port: Number(process.env["PORT"]) || 3000,
            timezone: process.env["TZ"] || "America/Fortaleza",
            fees: {
                outsidePercent: parseInt(process.env.FEES_OUTSIDE_PERCENT || "30")
            }
        };
    }

    private getDocsConfig() {
        return {
            enabled: process.env["DOCS_ENABLED"] == "true",
        };
    }

    private getBackendConfig() {
        return {
            core: process.env["CORE_URL"] || "http://localhost:3000",
            brapi: process.env["BRAPI_URL"] || "",
            mercadoBitCoin: process.env["MERCADO_BITCOIN_URL"] || "",
            curreyncyApi: process.env["CURRENCY_URL"] || "",
            invest: process.env["INVEST_URL"] || "",
        };
    }

    private getDbConfig() {
        return {
            host: process.env["DB_HOST"] || "",
            port: parseInt(process.env["DB_PORT"] || "3306"),
            user: process.env["DB_USERNAME"] || "",
            password: process.env["DB_PASSWORD"] || "",
            database: process.env["DB_DATABASE"] || "",
            debug: process.env["DB_DEBUG"] === "true",
            pool: {
                min: parseInt(process.env["DB_POOL_MIN"] || "1"),
                max: parseInt(process.env["DB_POOL_MAX"] || "10"),
            }
        };
    }
    
    private getTokenConfig() {
        return {
            brapi: process.env["BRAPI_TOKEN"] || "",
        };
    }

    private getApmConfig() {
        return {
            serverUrl: process.env["APM_SERVER_URL"] || "",
            apiKey: process.env["APM_API_KEY"],
            secretToken: process.env["APM_SECRET_TOKEN"],
            cloudProvider: process.env["APM_CLOUND_PROVIDER"] || "none"
        };
    }

    private getEmailConfig() {
        return {
            notificator: process.env["EMAIL_USER"] || "",
            apiUrl: process.env["EMAIL_API_URL"] || "https://api.mailjet.com",
            apiKey: process.env["EMAIL_API_KEY"] || "",
            secret: process.env["EMAIL_SECRET"] || ""
        };
    }
}