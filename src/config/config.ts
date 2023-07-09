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
            backend: this.getBackendConfig(),
            apm: this.getApmConfig(),
        };
    }

    private getServiceConfig() {
        return {
            serviceName: process.env["SERVICE_NAME"] || "example-horizontal-job",
            environment: process.env["NODE_ENV"] || EEnvironmentType.Develop,
            port: Number(process.env["PORT"]) || 3000,
            timezone: process.env["TZ"] || "America/Fortaleza"
        };
    }

    private getDocsConfig() {
        return {
            enabled: process.env["DOCS_ENABLED"] == "true",
        };
    }

    private getBackendConfig() {
        return {
            core: process.env["CORE_API_URL"] || "http://localhost:3000"
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
}