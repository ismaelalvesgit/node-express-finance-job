import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV ? `../.env.${process.env.NODE_ENV}` : "../.env";
dotenv.config({path: path.join(__dirname, env)});

export default {
    env: process.env.NODE_ENV || "development",
    timezone: process.env.TZ || "America/Fortaleza",
    coreApi: process.env.CORE_URL,
    brapi: process.env.BRAPI_URL,
    mercadoBitCoin: process.env.MERCADO_BITCOIN_URL,
    curreyncyApi: process.env.CURRENCY_URL,
    yahoo: process.env.YAHOO_FINANCE_URL,
    yahooKey: process.env.YAHOO_FINANCE_KEY,
    news: process.env.NEWS_URL,
    newsKey: process.env.NEWS_KEY,
    iexclound: process.env.IEXCLOUND_URL,
    iexcloundLimitUsage: parseInt(process.env.IEXCLOUND_LIMIT_USAGE || 50000),
    iexcloundKey: process.env.IEXCLOUND_KEY,
    iexcloundKeyAdmin: process.env.IEXCLOUND_KEY_ADMIN,
    yieldapi: process.env.YIELD_URL,
    db:{
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        debug: process.env.DB_DEBUG === "true"
    },
    redis:{
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || "6379"),
        prefix: process.env.REDIS_PREFIX || "finance:" 
    },
    apm:{
        serverUrl: process.env.APM_SERVER_URL,
        serviceName: process.env.APM_SERVICE_NAME,
        apiKey: process.env.APM_API_KEY,
        secretToken: process.env.APM_SECRET_TOKEN,
        cloudProvider: process.env.APM_CLOUND_PROVIDER || "none"
    },
    email:{
        notificator: process.env.EMAIL_USER,
        apiKey: process.env.EMAIL_API_KEY,
        secret: process.env.EMAIL_SECRET,
    },
    amqp:{
        protocol: process.env.AMQP_PROTOCOL,
        host: process.env.AMQP_HOSTNAME,
        port: parseInt(process.env.AMQP_PORT || "5672"),
        user: process.env.AMQP_USERNAME,
        password: process.env.AMQP_PASSWORD,
        vhost: process.env.AMQP_VHOST,
    },
    jobs:{
        autoBackup: process.env.BACKUP_DB === "true"
    },
    system:{
        fees: {
            outsidePercent: parseInt(process.env.FEES_OUTSIDE_PERCENT || "30")
        }
    }
};