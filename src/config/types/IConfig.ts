export interface Configuration {
    port: number
    serviceName: string
    environment: string
    fees: {
        outsidePercent: number
    }
    docs: {
        enabled: boolean
    }
    apm: {
        serverUrl: string
        apiKey?: string
        secretToken?: string
        cloudProvider?: string
    }
    db: {
        host: string
        port: number
        user: string
        password: string
        database: string
        debug: boolean
        pool: {
            min: number
            max: number
        }
    }
    email: {
        notificator: string
        apiUrl: string
        apiKey: string
        secret: string
    }
    backend: {
        core: string
        brapi: string
        mercadoBitCoin: string
        curreyncyApi: string
        invest: string
    }
    token: {
        brapi: string
    }
    timezone: string
}

export enum EEnvironmentType {
    Develop = "develop",
    Production = "production",
    Test = "test"
}