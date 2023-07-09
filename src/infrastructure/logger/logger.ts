import { init } from "@ismaelalves/logger";
import { Config } from "@config/config";
import { EEnvironmentType } from "@config/types/IConfig";

const config = new Config();

export const {
  AxiosLogger,
  ExpressLogger,
  Logger,
  Redact,
  RequestLogger
} = init({
  PROJECT_NAME: config.get().serviceName,
  LOG_LEVEL: config.get().environment === EEnvironmentType.Test ? "fatal" : "debug"
});

